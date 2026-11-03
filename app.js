/* My Calm Player — plain JavaScript, no build step. */
(function () {
  "use strict";

  const DATA = window.CALM_DATA;
  const STORE_KEY = "calm-player-v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const FEELS = [
    { id: "gentle", label: "Gentle" },
    { id: "flow", label: "Flow" },
    { id: "strong", label: "Strong" },
    { id: "rest", label: "Rest & breathe" },
  ];
  const LEVELS = [
    { id: "beginner", label: "Beginner" },
    { id: "all", label: "All levels" },
    { id: "intermediate", label: "Intermediate" },
  ];
  const LENS = { short: "~15 min", mid: "~30 min", long: "60 min+" };
  const STATUSES = [
    { id: "totry", label: "To try" },
    { id: "trying", label: "Trying" },
    { id: "kept", label: "Kept" },
    { id: "no", label: "Not for me" },
  ];
  const SWATCHES = ["#D5DDCF", "#EBCFD3", "#DCD3E6", "#F3DCC8"];

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */

  function defaultState() {
    return {
      v: 2,
      name: "Julie",
      custom: [],
      hidden: [],
      customTeachers: [],
      teacherStatus: {},
      kept: [],
      notes: {},
      playlists: JSON.parse(JSON.stringify(DATA.playlists)),
      ladders: DATA.ladders.map((l) => ({ ...l, history: [] })),
      loved: "",
      filters: { feel: null, len: null, level: null, popular: null },
      pathTab: "all",
      currentPlaylist: DATA.playlists[0].id,
      current: DATA.playlists[0].items[0],
      sound: null,
      soundVol: 40,
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      const merged = { ...base, ...saved, filters: { ...base.filters, ...(saved.filters || {}) } };
      // New ladders added to data.js later still appear.
      const have = new Set(merged.ladders.map((l) => l.id));
      DATA.ladders.forEach((l) => { if (!have.has(l.id)) merged.ladders.push({ ...l, history: [] }); });
      if (!saved.v || saved.v < 2) migrateToKindPlaylists(merged);
      return merged;
    } catch (e) {
      return base;
    }
  }

  // v2: every playlist holds a single kind. Old starter lists are swapped for the new ones;
  // your own mixed lists are split into one list per kind.
  function migrateToKindPlaylists(st) {
    const OLD_STARTERS = ["morning-hatha", "strong-week", "move-joy"];
    const lib = DATA.videos.concat(st.custom || []);
    const sec = (id) => (lib.find((v) => v.id === id) || {}).section;
    const out = JSON.parse(JSON.stringify(DATA.playlists));
    (st.playlists || []).forEach((p) => {
      if (OLD_STARTERS.includes(p.id)) return;
      const groups = {};
      p.items.forEach((id) => { const k = sec(id); if (k) (groups[k] = groups[k] || []).push(id); });
      const kinds = Object.keys(groups);
      if (!kinds.length) { out.push({ ...p, kind: null }); return; }
      kinds.forEach((k, i) => {
        const label = (DATA.sections.find((x) => x.id === k) || {}).label || k;
        out.push({ id: kinds.length > 1 ? p.id + "-" + k : p.id, kind: k, name: kinds.length > 1 ? p.name + " · " + label : p.name, items: groups[k] });
      });
    });
    st.playlists = out;
    if (st.currentPlaylist && !out.some((p) => p.id === st.currentPlaylist)) st.currentPlaylist = out[0].id;
    st.v = 2;
  }

  let state = loadState();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode: keep working in memory */ }
  }

  /* ------------------------------------------------------------------ */
  /* Library helpers                                                    */
  /* ------------------------------------------------------------------ */

  function allVideos() { const h = state.hidden || []; return DATA.videos.filter((v) => !h.includes(v.id)).concat(state.custom); }
  function videoById(id) { return allVideos().find((v) => v.id === id) || null; }
  function allTeachers() { return DATA.teachers.concat(state.customTeachers); }
  function teacherById(id) { return allTeachers().find((t) => t.id === id) || null; }
  function teacherStatus(t) { return state.teacherStatus[t.id] || t.status || "totry"; }
  function sectionLabel(id) { const s = DATA.sections.find((x) => x.id === id); return s ? s.label : id; }
  function isKept(id) { return state.kept.includes(id); }
  function isCustom(id) { return state.custom.some((v) => v.id === id); }
  function thumb(id) { return "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg"; }
  function watchUrl(id) { return "https://www.youtube.com/watch?v=" + id; }

  function fmtLen(min) {
    if (!min) return "";
    if (min >= 120) return Math.round(min / 60) + " h";
    if (min >= 60) { const h = Math.floor(min / 60), m = min % 60; return h + " h" + (m ? " " + m : ""); }
    return min + " min";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function parseYouTubeId(input) {
    if (!input) return null;
    const s = input.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    let url;
    try { url = new URL(s.startsWith("http") ? s : "https://" + s); } catch (e) { return null; }
    const host = url.hostname.replace(/^www\.|^m\.|^music\./, "");
    let id = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
        if (m) id = m[1];
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }

  function matchesFilters(v) {
    const f = state.filters;
    if (f.popular && !v.popular) return false;
    if (f.feel && v.feel !== f.feel) return false;
    if (f.level && !(v.level === f.level || v.level === "all")) return false;
    if (f.len) {
      const m = v.min || 0;
      if (f.len === "short" && !(m > 0 && m <= 20)) return false;
      if (f.len === "mid" && !(m > 20 && m <= 45)) return false;
      if (f.len === "long" && !(m > 45)) return false;
    }
    return true;
  }

  function anyFilter() { const f = state.filters; return !!(f.feel || f.len || f.level || f.popular); }

  /* ------------------------------------------------------------------ */
  /* Toast                                                              */
  /* ------------------------------------------------------------------ */

  let toastTimer;
  function toast(msg, actionLabel, action) {
    const t = $("#toast");
    t.textContent = msg;
    if (actionLabel) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "toast-btn";
      b.textContent = actionLabel;
      b.addEventListener("click", () => { t.hidden = true; action(); });
      t.appendChild(b);
    }
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, actionLabel ? 7000 : 2600);
  }

  /* ------------------------------------------------------------------ */
  /* YouTube players                                                    */
  /* ------------------------------------------------------------------ */

  let ytReady = false;
  let ytLoading = false;
  const ytQueue = [];
  let mainPlayer = null;
  let soundPlayer = null;
  let playlistMode = false;

  function withYT(fn) {
    if (ytReady) { fn(); return; }
    ytQueue.push(fn);
    if (ytLoading) return;
    ytLoading = true;
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      ytReady = true;
      if (typeof prev === "function") prev();
      ytQueue.splice(0).forEach((f) => f());
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = function () {
      ytLoading = false;
      ytQueue.length = 0;
      showFrameMsg("YouTube didn't load.", "Check your connection, or open the video on YouTube.", state.current);
    };
    document.head.appendChild(s);
  }

  const PLAYER_VARS = { rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, autoplay: 1 };
  if (/^https?:$/.test(location.protocol)) PLAYER_VARS.origin = location.origin;

  function errorText(code) {
    if (code === 101 || code === 150) return "The owner doesn't allow this video to play outside YouTube.";
    if (code === 100) return "It may have been removed or made private.";
    if (code === 152 || code === 153) return "YouTube needs this page to be opened from a web address (not a file on your computer).";
    return "YouTube couldn't play it right now.";
  }

  function playMain(id) {
    const vv = videoById(id);
    if (vv) document.dispatchEvent(new CustomEvent("calm:play", { detail: { id: id, section: vv.section, title: vv.title } }));
    const frame = $("#frame");
    hideFrameMsg();
    frame.classList.add("playing");
    withYT(function () {
      if (mainPlayer && typeof mainPlayer.loadVideoById === "function") {
        mainPlayer.loadVideoById(id);
        return;
      }
      mainPlayer = new YT.Player("ytPlayer", {
        host: "https://www.youtube-nocookie.com",
        videoId: id,
        playerVars: PLAYER_VARS,
        events: {
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.ENDED && playlistMode) step(1, true);
          },
          onError: function (e) {
            showFrameMsg("This video can't play here.", errorText(e.data), state.current);
          },
        },
      });
    });
  }

  function showFrameMsg(title, text, id) {
    const box = $("#frameMsg");
    box.innerHTML = "<strong>" + esc(title) + "</strong><span>" + esc(text) + "</span>" +
      (id ? '<a href="' + watchUrl(id) + '" target="_blank" rel="noopener" style="color:#fff">Open on YouTube</a>' : "");
    box.hidden = false;
    $("#bigPlay").hidden = true;
  }
  function hideFrameMsg() {
    $("#frameMsg").hidden = true;
    $("#bigPlay").hidden = false;
  }

  const BG = DATA.background || { items: [], groups: [] };
  function bgById(id) { return BG.items.find((x) => x.id === id) || null; }
  function soundTitle(id) {
    if (!id) return "";
    if (id.startsWith("list:")) return BG.name ? "“" + BG.name + "” playlist" : "My playlist";
    if (id.startsWith("local:")) return (localById(id.slice(6)) || {}).name || "My file";
    return ((videoById(id) || bgById(id)) || {}).title || "Background sound";
  }
  function isListPlaying() { return (state.sound || "").startsWith("list:"); }

  let bgErrors = 0;
  function soundEvents() {
    return {
      onReady: function (e) {
        e.target.setVolume(state.soundVol);
        e.target.playVideo();
      },
      onStateChange: function (e) {
        // A single video loops; the whole playlist moves on by itself.
        if (e.data === YT.PlayerState.ENDED && !isListPlaying()) e.target.playVideo();
        if (e.data === YT.PlayerState.PLAYING) { bgErrors = 0; updateBgBar(); }
      },
      onError: function () {
        bgErrors++;
        if (isListPlaying() && bgErrors < 3 && soundPlayer && soundPlayer.nextVideo) { soundPlayer.nextVideo(); return; }
        bgErrors = 0;
        toast("That one can't play inside the app right now.");
        stopSound();
      },
    };
  }

  function afterSoundStart() {
    save();
    renderSoundChips();
    renderSoundGrid();
    renderBgGrid();
    updateBgBar();
  }

  function startSound(id) {
    stopLocal();
    state.sound = id;
    afterSoundStart();
    withYT(function () {
      if (soundPlayer && typeof soundPlayer.loadVideoById === "function") {
        soundPlayer.setLoop(false);
        soundPlayer.loadVideoById(id);
        soundPlayer.setVolume(state.soundVol);
        return;
      }
      soundPlayer = new YT.Player("ytSound", {
        host: "https://www.youtube-nocookie.com",
        videoId: id,
        playerVars: { ...PLAYER_VARS, controls: 0, loop: 1, playlist: id },
        events: soundEvents(),
      });
    });
  }

  function startBgList(shuffle) {
    if (!BG.playlistId) return;
    stopLocal();
    state.sound = "list:" + BG.playlistId;
    afterSoundStart();
    const startAt = shuffle ? Math.floor(Math.random() * Math.max(1, BG.items.length)) : 0;
    withYT(function () {
      const applyShuffle = () => {
        if (!soundPlayer || typeof soundPlayer.setShuffle !== "function") return;
        soundPlayer.setShuffle(!!shuffle);
        soundPlayer.setLoop(true);
      };
      if (soundPlayer && typeof soundPlayer.loadPlaylist === "function") {
        soundPlayer.loadPlaylist({ list: BG.playlistId, listType: "playlist", index: startAt });
        soundPlayer.setVolume(state.soundVol);
        setTimeout(applyShuffle, 1500);
        return;
      }
      soundPlayer = new YT.Player("ytSound", {
        host: "https://www.youtube-nocookie.com",
        playerVars: { ...PLAYER_VARS, controls: 0, listType: "playlist", list: BG.playlistId, index: startAt },
        events: soundEvents(),
      });
      setTimeout(applyShuffle, 2500);
    });
    toast(shuffle ? "Shuffling your background playlist" : "Playing your background playlist");
  }

  function stopSound() {
    state.sound = null;
    save();
    if (soundPlayer && typeof soundPlayer.stopVideo === "function") soundPlayer.stopVideo();
    stopLocal();
    renderSoundChips();
    renderSoundGrid();
    renderBgGrid();
    renderShelf();
    updateBgBar();
  }

  /* ---------- My files: audio/video kept in this browser (IndexedDB), playable offline ---------- */
  const FILES_DB = "calm-player-files";
  let localFiles = [];
  let localUrl = null;
  const localAudio = $("#localAudio");

  function idb() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(FILES_DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("files", { keyPath: "id" });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  function idbTx(mode, fn) {
    return idb().then((db) => new Promise((res, rej) => {
      const tx = db.transaction("files", mode);
      const out = fn(tx.objectStore("files"));
      tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      tx.onerror = () => rej(tx.error);
      tx.onabort = () => rej(tx.error);
    }));
  }
  function loadLocalFiles() {
    if (!("indexedDB" in window)) return Promise.resolve([]);
    return idbTx("readonly", (st) => st.getAll()).then((all) => {
      localFiles = (all || []).sort((a, b) => a.added - b.added);
      return localFiles;
    }).catch(() => []);
  }
  function cleanName(n) {
    return n.replace(/\.[^.]+$/, "").replace(/^[0-9a-f]{8}-/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function fmtSize(b) { return b >= 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1e3)) + " KB"; }
  function isLocalPlaying() { return (state.sound || "").startsWith("local:"); }
  function localById(id) { return localFiles.find((f) => f.id === id) || null; }

  function addLocalFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => /^(audio|video)\//.test(f.type) || /\.(mp3|m4a|aac|wav|ogg|oga|flac|opus|mp4|webm)$/i.test(f.name));
    if (!files.length) { toast("Pick audio or video files"); return; }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    let added = 0;
    const jobs = files.map((f) => {
      const rec = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name: cleanName(f.name), type: f.type || "audio/mpeg", size: f.size, added: Date.now(), blob: f };
      return idbTx("readwrite", (st) => st.put(rec)).then(() => { added++; }).catch(() => {});
    });
    Promise.all(jobs).then(loadLocalFiles).then(() => {
      renderShelf();
      renderSoundChips();
      toast(added === files.length
        ? (added === 1 ? "Saved — plays offline now" : added + " files saved — they play offline now")
        : "Some files didn't fit in this browser's storage");
    });
  }

  function removeLocal(id) {
    const f = localById(id);
    if (!f || !confirm("Remove “" + f.name + "” from My files on this device?")) return;
    if (state.sound === "local:" + id) stopSound();
    idbTx("readwrite", (st) => st.delete(id)).then(loadLocalFiles).then(() => {
      renderShelf();
      renderSoundChips();
      toast("Removed");
    });
  }

  function stopLocal() {
    if (!localAudio.paused) localAudio.pause();
  }

  function playLocal(id) {
    const f = localById(id);
    if (!f) return;
    if (soundPlayer && typeof soundPlayer.stopVideo === "function") soundPlayer.stopVideo();
    if (localUrl) URL.revokeObjectURL(localUrl);
    localUrl = URL.createObjectURL(f.blob);
    localAudio.src = localUrl;
    localAudio.loop = true;
    localAudio.volume = state.soundVol / 100;
    state.sound = "local:" + id;
    localAudio.play().catch(() => toast("Tap play again — your browser wants a tap first"));
    if ("mediaSession" in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: f.name, artist: "My files", album: "My Calm Player" });
      try {
        navigator.mediaSession.setActionHandler("play", () => localAudio.play());
        navigator.mediaSession.setActionHandler("pause", () => localAudio.pause());
        navigator.mediaSession.setActionHandler("stop", stopSound);
      } catch (e) { /* older browsers */ }
    }
    renderShelf();
    renderSoundChips();
    renderSoundGrid();
    renderBgGrid();
    updateBgBar();
  }

  function renderShelf() {
    const grid = $("#grid-files");
    if (!grid) return;
    if (!localFiles.length) {
      grid.innerHTML = '<p class="empty">Nothing here yet. Add audio or video files from this device — they stay on this device and play with no internet.</p>';
    } else {
      grid.innerHTML = localFiles.map((f) => {
        const on = state.sound === "local:" + f.id;
        return '<article class="bg-tile file-tile' + (on ? " on" : "") + '">' +
          '<span class="file-icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg></span>' +
          '<div class="bg-text"><b>' + esc(f.name) + "</b><span>" + fmtSize(f.size) + " · saved on this device</span></div>" +
          '<div class="file-actions">' +
          (on
            ? '<button type="button" class="bg-btn" data-sound-off>Stop</button>'
            : '<button type="button" class="bg-btn" data-local-play="' + f.id + '" aria-label="Play ' + esc(f.name) + '">Play</button>') +
          '<button type="button" class="bg-btn" data-local-remove="' + f.id + '" aria-label="Remove ' + esc(f.name) + '">Remove</button>' +
          "</div></article>";
      }).join("");
    }
    const info = $("#storageInfo");
    if (navigator.storage && navigator.storage.estimate) {
      Promise.all([navigator.storage.estimate(), navigator.storage.persisted ? navigator.storage.persisted() : Promise.resolve(false)])
        .then(([est, kept]) => {
          const used = localFiles.reduce((n, f) => n + (f.size || 0), 0);
          info.textContent = localFiles.length + (localFiles.length === 1 ? " file · " : " files · ") + fmtSize(used) +
            (est && est.quota ? " of about " + fmtSize(est.quota) + " available" : "") +
            (kept ? " · kept permanently" : "");
        }).catch(() => {});
    }
  }

  function updateBgBar() {
    const on = !!state.sound;
    $("#bgBar").hidden = !on;
    document.body.classList.toggle("bg-on", on);
    if (!on) return;
    let now = soundTitle(state.sound);
    if (isListPlaying() && soundPlayer && typeof soundPlayer.getVideoData === "function") {
      const d = soundPlayer.getVideoData();
      if (d && d.title) now = d.title;
    }
    $("#bgNowTitle").textContent = now;
    $("#bgNowKind").textContent = isListPlaying() ? "Background · " + (BG.name || "playlist") : isLocalPlaying() ? "My files · offline" : "Playing underneath";
    $("#soundMiniWrap").hidden = isLocalPlaying();
    $("#localIcon").hidden = !isLocalPlaying();
    $("#bgPrev").hidden = $("#bgNext").hidden = !isListPlaying();
    $("#bgVol").value = state.soundVol;
  }

  function renderBgGrid() {
    const grid = $("#grid-bg");
    if (!grid) return;
    const gsel = state.bgGroup || "";
    $$("#bgGroups [data-bg-group]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bgGroup === gsel)));
    const list = BG.items.filter((x) => !gsel || x.group === gsel);
    grid.innerHTML = list.map((x) => {
      const on = state.sound === x.id;
      const playBtn = x.embed === false
        ? '<a class="bg-btn" href="' + watchUrl(x.id) + '" target="_blank" rel="noopener">Open on YouTube</a>'
        : on
          ? '<button type="button" class="bg-btn" data-sound-off>Stop</button>'
          : '<button type="button" class="bg-btn" data-bg-play="' + x.id + '" aria-label="Play ' + esc(x.title) + ' in the background">Play in background</button>';
      return '<article class="bg-tile' + (on ? " on" : "") + '">' +
        '<img src="' + thumb(x.id) + '" alt="" loading="lazy">' +
        '<div class="bg-text"><b>' + esc(x.title) + '</b><span>' + esc(x.channel) +
        (x.embed === false ? " · plays on YouTube only" : "") + "</span></div>" + playBtn + "</article>";
    }).join("") || '<p class="empty">Nothing in this group.</p>';
    const listBtnOn = isListPlaying();
    $("#bgPlayAll").textContent = listBtnOn ? "Playing all" : "Play all";
  }

  /* ------------------------------------------------------------------ */
  /* Selecting & playing                                                */
  /* ------------------------------------------------------------------ */

  function select(id, opts = {}) {
    const v = videoById(id);
    if (!v) return;
    if (v.section === "sound" && !opts.asMain) {
      // Soundscapes play underneath whatever is on screen.
      startSound(id);
      toast("Playing " + v.title + " underneath");
      return;
    }
    state.current = id;
    if (!opts.keepPlaylistMode) playlistMode = false;
    save();
    renderNow();
    renderQueue();
    highlightCards();
    if (opts.play) playMain(id);
    if (opts.scroll) $("#frame").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function currentPlaylist() {
    const id = state.currentPlaylist || "";
    if (id.startsWith("ch:")) {
      const c = channelLists().find((x) => x.id === id);
      if (c) return c;
    }
    return state.playlists.find((p) => p.id === id) || state.playlists[0] || null;
  }

  function playlistKind(p) {
    if (p.kind) return p.kind;
    const first = p.items.map(videoById).find(Boolean);
    return first ? first.section : null;
  }

  /* Automatic playlists: every video in the library by one person/channel, one list per kind. */
  const KIND_ORDER = ["yoga", "move", "flex", "pilates", "dance", "sound"];
  function channelKey(kind, channel) { return "ch:" + kind + ":" + channel; }
  function channelLists() {
    const map = new Map();
    allVideos().forEach((v) => {
      if (!v.channel) return;
      const key = channelKey(v.section, v.channel);
      if (!map.has(key)) map.set(key, { id: key, kind: v.section, channel: v.channel, name: v.channel + " · " + sectionLabel(v.section), items: [], virtual: true });
      map.get(key).items.push(v.id);
    });
    return Array.from(map.values()).sort((a, b) =>
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || b.items.length - a.items.length || a.channel.localeCompare(b.channel));
  }

  function mostCommon(list) {
    const c = {};
    list.forEach((x) => { if (x) c[x] = (c[x] || 0) + 1; });
    return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || "";
  }

  function step(dir, auto) {
    const pl = currentPlaylist();
    if (!pl || !pl.items.length) { toast("This playlist is empty"); return; }
    const items = pl.items.filter((id) => videoById(id));
    let i = items.indexOf(state.current);
    let n = i === -1 ? (dir > 0 ? 0 : items.length - 1) : i + dir;
    if (n >= items.length || n < 0) {
      if (auto) { playlistMode = false; toast("Playlist finished. Rest a moment."); return; }
      n = (n + items.length) % items.length;
    }
    select(items[n], { play: true, keepPlaylistMode: auto || playlistMode });
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */

  function renderGreeting() {
    const h = new Date().getHours();
    const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    $("#greeting").textContent = part + (state.name ? ", " + state.name : "") + ". What does your body want?";
  }

  function renderNav() {
    const links = DATA.sections.map((s) => ({ href: "#" + s.id, label: s.label }));
    if (state.kept.length) links.unshift({ href: "#kept", label: "♡ Kept" });
    if (BG.items.length) links.push({ href: "#background", label: "Background" });
    links.push({ href: "#shelf", label: "My files" });
    links.push({ href: "#lists", label: "Playlists" });
    $("#nav").innerHTML = links.map((l) => '<a href="' + l.href + '">' + esc(l.label) + "</a>").join("");
    observeSections();
  }

  let sectionObserver;
  function observeSections() {
    if (!("IntersectionObserver" in window)) return;
    if (sectionObserver) sectionObserver.disconnect();
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$("#nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".block").forEach((s) => { if (!s.hidden) sectionObserver.observe(s); });
  }

  function renderFilters() {
    $$("#filters [data-filter]").forEach((b) => {
      b.setAttribute("aria-pressed", String(state.filters[b.dataset.filter] === b.dataset.value));
    });
    $("#clearFilters").hidden = !anyFilter();
    const sum = $("#filterSummary");
    if (!anyFilter()) { sum.textContent = ""; return; }
    const n = allVideos().filter((v) => v.section !== "sound" && matchesFilters(v)).length;
    const bits = [];
    if (state.filters.popular) bits.push("Popular");
    if (state.filters.feel) bits.push(FEELS.find((f) => f.id === state.filters.feel).label);
    if (state.filters.len) bits.push(LENS[state.filters.len]);
    if (state.filters.level) bits.push(state.filters.level === "beginner" ? "Beginner-friendly" : "Intermediate");
    sum.textContent = n + (n === 1 ? " class" : " classes") + " · " + bits.join(" · ");
  }

  function renderNow() {
    const v = videoById(state.current);
    const poster = $("#poster");
    if (!v) {
      $("#nowEyebrow").textContent = "Nothing playing";
      $("#nowTitle").textContent = "Pick something calm";
      $("#nowChannel").textContent = "";
      $("#nowNote").hidden = true;
      poster.removeAttribute("src");
      $("#keepBtn").disabled = true;
      $("#removeNowBtn").disabled = true;
      $("#toPlaylistBtn").disabled = true;
      $("#ratePanel").hidden = true;
      if (!mainPlayer) showFrameMsg("Pick something calm.", "Choose any class below or a playlist on the right.", null);
      return;
    }
    $("#keepBtn").disabled = false;
    $("#removeNowBtn").disabled = false;
    $("#toPlaylistBtn").disabled = false;
    const pl = currentPlaylist();
    const pos = pl ? pl.items.indexOf(v.id) : -1;
    $("#nowEyebrow").textContent = "Now playing · " + (v.style || sectionLabel(v.section)) +
      (pos > -1 ? " · " + (pos + 1) + " of " + pl.items.length : "");
    $("#nowTitle").textContent = v.title;
    const t = v.teacher ? teacherById(v.teacher) : null;
    $("#nowChannel").textContent = [v.channel, fmtLen(v.min)].filter(Boolean).join(" · ");
    const note = state.notes[v.id] || v.note;
    $("#nowNote").hidden = !note;
    $("#nowNote").textContent = note ? "My note: " + note : "";
    if (!mainPlayer) {
      poster.src = thumb(v.id);
      hideFrameMsg();
    }
    const keep = $("#keepBtn");
    keep.setAttribute("aria-pressed", String(isKept(v.id)));
    keep.textContent = isKept(v.id) ? "♥ Kept" : "♡ Keep";

    // After-class rating appears for classes linked to a teacher on the yoga path.
    const rate = $("#ratePanel");
    rate.hidden = !t;
    if (t) {
      $("#rateTitle").textContent = "After class, how was " + t.name + "?";
      const s = teacherStatus(t);
      $$(".rate", rate).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rate === s)));
    }
  }

  function renderPlaylistSelect() {
    const sel = $("#playlistSelect");
    const chans = channelLists().filter((c) => c.kind !== "sound");
    sel.innerHTML = '<optgroup label="My playlists">' +
      state.playlists.map((p) => '<option value="' + esc(p.id) + '">' + esc(p.name) + "</option>").join("") +
      '</optgroup><optgroup label="By person / channel">' +
      chans.map((c) => '<option value="' + esc(c.id) + '">' + esc(c.name) + " (" + c.items.length + ")</option>").join("") +
      "</optgroup>";
    const known = state.playlists.some((p) => p.id === state.currentPlaylist) || chans.some((c) => c.id === state.currentPlaylist);
    if (!known && state.playlists[0]) state.currentPlaylist = state.playlists[0].id;
    sel.value = state.currentPlaylist;
  }

  function renderQueue() {
    const pl = currentPlaylist();
    const q = $("#queue");
    if (!pl) {
      q.innerHTML = '<li class="queue-empty">No playlists yet — make one below.</li>';
      $("#playlistCount").textContent = "";
      return;
    }
    const items = pl.items.map(videoById).filter(Boolean);
    $("#playlistCount").textContent = "playlist · " + items.length;
    if (!items.length) {
      q.innerHTML = '<li class="queue-empty">Empty. Use “Add to playlist” on any class.</li>';
      return;
    }
    q.innerHTML = items.map((v) => {
      const cur = v.id === state.current;
      return '<li><button type="button" class="queue-item' + (cur ? " current" : "") + '" data-play="' + v.id + '"' +
        (cur ? ' aria-current="true"' : "") + ">" +
        '<img src="' + thumb(v.id) + '" alt="" loading="lazy">' +
        '<span class="queue-text"><b>' + esc(v.title) + "</b><span>" +
        (cur ? "playing" : esc([v.channel, fmtLen(v.min)].filter(Boolean).join(" · "))) +
        "</span></span></button></li>";
    }).join("");
  }

  function tagsHtml(v) {
    const out = [];
    if (v.popular) out.push('<span class="tag pop">★ Popular' + (v.views ? " · " + esc(v.views) + " views" : "") + "</span>");
    const lv = LEVELS.find((l) => l.id === v.level);
    if (lv) out.push('<span class="tag sage">' + esc(lv.label) + "</span>");
    const fe = FEELS.find((f) => f.id === v.feel);
    if (fe) out.push('<span class="tag pink">' + esc(fe.label) + "</span>");
    if (v.style) out.push('<span class="tag lilac">' + esc(v.style) + "</span>");
    if (isCustom(v.id)) out.push('<span class="tag">Added by me</span>');
    return out.join("");
  }

  function cardHtml(v) {
    const kept = isKept(v.id);
    return '<article class="card' + (v.id === state.current ? " current" : "") + '" data-card="' + v.id + '">' +
      '<button type="button" class="card-thumb" data-play="' + v.id + '" aria-label="Play ' + esc(v.title) + '">' +
      '<img src="' + thumb(v.id) + '" alt="" loading="lazy">' +
      (v.min ? '<span class="len">' + fmtLen(v.min) + "</span>" : "") +
      '<span class="play-dot" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' +
      "</button>" +
      '<span class="card-title">' + esc(v.title) + "</span>" +
      '<span class="card-sub">' + esc(v.channel || "") + "</span>" +
      '<div class="card-tags">' + tagsHtml(v) + "</div>" +
      '<div class="card-foot">' +
      '<button type="button" class="btn-soft" data-keep="' + v.id + '" aria-pressed="' + kept + '" aria-label="' + (kept ? "Unkeep " : "Keep ") + esc(v.title) + '">' + (kept ? "♥ Kept" : "♡ Keep") + "</button>" +
      '<button type="button" class="btn-soft" data-addto="' + v.id + '" aria-haspopup="true">+ Playlist</button>' +
      '<span class="spacer"></span>' +
      '<button type="button" class="icon-btn small" data-remove="' + v.id + '" aria-label="Remove ' + esc(v.title) + ' from my library" title="Remove from my library"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>' +
      "</div></article>";
  }

  function renderGrid(section) {
    const grid = $("#grid-" + section);
    if (!grid) return;
    const list = allVideos().filter((v) => v.section === section);
    const shown = list.filter(matchesFilters);
    if (!list.length) {
      grid.innerHTML = '<p class="empty">Nothing here yet. Use “+ Add video or teacher” to add your first one.</p>';
    } else if (!shown.length) {
      grid.innerHTML = '<p class="empty">Nothing in ' + esc(sectionLabel(section)) + " matches these filters.</p>";
    } else {
      grid.innerHTML = shown.map(cardHtml).join("");
    }
  }

  function renderKept() {
    const sec = $("#kept");
    const list = state.kept.map(videoById).filter((v) => v && v.section !== "sound");
    sec.hidden = !list.length;
    $("#grid-kept").innerHTML = list.map(cardHtml).join("");
  }

  function renderAllGrids() {
    if (!$("#playlistPop").hidden) closePop();
    ["yoga", "move", "flex", "pilates", "dance"].forEach(renderGrid);
    renderKept();
    renderSoundGrid();
    renderFilters();
  }

  function highlightCards() {
    $$(".card").forEach((c) => c.classList.toggle("current", c.dataset.card === state.current));
  }

  /* Teachers */
  function renderTeachers() {
    const teachers = allTeachers();
    const counts = { totry: 0, trying: 0, kept: 0, no: 0 };
    teachers.forEach((t) => { counts[teacherStatus(t)]++; });
    $("#pathSummary").textContent = "Try one class, then decide. " + counts.kept + " kept · " + counts.trying + " trying · " + counts.totry + " to try";
    $$("#pathTabs .pill").forEach((b) => b.classList.toggle("active", b.dataset.status === state.pathTab));
    $$("#pathTabs .pill").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === state.pathTab)));
    const shown = teachers.filter((t) => state.pathTab === "all" || teacherStatus(t) === state.pathTab);
    const grid = $("#teacherGrid");
    if (!shown.length) {
      grid.innerHTML = '<p class="empty">No teachers here yet.</p>';
      return;
    }
    grid.innerHTML = shown.map((t, i) => {
      const s = teacherStatus(t);
      const classes = allVideos().filter((v) => v.teacher === t.id);
      const first = classes[0];
      const colour = SWATCHES[teachers.indexOf(t) % SWATCHES.length];
      return '<article class="teacher' + (s === "no" ? " no" : "") + '">' +
        '<div class="teacher-top"><span class="avatar" style="background:' + colour + '" aria-hidden="true">' + esc(t.name.charAt(0)) + "</span>" +
        '<div><div class="teacher-name">' + esc(t.name) + '</div><div class="teacher-where">' + esc(t.where || "") + "</div>" + (t.popular ? '<span class="tag pop">★ Popular channel</span>' : "") + "</div></div>" +
        '<div class="teacher-meta">' + classes.length + (classes.length === 1 ? " class" : " classes") + " in my library</div>" +
        '<div class="status-row" role="group" aria-label="Status for ' + esc(t.name) + '">' +
        STATUSES.map((st) => '<button type="button" class="status-btn" data-teacher="' + esc(t.id) + '" data-s="' + st.id + '" aria-pressed="' + (s === st.id) + '">' + st.label + "</button>").join("") +
        "</div>" +
        '<div class="teacher-actions">' +
        (first
          ? '<button type="button" class="btn-dark" data-play="' + first.id + '">' + (s === "totry" ? "Play a first class" : "Play a class") + "</button>"
          : '<span class="muted small">No class yet — add one with + Add.</span>') +
        "</div></article>";
    }).join("");
  }

  /* Ladders */
  function renderLadders() {
    $("#ladderGrid").innerHTML = state.ladders.map((l) => {
      const rungs = l.steps.map((_, i) => '<span class="' + (i <= l.step ? "done" : "") + '"></span>').join("");
      const path = l.steps.map((s, i) => (i === l.step ? "<b>" + esc(s) + "</b>" : esc(s))).join(" → ");
      const hist = (l.history || []).slice(-3).reverse();
      return '<article class="ladder" data-ladder="' + esc(l.id) + '">' +
        '<span class="eyebrow">' + esc(l.label) + "</span>" +
        '<span class="ladder-name">' + esc(l.steps[l.step]) + "</span>" +
        '<div class="rungs" role="img" aria-label="Step ' + (l.step + 1) + " of " + l.steps.length + '">' + rungs + "</div>" +
        '<span class="ladder-path">' + path + "</span>" +
        "<span>Last time: " + esc(l.last || "—") + "</span>" +
        '<form class="ladder-log" data-log="' + esc(l.id) + '">' +
        '<label class="sr-only" for="log-' + esc(l.id) + '">Log reps for ' + esc(l.label) + "</label>" +
        '<input id="log-' + esc(l.id) + '" placeholder="e.g. 3 × 12" maxlength="40" autocomplete="off">' +
        '<button type="submit" class="btn-dark">Log</button></form>' +
        (hist.length ? '<ul class="ladder-hist">' + hist.map((h) => "<li>" + esc(h.date) + " · " + esc(h.step) + " · " + esc(h.text) + "</li>").join("") + "</ul>" : "") +
        '<div class="ladder-steps">' +
        '<button type="button" class="btn-soft" data-ladder-step="-1" ' + (l.step === 0 ? "disabled" : "") + ">Step back</button>" +
        '<button type="button" class="btn-soft" data-ladder-step="1" ' + (l.step >= l.steps.length - 1 ? "disabled" : "") + ">Move up a step</button>" +
        "</div></article>";
    }).join("");
  }

  /* Soundscapes */
  function soundList() { return allVideos().filter((v) => v.section === "sound"); }

  function renderSoundGrid() {
    const tints = ["#D5DDCF", "#DCD3E6", "#EBCFD3", "#FFFFFF"];
    $("#grid-sound").innerHTML = soundList().map((v, i) => {
      const on = state.sound === v.id;
      return '<div class="sound-tile' + (on ? " on" : "") + '" style="background:' + tints[i % tints.length] + '">' +
        "<span>" + esc(v.title) + '<br><span class="sub-line">' + esc(v.channel) + " · " + fmtLen(v.min) + (v.popular ? " · ★ " + esc(v.views) + " views" : "") + "</span></span>" +
        '<div class="row">' +
        (on
          ? '<button type="button" data-sound-off>Stop</button>'
          : '<button type="button" data-sound="' + v.id + '" aria-label="Play ' + esc(v.title) + ' underneath">Play underneath</button>') +
        '<button type="button" data-play-main="' + v.id + '" aria-label="Watch ' + esc(v.title) + ' in the main player">Watch</button>' +
        '<button type="button" data-remove="' + v.id + '" aria-label="Remove ' + esc(v.title) + ' from my library">Remove</button>' +
        "</div></div>";
    }).join("") || '<p class="empty">No soundscapes yet.</p>';
  }

  function renderSoundChips() {
    const chips = [{ id: "", title: "Off" }].concat(
      BG.playlistId ? [{ id: "list:" + BG.playlistId, title: "My background playlist" }] : [],
      localFiles.map((f) => ({ id: "local:" + f.id, title: f.name + " (offline)" })),
      soundList());
    $("#soundChips").innerHTML = chips.map((s) =>
      '<button type="button" class="chip" data-sound-chip="' + s.id + '" aria-pressed="' + ((state.sound || "") === s.id) + '">' + esc(s.title) + "</button>"
    ).join("");
    $("#soundVol").value = state.soundVol;
    const btn = $("#soundUnderBtn");
    btn.textContent = state.sound ? "Sound: " + soundTitle(state.sound) : "Sound under it";
  }

  /* Playlists section */
  function renderPlaylists() {
    renderPlaylistSelect();
    const grid = $("#playlistGrid");
    if (!state.playlists.length) {
      grid.innerHTML = '<p class="empty">No playlists yet.</p>';
      return;
    }
    grid.innerHTML = state.playlists.map((p) => {
      const items = p.items.map(videoById).filter(Boolean);
      return '<article class="plist" data-plist="' + esc(p.id) + '">' +
        '<div class="plist-head"><label class="sr-only" for="pn-' + esc(p.id) + '">Playlist name</label>' +
        '<input id="pn-' + esc(p.id) + '" value="' + esc(p.name) + '" data-rename="' + esc(p.id) + '" maxlength="40">' +
        '<span class="tag lilac">' + esc(sectionLabel(playlistKind(p) || "")) + "</span>" +
        '<span class="muted small">' + items.length + "</span></div>" +
        (items.length
          ? "<ol>" + items.map((v, i) => "<li>" +
            '<span class="t">' + (i + 1) + ". " + esc(v.title) + "</span>" +
            '<button type="button" class="icon-btn" data-move="' + esc(p.id) + '" data-i="' + i + '" data-dir="-1" aria-label="Move ' + esc(v.title) + ' up" ' + (i === 0 ? "disabled" : "") + '><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
            '<button type="button" class="icon-btn" data-move="' + esc(p.id) + '" data-i="' + i + '" data-dir="1" aria-label="Move ' + esc(v.title) + ' down" ' + (i === items.length - 1 ? "disabled" : "") + '><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
            '<button type="button" class="icon-btn" data-unlist="' + esc(p.id) + '" data-id="' + v.id + '" aria-label="Remove ' + esc(v.title) + ' from playlist"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
            "</li>").join("") + "</ol>"
          : '<p class="muted small">Empty — use “+ Playlist” on any class.</p>') +
        '<div class="plist-foot">' +
        '<button type="button" class="btn-dark grow" data-play-list="' + esc(p.id) + '" ' + (items.length ? "" : "disabled") + ">Play</button>" +
        '<button type="button" class="btn-soft" data-del-list="' + esc(p.id) + '">Delete</button>' +
        "</div></article>";
    }).join("");
  }

  function renderRestore() {
    const n = (state.hidden || []).length;
    $("#restoreWrap").hidden = !n;
    $("#restoreBtn").textContent = "Restore " + n + " removed " + (n === 1 ? "video" : "videos");
  }

  function renderChannels() {
    const lists = channelLists();
    const box = $("#channelLists");
    box.innerHTML = KIND_ORDER.map((kind, ki) => {
      const ls = lists.filter((c) => c.kind === kind);
      if (!ls.length) return "";
      return '<details class="chan-group"' + (ki === 0 ? " open" : "") + "><summary>" + esc(sectionLabel(kind)) +
        ' <span class="muted small">· ' + ls.length + (ls.length === 1 ? " person" : " people") + "</span></summary>" +
        '<div class="chan-list">' + ls.map((c) => {
          const pop = c.items.some((id) => (videoById(id) || {}).popular);
          return '<div class="chan-row">' +
            '<div class="chan-info"><b>' + esc(c.channel) + "</b>" +
            '<span class="muted small">' + c.items.length + (c.items.length === 1 ? " video" : " videos") + (pop ? " · ★ popular" : "") + "</span></div>" +
            (kind === "sound"
              ? '<button type="button" class="btn-soft" data-sound="' + c.items[0] + '">Play underneath</button>'
              : '<button type="button" class="btn-dark" data-play-list="' + esc(c.id) + '">Play all</button>') +
            '<form class="chan-add" data-chan-add="' + esc(c.id) + '">' +
            '<label class="sr-only" for="ca-' + esc(c.id) + '">Add a ' + esc(c.channel) + ' video by link</label>' +
            '<input type="url" id="ca-' + esc(c.id) + '" placeholder="Paste a ' + esc(c.channel) + ' video link" autocomplete="off">' +
            '<button type="submit" class="btn-soft">Add</button></form>' +
            "</div>";
        }).join("") + "</div></details>";
    }).join("");
  }

  function renderBgGroups() {
    const box = $("#bgGroups");
    if (!box) return;
    box.innerHTML = [{ id: "", label: "All" }].concat(BG.groups).map((g) =>
      '<button type="button" class="chip" data-bg-group="' + g.id + '" aria-pressed="false">' + esc(g.label) +
      ' <span class="muted small">' + BG.items.filter((x) => !g.id || x.group === g.id).length + "</span></button>").join("");
  }

  function renderAll() {
    renderBgGroups();
    renderBgGrid();
    updateBgBar();
    renderRestore();
    renderGreeting();
    renderNav();
    renderNow();
    renderPlaylists();
    renderChannels();
    renderQueue();
    renderAllGrids();
    renderTeachers();
    renderLadders();
    renderSoundChips();
    $("#lovedNote").value = state.loved || "";
  }

  /* ------------------------------------------------------------------ */
  /* Playlist popover                                                   */
  /* ------------------------------------------------------------------ */

  let popFor = null;
  let popAnchor = null;

  function openPop(anchor, videoId) {
    const pop = $("#playlistPop");
    if (popAnchor === anchor && !pop.hidden) { closePop(); return; }
    closePop();
    popFor = videoId;
    popAnchor = anchor;
    const v = videoById(videoId);
    const kind = v ? v.section : null;
    const same = state.playlists.filter((p) => { const k = playlistKind(p); return !k || k === kind; });
    pop.innerHTML = (same.length ? "" : '<span class="pop-note">No ' + esc(sectionLabel(kind)) + " playlists yet</span>") +
      same.map((p) => {
        const has = p.items.includes(videoId);
        return '<button type="button" data-pop-pl="' + esc(p.id) + '">' + (has ? "✓ " : "") + esc(p.name) + "</button>";
      }).join("") + '<button type="button" class="pop-new" data-pop-new>+ New ' + esc(sectionLabel(kind)) + " playlist…</button>";
    // Place the popover next to whichever button opened it.
    const wrap = anchor.closest(".pop-wrap");
    if (wrap) wrap.appendChild(pop);
    else {
      let host = anchor.parentElement;
      host.style.position = "relative";
      host.appendChild(pop);
    }
    pop.hidden = false;
    anchor.setAttribute("aria-expanded", "true");
    const firstBtn = pop.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }

  function closePop() {
    const pop = $("#playlistPop");
    pop.hidden = true;
    // Return the popover to its home so re-rendering a card grid can't destroy it.
    const home = $("#toPlaylistBtn").closest(".pop-wrap");
    if (pop.parentElement !== home) home.appendChild(pop);
    if (popAnchor) popAnchor.setAttribute("aria-expanded", "false");
    popAnchor = null;
    popFor = null;
  }

  function addToPlaylist(plId, videoId) {
    const p = state.playlists.find((x) => x.id === plId);
    if (!p) return;
    const v = videoById(videoId);
    const k = playlistKind(p);
    if (v && k && k !== v.section && !p.items.includes(videoId)) {
      toast(p.name + " is a " + sectionLabel(k) + " playlist");
      return;
    }
    if (!p.kind && v) p.kind = v.section;
    if (p.items.includes(videoId)) {
      p.items = p.items.filter((x) => x !== videoId);
      toast("Removed from " + p.name);
    } else {
      p.items.push(videoId);
      toast("Added to " + p.name);
    }
    save();
    renderPlaylists();
    renderQueue();
    renderNow();
  }

  function newPlaylist(name, firstItem, kind) {
    const clean = (name || "").trim().slice(0, 40);
    if (!clean) return null;
    let id = clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "list";
    while (state.playlists.some((p) => p.id === id)) id += "-2";
    const fv = firstItem ? videoById(firstItem) : null;
    const p = { id, kind: fv ? fv.section : (kind || null), name: clean, items: firstItem ? [firstItem] : [] };
    state.playlists.push(p);
    save();
    renderPlaylists();
    return p;
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                             */
  /* ------------------------------------------------------------------ */

  function toggleKeep(id) {
    if (isKept(id)) state.kept = state.kept.filter((x) => x !== id);
    else state.kept.push(id);
    save();
    renderNow();
    renderAllGrids();
    renderNav();
  }

  function removeVideo(id) {
    const v = videoById(id);
    if (!v) return;
    closePop();
    const before = JSON.stringify(state);
    if (isCustom(id)) state.custom = state.custom.filter((x) => x.id !== id);
    else state.hidden = (state.hidden || []).concat(id);
    state.kept = state.kept.filter((x) => x !== id);
    state.playlists.forEach((p) => { p.items = p.items.filter((x) => x !== id); });
    if (state.sound === id) stopSound();
    if (state.current === id) {
      const p = currentPlaylist();
      state.current = (p && p.items.find((x) => videoById(x))) || null;
      if (mainPlayer && typeof mainPlayer.stopVideo === "function") mainPlayer.stopVideo();
    }
    save();
    renderAll();
    toast("Removed “" + v.title + "”", "Undo", function () {
      state = JSON.parse(before);
      save();
      renderAll();
      toast("Back in your library");
    });
  }

  function restoreAll() {
    const n = (state.hidden || []).length;
    if (!n) return;
    state.hidden = [];
    save();
    renderAll();
    toast(n === 1 ? "1 video restored" : n + " videos restored");
  }

  document.addEventListener("click", function (e) {
    const t = e.target.closest("button, a");
    // Close popover on outside click.
    const pop = $("#playlistPop");
    if (!pop.hidden && !e.target.closest("#playlistPop") && t !== popAnchor) closePop();
    if (!t) return;
    const d = t.dataset;

    if (d.play) { select(d.play, { play: true, scroll: true }); return; }
    if (d.playMain) { select(d.playMain, { play: true, scroll: true, asMain: true }); return; }
    if (d.keep) { toggleKeep(d.keep); return; }
    if (d.addto) { openPop(t, d.addto); return; }
    if (d.remove) { removeVideo(d.remove); return; }
    if (d.popPl !== undefined) { const vid = popFor; closePop(); addToPlaylist(d.popPl, vid); return; }
    if (d.popNew !== undefined) {
      const vid = popFor;
      closePop();
      const name = prompt("Name for the new playlist");
      const p = newPlaylist(name, vid);
      if (p) { toast("Added to " + p.name); renderQueue(); }
      return;
    }
    if (d.sound) { startSound(d.sound); return; }
    if (d.soundOff !== undefined) { stopSound(); return; }
    if (d.soundChip !== undefined) {
      if (!d.soundChip) stopSound();
      else if (d.soundChip.startsWith("list:")) startBgList(false);
      else if (d.soundChip.startsWith("local:")) playLocal(d.soundChip.slice(6));
      else startSound(d.soundChip);
      return;
    }
    if (d.localPlay) { playLocal(d.localPlay); return; }
    if (d.localRemove) { removeLocal(d.localRemove); return; }
    if (d.bgPlay) { startSound(d.bgPlay); toast("Playing in the background"); return; }
    if (d.bgGroup !== undefined) { state.bgGroup = d.bgGroup; save(); renderBgGrid(); return; }
    if (d.filter) {
      state.filters[d.filter] = state.filters[d.filter] === d.value ? null : d.value;
      save();
      renderAllGrids();
      return;
    }
    if (d.status) { state.pathTab = d.status; save(); renderTeachers(); return; }
    if (d.teacher && d.s) {
      state.teacherStatus[d.teacher] = d.s;
      save();
      renderTeachers();
      renderNow();
      return;
    }
    if (d.rate) {
      const v = videoById(state.current);
      if (v && v.teacher) {
        state.teacherStatus[v.teacher] = d.rate;
        save();
        renderTeachers();
        renderNow();
        const tn = teacherById(v.teacher).name;
        toast(d.rate === "kept" ? tn + " is a keeper" : d.rate === "trying" ? "Still trying " + tn : "Noted — " + tn + " isn't for you");
      }
      return;
    }
    if (d.ladderStep) {
      const card = t.closest("[data-ladder]");
      const l = state.ladders.find((x) => x.id === card.dataset.ladder);
      l.step = Math.max(0, Math.min(l.steps.length - 1, l.step + Number(d.ladderStep)));
      save();
      renderLadders();
      if (Number(d.ladderStep) > 0) toast("Up to " + l.steps[l.step] + ". Well done.");
      return;
    }
    if (d.move) {
      const p = state.playlists.find((x) => x.id === d.move);
      const items = p.items.filter((id) => videoById(id));
      const i = Number(d.i), j = i + Number(d.dir);
      if (j < 0 || j >= items.length) return;
      [items[i], items[j]] = [items[j], items[i]];
      p.items = items;
      save();
      renderPlaylists();
      renderQueue();
      return;
    }
    if (d.unlist) {
      const p = state.playlists.find((x) => x.id === d.unlist);
      p.items = p.items.filter((x) => x !== d.id);
      save();
      renderPlaylists();
      renderQueue();
      return;
    }
    if (d.playList) {
      state.currentPlaylist = d.playList;
      const p = currentPlaylist();
      const first = p.items.find((id) => videoById(id));
      if (!first) return;
      playlistMode = true;
      renderPlaylistSelect();
      select(first, { play: true, scroll: true, keepPlaylistMode: true });
      return;
    }
    if (d.delList) {
      const p = state.playlists.find((x) => x.id === d.delList);
      if (!confirm("Delete the playlist “" + p.name + "”? The videos stay in your library.")) return;
      state.playlists = state.playlists.filter((x) => x.id !== d.delList);
      save();
      renderPlaylists();
      renderQueue();
      return;
    }
  });

  $("#bigPlay").addEventListener("click", function () {
    if (state.current) playMain(state.current);
  });
  $("#removeNowBtn").addEventListener("click", function () { if (state.current) removeVideo(state.current); });
  $("#restoreBtn").addEventListener("click", restoreAll);
  $("#keepBtn").addEventListener("click", function () { if (state.current) toggleKeep(state.current); });
  $("#toPlaylistBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    if (state.current) openPop(this, state.current);
  });
  $("#soundUnderBtn").addEventListener("click", function () {
    const panel = $("#soundPanel");
    panel.hidden = !panel.hidden;
    this.setAttribute("aria-expanded", String(!panel.hidden));
  });
  $("#soundVol").addEventListener("input", function () {
    state.soundVol = Number(this.value);
    $("#bgVol").value = state.soundVol;
    if (soundPlayer && typeof soundPlayer.setVolume === "function") soundPlayer.setVolume(state.soundVol);
    localAudio.volume = state.soundVol / 100;
    save();
  });
  $("#bgVol").addEventListener("input", function () {
    state.soundVol = Number(this.value);
    $("#soundVol").value = state.soundVol;
    if (soundPlayer && typeof soundPlayer.setVolume === "function") soundPlayer.setVolume(state.soundVol);
    localAudio.volume = state.soundVol / 100;
    save();
  });
  $("#bgStop").addEventListener("click", stopSound);
  $("#addFiles").addEventListener("change", function () { addLocalFiles(this.files); this.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => $("#shelf").addEventListener(ev, () => $("#shelf").classList.add("drag")));
  ["dragleave", "drop"].forEach((ev) => $("#shelf").addEventListener(ev, () => $("#shelf").classList.remove("drag")));
  const shelfEl = $("#shelf");
  ["dragover", "drop"].forEach((ev) => shelfEl.addEventListener(ev, (e) => {
    e.preventDefault();
    if (ev === "drop") addLocalFiles(e.dataTransfer.files);
  }));
  $("#bgNext").addEventListener("click", () => { if (soundPlayer && soundPlayer.nextVideo) soundPlayer.nextVideo(); });
  $("#bgPrev").addEventListener("click", () => { if (soundPlayer && soundPlayer.previousVideo) soundPlayer.previousVideo(); });
  $("#bgPlayAll").addEventListener("click", () => startBgList(false));
  $("#bgShuffle").addEventListener("click", () => startBgList(true));
  $("#clearFilters").addEventListener("click", function () {
    state.filters = { feel: null, len: null, level: null, popular: null };
    save();
    renderAllGrids();
  });
  $("#playlistSelect").addEventListener("change", function () {
    state.currentPlaylist = this.value;
    playlistMode = false;
    save();
    renderQueue();
    renderNow();
  });
  $("#queue").addEventListener("click", function (e) {
    const b = e.target.closest("[data-play]");
    if (b) { e.stopPropagation(); select(b.dataset.play, { play: true, keepPlaylistMode: true }); }
  }, true);
  $("#prevBtn").addEventListener("click", () => step(-1));
  $("#nextBtn").addEventListener("click", () => step(1));
  $("#playAllBtn").addEventListener("click", function () {
    const p = currentPlaylist();
    const first = p && p.items.find((id) => videoById(id));
    if (!first) { toast("This playlist is empty"); return; }
    playlistMode = true;
    select(first, { play: true, keepPlaylistMode: true });
    toast("Playing all of " + p.name);
  });

  let lovedTimer;
  $("#lovedNote").addEventListener("input", function () {
    clearTimeout(lovedTimer);
    const val = this.value;
    lovedTimer = setTimeout(() => { state.loved = val; save(); }, 300);
  });

  document.addEventListener("submit", function (e) {
    const f = e.target;
    if (f.dataset.chanAdd) {
      e.preventDefault();
      addToChannel(f.dataset.chanAdd, f.querySelector("input"));
      return;
    }
    if (f.dataset.log) {
      e.preventDefault();
      const input = f.querySelector("input");
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      const l = state.ladders.find((x) => x.id === f.dataset.log);
      l.last = text;
      l.history = l.history || [];
      l.history.push({ date: new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" }), step: l.steps[l.step], text });
      save();
      renderLadders();
      toast("Logged " + l.label + ": " + text);
    }
  });

  $("#newPlaylistForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = $("#newPlaylistName");
    const p = newPlaylist(input.value, null, $("#newPlaylistKind").value);
    if (p) { input.value = ""; toast("Created " + p.name); }
  });

  document.addEventListener("change", function (e) {
    const el = e.target;
    if (el.dataset && el.dataset.rename) {
      const p = state.playlists.find((x) => x.id === el.dataset.rename);
      const name = el.value.trim();
      if (!name) { el.value = p.name; return; }
      p.name = name.slice(0, 40);
      save();
      renderPlaylistSelect();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("#playlistPop").hidden) {
      const a = popAnchor;
      closePop();
      if (a) a.focus();
    }
  });

  function addToChannel(key, input) {
    const c = channelLists().find((x) => x.id === key);
    if (!c) return;
    const id = parseYouTubeId(input.value);
    if (!id) { toast("Paste a YouTube video link"); input.focus(); return; }
    if (videoById(id)) { toast("That video is already in your library"); input.value = ""; return; }
    const siblings = c.items.map(videoById).filter(Boolean);
    const btn = input.nextElementSibling;
    btn.disabled = true;
    btn.textContent = "Adding…";
    fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(watchUrl(id)))
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => {
        const v = {
          id, section: c.kind, channel: c.channel, title: j.title || "Video by " + c.channel, min: 0,
          level: mostCommon(siblings.map((x) => x.level)) || "all",
          feel: mostCommon(siblings.map((x) => x.feel)) || "flow",
          style: mostCommon(siblings.map((x) => x.style)),
        };
        const teacher = mostCommon(siblings.map((x) => x.teacher));
        if (teacher) v.teacher = teacher;
        state.custom.push(v);
        save();
        renderAll();
        const other = j.author_name && j.author_name.toLowerCase() !== c.channel.toLowerCase();
        toast("Added to " + c.channel + (other ? " (YouTube lists it under " + j.author_name + ")" : ""));
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = "Add";
        toast("Couldn't find that video — it may be private or removed.");
      });
  }

  /* Export / import */
  $("#exportBtn").addEventListener("click", function () {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "calm-player-library.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });
  $("#importFile").addEventListener("change", function () {
    const file = this.files && this.files[0];
    if (!file) return;
    file.text().then((txt) => {
      const data = JSON.parse(txt);
      if (!data || typeof data !== "object" || !Array.isArray(data.playlists)) throw new Error("bad file");
      state = { ...defaultState(), ...data };
      save();
      renderAll();
      toast("Library imported");
    }).catch(() => toast("That file isn't a Calm Player export."));
    this.value = "";
  });

  /* ------------------------------------------------------------------ */
  /* Add dialog                                                         */
  /* ------------------------------------------------------------------ */

  const dlg = $("#addDialog");
  const add = { kind: "video", section: "yoga", feel: "flow", level: "all", autoTitle: "", autoChannel: "" };

  function chipGroup(el, items, current, key) {
    el.innerHTML = items.map((it) =>
      '<button type="button" class="chip" data-add-' + key + '="' + it.id + '" aria-pressed="' + (it.id === current) + '">' + esc(it.label) + "</button>"
    ).join("");
  }

  function renderAddForm() {
    $$(".seg-btn").forEach((b) => {
      const on = b.dataset.kind === add.kind;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $("#addVideoFields").hidden = add.kind !== "video";
    $("#addTeacherFields").hidden = add.kind !== "teacher";
    chipGroup($("#addSection"), DATA.sections, add.section, "section");
    chipGroup($("#addFeel"), FEELS, add.feel, "feel");
    chipGroup($("#addLevel"), LEVELS, add.level, "level");
    $("#addTeacherWrap").hidden = add.section !== "yoga";
    const sel = $("#addTeacher");
    const prev = sel.value;
    sel.innerHTML = '<option value="">— none —</option>' + allTeachers().map((t) => '<option value="' + esc(t.id) + '">' + esc(t.name) + "</option>").join("");
    sel.value = prev;
    $("#saveAdd").textContent = add.kind === "video" ? "Save to library" : "Add to my yoga path";
  }

  function resetAddForm() {
    add.kind = "video"; add.section = "yoga"; add.feel = "flow"; add.level = "all";
    add.autoTitle = ""; add.autoChannel = "";
    ["#addUrl", "#addVidTitle", "#addVidChannel", "#addMin", "#addNote", "#tName", "#tWhere", "#tUrl"].forEach((s) => { $(s).value = ""; });
    $("#addTeacher").value = "";
    $("#addThumb").hidden = true;
    $("#addThumbBlank").hidden = false;
    $("#addUrlErr").hidden = true;
    $("#addErr").hidden = true;
    renderAddForm();
  }

  $("#openAdd").addEventListener("click", function () {
    resetAddForm();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    $("#addUrl").focus();
  });
  $("#closeAdd").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) dlg.close(); // click on backdrop
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.kind) { add.kind = b.dataset.kind; renderAddForm(); }
    if (b.dataset.addSection) {
      add.section = b.dataset.addSection;
      if (add.section === "sound") add.feel = "rest";
      renderAddForm();
    }
    if (b.dataset.addFeel) { add.feel = b.dataset.addFeel; renderAddForm(); }
    if (b.dataset.addLevel) { add.level = b.dataset.addLevel; renderAddForm(); }
  });

  let oembedTimer;
  $("#addUrl").addEventListener("input", function () {
    clearTimeout(oembedTimer);
    const id = parseYouTubeId(this.value);
    $("#addUrlErr").hidden = !this.value.trim() || !!id;
    if (!id) {
      $("#addThumb").hidden = true;
      $("#addThumbBlank").hidden = false;
      return;
    }
    $("#addThumb").src = thumb(id);
    $("#addThumb").hidden = false;
    $("#addThumbBlank").hidden = true;
    oembedTimer = setTimeout(() => fillFromOembed(id), 250);
  });

  function fillFromOembed(id) {
    fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(watchUrl(id)))
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => {
        const tEl = $("#addVidTitle"), cEl = $("#addVidChannel");
        if (!tEl.value || tEl.value === add.autoTitle) { tEl.value = j.title || ""; add.autoTitle = tEl.value; }
        if (!cEl.value || cEl.value === add.autoChannel) { cEl.value = j.author_name || ""; add.autoChannel = cEl.value; }
        // Guess the teacher from the channel name.
        const match = allTeachers().find((t) => (j.author_name || "").toLowerCase().includes(t.name.toLowerCase().split(",")[0]));
        if (match && !$("#addTeacher").value) { $("#addTeacher").value = match.id; }
      })
      .catch(() => {
        $("#addUrlErr").textContent = "Couldn't look this video up — it may be private or unavailable. You can still type a title.";
        $("#addUrlErr").hidden = false;
      });
  }

  function showAddErr(msg) { const el = $("#addErr"); el.textContent = msg; el.hidden = false; }

  $("#addForm").addEventListener("submit", function (e) {
    e.preventDefault();
    $("#addErr").hidden = true;
    if (add.kind === "video") {
      const id = parseYouTubeId($("#addUrl").value);
      if (!id) { showAddErr("Paste a YouTube video link first."); $("#addUrl").focus(); return; }
      const existing = videoById(id);
      const note = $("#addNote").value.trim();
      if (existing) {
        if (note) { state.notes[id] = note; save(); }
        dlg.close();
        select(id, { scroll: true });
        toast("Already in your library" + (note ? " — note saved" : ""));
        return;
      }
      const title = $("#addVidTitle").value.trim() || "Untitled video";
      const min = parseInt($("#addMin").value, 10);
      const v = {
        id, section: add.section, title,
        channel: $("#addVidChannel").value.trim(),
        min: Number.isFinite(min) && min > 0 ? min : 0,
        level: add.level, feel: add.feel, style: "",
      };
      if (add.section === "yoga" && $("#addTeacher").value) v.teacher = $("#addTeacher").value;
      state.custom.push(v);
      if (note) state.notes[id] = note;
      save();
      dlg.close();
      renderAll();
      const card = $('[data-card="' + id + '"]');
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Saved to " + sectionLabel(add.section));
    } else {
      const name = $("#tName").value.trim();
      if (!name) { showAddErr("Give the teacher a name."); $("#tName").focus(); return; }
      let tid = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "teacher";
      while (teacherById(tid)) tid += "-2";
      const urlVal = $("#tUrl").value.trim();
      const vid = parseYouTubeId(urlVal);
      if (urlVal && !vid) { showAddErr("That class link doesn't look like a YouTube video."); $("#tUrl").focus(); return; }
      state.customTeachers.push({ id: tid, name, where: $("#tWhere").value.trim(), status: "totry" });
      if (vid && !videoById(vid)) {
        state.custom.push({ id: vid, section: "yoga", teacher: tid, title: "First class with " + name, channel: name, min: 0, level: "all", feel: "flow", style: "" });
        // Fill in the real title in the background.
        fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(watchUrl(vid)))
          .then((r) => r.ok ? r.json() : null)
          .then((j) => {
            if (!j) return;
            const v = state.custom.find((x) => x.id === vid);
            if (v) { v.title = j.title || v.title; v.channel = j.author_name || v.channel; save(); renderAll(); }
          }).catch(() => {});
      }
      save();
      dlg.close();
      state.pathTab = "totry";
      renderAll();
      $("#yoga").scrollIntoView({ behavior: "smooth" });
      toast(name + " added to To try");
    }
  });

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */

  if (state.current && !videoById(state.current)) state.current = null;
  if (state.current && videoById(state.current).section === "sound") state.current = null;
  if (!state.current) {
    const p = currentPlaylist();
    state.current = (p && p.items.find((id) => videoById(id))) || null;
  }
  renderAll();
  // Don't auto-resume a soundscape on load (browsers block it); show it as off.
  if (state.sound) { state.sound = null; save(); renderSoundChips(); renderSoundGrid(); }
  setInterval(renderGreeting, 10 * 60 * 1000);

  // Small bridge so My Hangout (hangout.js) can offer sounds during a session.
  window.CalmPlayer = {
    soundOptions: function () {
      return [{ id: "", title: "Off" }].concat(
        BG.playlistId ? [{ id: "list:" + BG.playlistId, title: "My background playlist" }] : [],
        localFiles.map((f) => ({ id: "local:" + f.id, title: f.name + " (offline)" })),
        soundList().map((v) => ({ id: v.id, title: v.title })));
    },
    playSound: function (id) {
      if (!id) stopSound();
      else if (id.startsWith("list:")) startBgList(false);
      else if (id.startsWith("local:")) playLocal(id.slice(6));
      else startSound(id);
    },
    currentSound: function () { return state.sound || ""; },
    stopSound: stopSound,
  };
  loadLocalFiles().then(() => { renderShelf(); renderSoundChips(); });

  // Offline: cache the app so it opens with no internet (needs https or localhost).
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").then(() => navigator.serviceWorker.ready).then((reg) => {
      const urls = [location.pathname, "manifest.webmanifest", "icon-192.png", "icon-512.png"]
        .concat($$('link[rel="stylesheet"], script[src]').map((el) => el.href || el.src));
      if (reg.active) reg.active.postMessage({ type: "cache", urls });
    }).catch(() => {});
  }
})();
