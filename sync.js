/* My Hangout — sync across my devices through a private GitHub gist.
 *
 * What syncs: everything the app saves (journal, sessions, passions, things I avoid, people,
 * spells, kept videos, playlists, ladders, yoga path, settings).
 * What doesn't: audio/video in "My files" (too big for a gist) — add those on each device.
 *
 * How: a GitHub token with only the "gist" permission is pasted once per device. It stays in
 * this browser. The app keeps one secret gist named "My Hangout sync (private)".
 * Loaded before the other scripts so it can notice every save. */
(function () {
  "use strict";

  const KEYS = ["calm-player-v1", "my-hangout-v1"];
  const META_KEY = "my-hangout-sync";
  const DESC = "My Hangout sync (private)";
  const FILE = "my-hangout-data.json";
  const API = "https://api.github.com";

  const rawGet = Storage.prototype.getItem;
  const rawSet = Storage.prototype.setItem;
  let applying = false;
  let pushTimer = null;
  let busy = false;

  function readMeta() {
    try { return JSON.parse(rawGet.call(localStorage, META_KEY)) || {}; } catch (e) { return {}; }
  }
  let meta = readMeta();
  function writeMeta() { try { rawSet.call(localStorage, META_KEY, JSON.stringify(meta)); } catch (e) { /* ignore */ } }

  // Notice every real change the app saves.
  Storage.prototype.setItem = function (k, v) {
    let changed = false;
    if (this === localStorage && KEYS.includes(k) && !applying) {
      try { changed = rawGet.call(this, k) !== String(v); } catch (e) { changed = true; }
    }
    rawSet.call(this, k, v);
    if (changed) {
      meta.dirty = true;
      meta.localUpdated = Date.now();
      writeMeta();
      schedulePush();
    }
  };

  function connected() { return !!(meta.token && meta.gistId); }
  // Keys copied on a phone sometimes pick up spaces, line breaks, quotes or invisible characters.
  function cleanToken(t) { return String(t || "").replace(/[\s\u200B-\u200D\u2060\uFEFF"'“”‘’`<>]/g, ""); }
  function looksLikeKey(t) { return /^(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})$/.test(t); }
  const AUTH_MSG = "GitHub stopped accepting this device's key. It may have expired (GitHub's default is 30 days), been regenerated or deleted. Paste a key again — your sync file is kept.";

  function api(path, opts) {
    return fetch(API + path, Object.assign({}, opts, {
      headers: { Authorization: "Bearer " + meta.token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    })).then((r) => {
      if (r.status === 401) throw new Error("auth");
      if (r.status === 403 && r.headers.get("x-ratelimit-remaining") === "0") throw new Error("GitHub asked us to slow down — it will try again in a while");
      if (r.status === 404) throw new Error("not-found");
      if (!r.ok) throw new Error("GitHub said " + r.status);
      return r.status === 204 ? null : r.json();
    });
  }

  function bundle() {
    const stores = {};
    KEYS.forEach((k) => { try { stores[k] = JSON.parse(rawGet.call(localStorage, k)); } catch (e) { stores[k] = null; } });
    return { app: "my-hangout", v: 1, updated: meta.localUpdated || Date.now(), stores };
  }

  // Combine two copies so nothing is ever lost: the newer copy wins for settings, while journal
  // sessions, spells, my passions and things I avoid are combined entry by entry. Deletions are
  // remembered ("deleted" list) so a deleted entry never comes back.
  const LIST_FIELDS = ["sessions", "spells", "customPassions", "tasks", "people", "compost", "yoga", "spotify"];
  function merge(newer, older) {
    const out = JSON.parse(JSON.stringify(newer));
    out.stores = out.stores || {};
    const a = out.stores["my-hangout-v1"];
    const b = (older.stores || {})["my-hangout-v1"];
    if (a && b) {
      const del = new Set([].concat(a.deleted || [], b.deleted || []));
      a.deleted = Array.from(del);
      LIST_FIELDS.forEach((field) => {
        const list = (a[field] || []).slice();
        const have = new Set(list.map((x) => x && x.id));
        (b[field] || []).forEach((x) => { if (x && x.id && !have.has(x.id)) list.push(x); });
        a[field] = list.filter((x) => !(x && del.has(x.id)));
      });
      if (a.sessions) a.sessions.sort((x, y) => x.start - y.start);
      if (a.yoga) a.yoga.sort((x, y) => x.t - y.t);
      a.compostAdded = Math.max(a.compostAdded || 0, b.compostAdded || 0, (a.compost || []).length);
    } else if (!a && b) {
      out.stores["my-hangout-v1"] = b;
    }
    if (!out.stores["calm-player-v1"] && older.stores && older.stores["calm-player-v1"]) out.stores["calm-player-v1"] = older.stores["calm-player-v1"];
    out.updated = Math.max(newer.updated || 0, older.updated || 0);
    return out;
  }
  const same = (x, y) => JSON.stringify(x.stores) === JSON.stringify(y.stores);

  function applyRemote(remote) {
    applying = true;
    KEYS.forEach((k) => {
      const v = remote.stores && remote.stores[k];
      if (v) rawSet.call(localStorage, k, JSON.stringify(v));
    });
    applying = false;
    meta.lastSynced = remote.updated;
    meta.localUpdated = remote.updated;
    meta.dirty = false;
    writeMeta();
  }

  function readGist() {
    return api("/gists/" + meta.gistId).then((g) => {
      const f = g.files && g.files[FILE];
      if (!f) return null;
      if (!f.truncated) return JSON.parse(f.content || "null");
      return fetch(f.raw_url).then((r) => r.json());
    });
  }

  function writeGist(data) {
    return api("/gists/" + meta.gistId, {
      method: "PATCH",
      body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(data) } } }),
    });
  }

  function setStatus(text) {
    meta.status = text;
    meta.statusAt = Date.now();
    writeMeta();
    const el = document.getElementById("syncStatus");
    if (el) el.textContent = text;
    const d = document.getElementById("syncDialogStatus");
    if (d) d.textContent = text;
  }

  // Pull first; reload the page if another device had newer data.
  function sync(reason) {
    if (!connected() || busy || !navigator.onLine || meta.authFailed) return Promise.resolve();
    busy = true;
    return readGist().then((remote) => {
      const local = bundle();
      if (!remote || !remote.stores) {
        return writeGist(local).then(() => { meta.dirty = false; meta.lastSynced = local.updated; writeMeta(); setStatus("Synced just now"); });
      }
      const localFirst = meta.dirty && (local.updated || 0) >= (remote.updated || 0);
      const merged = localFirst ? merge(local, remote) : merge(remote, local);
      if (!localFirst) merged.updated = Math.max(remote.updated || 0, Date.now() - 1);
      const needWrite = !same(merged, remote);
      const needApply = !same(merged, local);
      const asked = reason === "connect" || reason === "manual";
      const write = needWrite ? writeGist(merged) : Promise.resolve();
      return write.then(() => {
        if (needApply) {
          if (!asked && userBusy()) {
            meta.lastSynced = 0; // apply next time
            writeMeta();
            setStatus("New changes from another device — they'll load when you're done");
            return;
          }
          applyRemote(merged);
          setStatus(needWrite ? "Synced just now — combined with another device" : "Synced just now");
          location.reload();
          return;
        }
        meta.dirty = false;
        meta.lastSynced = merged.updated;
        meta.localUpdated = merged.updated;
        writeMeta();
        setStatus(needWrite ? "Synced just now" : "Up to date");
      });
    }).catch((e) => {
      if (e.message === "not-found") { meta.gistId = ""; writeMeta(); setStatus("The sync gist was deleted — connect again"); return; }
      if (e.message === "auth") { meta.authFailed = true; writeMeta(); setStatus(AUTH_MSG); return; }
      setStatus("Couldn't sync: " + e.message);
    }).finally(() => { busy = false; });
  }

  // Don't reload under someone's fingers: mid-session, typing, or a dialog open.
  function userBusy() {
    const ae = document.activeElement;
    return document.body.classList.contains("flow-open") ||
      !!document.querySelector("dialog[open]") ||
      !!(ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.id !== "syncToken");
  }

  function schedulePush() {
    if (!connected()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => sync("change"), 4000);
  }

  function connect(token) {
    const clean = cleanToken(token);
    if (!looksLikeKey(clean)) {
      setStatus("That doesn't look like a complete GitHub key. It starts with ghp_ and is about 40 characters long — try copying it again.");
      return Promise.reject(new Error("format"));
    }
    const keepGist = meta.gistId;
    meta.token = clean;
    meta.authFailed = false;
    writeMeta();
    setStatus("Connecting…");
    return api("/gists?per_page=100").then((list) => {
      const found = (list || []).find((g) => g.id === keepGist) || (list || []).find((g) => g.description === DESC && g.files && g.files[FILE]);
      if (found) {
        meta.gistId = found.id;
        meta.lastSynced = 0; // take what's there (merging if this device has its own data)
        writeMeta();
        return sync("connect");
      }
      const data = bundle();
      return api("/gists", {
        method: "POST",
        body: JSON.stringify({ description: DESC, public: false, files: { [FILE]: { content: JSON.stringify(data) } } }),
      }).then((g) => {
        meta.gistId = g.id;
        meta.dirty = false;
        meta.lastSynced = data.updated;
        writeMeta();
        setStatus("Connected. This device is the first one — everything is saved.");
      });
    }).catch((e) => {
      meta.token = "";
      meta.gistId = keepGist || "";
      writeMeta();
      setStatus(e.message === "auth"
        ? "GitHub didn't accept that key. Check it has the “gist” box ticked and hasn't expired, or make a new one with “No expiration”."
        : "Couldn't connect: " + e.message);
      throw e;
    });
  }

  function disconnect() {
    meta = {};
    writeMeta();
    setStatus("Not syncing on this device");
  }

  /* ---------- Settings dialog ---------- */
  function ago(t) {
    if (!t) return "";
    const s = Math.round((Date.now() - t) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.round(s / 60) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " h ago";
    return new Date(t).toLocaleDateString();
  }
  function renderDialog() {
    const box = document.getElementById("syncBody");
    if (!box) return;
    if (connected() && meta.authFailed) {
      box.innerHTML =
        '<p class="sync-warn">Sync is paused on this device.</p>' +
        '<p class="muted small" id="syncDialogStatus">' + AUTH_MSG + "</p>" +
        '<p class="muted small">Check your keys on <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">GitHub → Settings → Tokens</a>. If it expired, make a new one <a href="https://github.com/settings/tokens/new?scopes=gist&amp;description=My%20Hangout%20sync" target="_blank" rel="noopener">here</a> with Expiration “No expiration” and only <b>gist</b> ticked.</p>' +
        '<label class="field">GitHub key<input type="text" id="syncToken" placeholder="ghp_…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>' +
        '<div class="flow-btns"><button type="button" class="btn-ghost-dark" id="syncOff">Stop syncing here</button>' +
        '<button type="button" class="btn-primary" id="syncConnect">Use this key</button></div>';
      return;
    }
    if (connected()) {
      box.innerHTML =
        '<p class="sync-ok">This device is syncing.</p>' +
        '<p class="muted small" id="syncDialogStatus">' + (meta.status || "") + (meta.lastSynced ? " · last synced " + ago(meta.lastSynced) : "") + "</p>" +
        "<p>Your journal, passions, people, spells, playlists and everything else you save are kept in a private gist in your GitHub account and appear on every device you connect. Files in “My files” stay on each device.</p>" +
        '<div class="flow-btns"><button type="button" class="btn-ghost-dark" id="syncOff">Stop syncing on this device</button>' +
        '<button type="button" class="btn-primary" id="syncNow">Sync now</button></div>';
    } else {
      box.innerHTML =
        "<p>Keep everything the same on your phone, laptop and any other device. Your data goes into a <b>private</b> gist in your own GitHub account — only you can see it.</p>" +
        '<ol class="sync-steps">' +
        '<li>Open <a href="https://github.com/settings/tokens/new?scopes=gist&amp;description=My%20Hangout%20sync" target="_blank" rel="noopener">this GitHub page</a> (sign in if asked).</li>' +
        "<li>Set <b>Expiration</b> to “No expiration” (or a date far away). Only <b>gist</b> should be ticked.</li>" +
        "<li>Press <b>Generate token</b> and copy the key that starts with <code>ghp_</code>.</li>" +
        "<li>Paste it below. Do the same on each device (you can reuse the same key).</li></ol>" +
        '<label class="field">GitHub key<input type="text" id="syncToken" placeholder="ghp_…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>' +
        '<p class="muted small" id="syncDialogStatus">' + (meta.status || "") + "</p>" +
        '<button type="button" class="btn-primary" id="syncConnect">Connect this device</button>' +
        '<p class="muted small">The key stays in this browser and can only read and write gists — not your code or anything else.</p>';
    }
  }

  document.addEventListener("click", function (e) {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.id === "syncOpen") { renderDialog(); document.getElementById("syncDialog").showModal(); }
    if (t.id === "syncClose") { document.getElementById("syncDialog").close(); setTimeout(() => sync("focus"), 50); }
    if (t.id === "syncConnect") {
      const v = document.getElementById("syncToken").value;
      if (!v.trim()) return;
      t.disabled = true;
      t.textContent = "Connecting…";
      connect(v).then(renderDialog, () => { renderDialog(); const f = document.getElementById("syncToken"); if (f) f.value = v; });
    }
    if (t.id === "syncNow") { meta.dirty = true; writeMeta(); sync("manual").then(renderDialog); }
    if (t.id === "syncOff") { if (confirm("Stop syncing on this device? Your data stays here and in the gist.")) { disconnect(); renderDialog(); } }
  });

  /* ---------- When to sync ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    const el = document.getElementById("syncStatus");
    if (el) el.textContent = connected() ? (meta.authFailed ? "Sync paused — tap to paste your key again" : (meta.status || "Syncing")) : "Not syncing yet";
    sync("open");
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") sync("focus");
    else if (meta.dirty) sync("leave");
  });
  window.addEventListener("online", function () { sync("online"); });
  setInterval(function () { if (document.visibilityState === "visible") sync("timer"); }, 2 * 60 * 1000);

  window.HangoutSync = { sync, connected: connected };
})();
