/* My Hangout — passions, before/after sessions, journal, my people and spell book.
 * Plain JavaScript, no build step. Everything is saved in this browser (localStorage).
 * The Move tab and Sounds & files tab are the Calm Player (app.js). */
(function () {
  "use strict";

  const KEY = "my-hangout-v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ------------------------------------------------------------------ */
  /* Starter content                                                     */
  /* ------------------------------------------------------------------ */

  // energy: which moods each passion suits — low, restless, curious, make
  const PASSIONS = [
    { id: "drawing", name: "Drawing", color: "#E9B8A0", energy: ["restless", "make"], prompts: [
      "Draw the cup or plant closest to you. 10 minutes, pencil only.",
      "Draw your own hand, three times, each faster than the last.",
      "Fill a page with tiny drawings of things in this room.",
      "Draw a fairytale door and what might be behind it.",
      "Draw with your other hand. Let it be wobbly.",
    ] },
    { id: "music", name: "Listening to music", color: "#B9C7E8", energy: ["low", "restless"], prompts: [
      "One full album, start to finish, lying down.",
      "Listen to a song you loved at 15 and notice what comes back.",
      "Find one piece of music from a country you've never been to.",
      "Close your eyes and follow only the bass line of a song.",
    ] },
    { id: "playlists", name: "Making playlists", color: "#DCD3E6", energy: ["curious", "make"], prompts: [
      "A 5-song playlist for exactly how you feel right now.",
      "A playlist for a character from a fairytale.",
      "A playlist for your next walk in nature.",
      "Songs that feel like a colour — pick one colour.",
    ] },
    { id: "dancing", name: "Dancing", color: "#EBCFD3", energy: ["restless", "low"], prompts: [
      "Three songs, lights low, move however you like.",
      "Dance only with your arms for one song, then everything.",
      "Put on a song from your childhood and dance like you did then.",
      "Follow one dance class from the Move tab.",
    ] },
    { id: "fairytales", name: "Fairytales", color: "#C9D9C0", energy: ["low", "curious"], prompts: [
      "Read one tale and note one symbol that stayed with you.",
      "Compare two versions of the same tale from different countries.",
      "Rewrite the ending of a tale you know.",
      "Pick a tale and ask: who in it am I today?",
    ] },
    { id: "yoga-learning", name: "Learning about yoga", color: "#D5DDCF", energy: ["curious", "low"], prompts: [
      "Read about one pose, then try it for 5 breaths.",
      "Learn one Sanskrit word and what it really means.",
      "Read about one breathing practice and try it for 3 minutes.",
      "Write down what you loved about yoga in India.",
    ] },
    { id: "dolls", name: "Playing with dolls", color: "#EBCFD3", energy: ["low", "make"], prompts: [
      "Pick one doll, give her a little scene, and play it out for 15 minutes.",
      "She's moving into a new house — set up her room.",
      "A fairy visits her at night. What does the fairy bring?",
      "Make her an outfit from things you already have.",
      "She has a big day tomorrow. Play the evening before.",
    ] },
    { id: "morning-pages", name: "Morning pages", color: "#F3DCC8", energy: ["low", "restless"], prompts: [
      "Three pages by hand, first thing. Don't reread.",
      "Write without stopping until the pages are full.",
    ] },
    { id: "journaling", name: "Journaling", color: "#E9B8A0", energy: ["low", "restless", "curious"], prompts: [
      "What do I need tonight that I haven't asked for?",
      "What did I enjoy today, even a little?",
      "What am I avoiding, and what is the smallest step toward it?",
      "If I were my own best friend, what would I tell me?",
      "Write about one moment today in full detail.",
    ] },
    { id: "singing", name: "Singing, humming & chanting", color: "#B9C7E8", energy: ["low", "restless"], prompts: [
      "Hum one long note on each out-breath for 3 minutes.",
      "Chant Om 11 times and feel where it buzzes.",
      "Sing one song all the way through, out loud.",
      "Chant along with Om Namo Bhagavate Vasudevaya from My files.",
    ] },
    { id: "meditation", name: "Meditation", color: "#D5DDCF", meditation: true, energy: ["low", "restless", "curious"], prompts: [
      "Sit comfortably. Follow the breath at the tip of your nose, in and out.",
      "Count breaths from one to ten, then begin again. Lost count? Start at one, kindly.",
      "Listen to the sounds around you without naming them.",
      "Body scan: move your attention slowly from the crown of your head down to your toes.",
      "With each out-breath, silently say: let go.",
      "Rest your attention on the space between two bells.",
    ] },
    { id: "song", name: "Making a song", color: "#B9C7E8", energy: ["make", "restless", "curious"], prompts: [
      "Hum a melody into a voice memo. Don't judge it — just keep the one you like.",
      "Write four lines about how today felt. Then sing them to any tune.",
      "Pick one feeling and make a chorus from a single line that says it.",
      "Tap a rhythm on the table, then hum something over it.",
      "Take a line from your morning pages and turn it into a lyric.",
      "Record a verse, a chorus, and the verse again. That's a song.",
    ] },
    { id: "talking", name: "Talking to myself out loud", color: "#DCD3E6", energy: ["restless", "low"], prompts: [
      "Tell yourself how today really went, like to a friend.",
      "Talk through a decision you're stuck on, out loud, for 5 minutes.",
      "Describe what you see around you as if narrating a film.",
      "Say three things you're proud of this week.",
    ] },
    { id: "nature", name: "Nature, no phone", color: "#C9D9C0", energy: ["restless", "low", "curious"], prompts: [
      "Leave the phone at home. Come back with three things you noticed.",
      "Find the oldest tree you can and sit with it.",
      "Walk slowly and count the different birds you hear.",
      "Bring back one leaf, stone or flower.",
    ] },
    { id: "spell", name: "Creating a magic spell", color: "#3A2232", dark: true, energy: ["make", "curious"], prompts: [
      "Write a three-line spell for what you want to call in, light a candle, say it out loud.",
      "Pick a spell from your spell book and make it your own.",
      "Write a spell for someone you love.",
    ] },
    { id: "curiosity", name: "Curiosity of the week", color: "#F3DCC8", curiosity: true, energy: ["curious"], prompts: [
      "Follow your topic for 20 minutes, on purpose, and write one thing you learned.",
      "Write three questions you have about your topic.",
      "Explain your topic out loud as if teaching a friend.",
    ] },
  ];

  const REASONS = ["Bored", "Avoiding something", "Lonely", "Tired", "Autopilot", "Comparing", "Want inspiration", "Anxious"];
  const FEEL_BEFORE = ["Restless", "Anxious", "Flat", "Tired", "Low", "Okay", "Scattered"];
  const FEEL_AFTER = ["Calm", "Proud", "Lighter", "Inspired", "Joyful", "Grounded", "Still restless", "Tired"];
  const ENERGY = [
    { id: "low", label: "Low energy" },
    { id: "restless", label: "Restless" },
    { id: "curious", label: "Curious" },
    { id: "make", label: "Want to make something" },
  ];
  const TIMES = [{ m: 5, label: "5 min" }, { m: 20, label: "20 min" }, { m: 45, label: "45 min" }, { m: 0, label: "Open-ended" }];

  const PEOPLE = [
    { id: "xenia", name: "Xenia Adonts", line: "Hard work and curiosity.", sub: "Show up, put in the hours, and stay curious about everything along the way." },
    { id: "kitty", name: "Kitty Lever", line: "Child spirit. Doing me, with joy.", sub: "Play like a kid. Do it my own way, and let it be fun." },
    { id: "honey", name: "Heaven Sent Honey", line: "Art comes out of loneliness. It is good.", sub: "Feeling alone isn't a problem to scroll away. It's where my art comes from." },
  ];

  const SPELL_TAGS = [
    { id: "scroll", label: "Instead of scrolling" },
    { id: "call", label: "Calling in" },
    { id: "release", label: "Letting go" },
    { id: "protect", label: "Protection" },
    { id: "rest", label: "Rest" },
    { id: "create", label: "Creativity" },
    { id: "love", label: "Self-love" },
  ];

  const SPELLS = [
    { id: "glass-door", tag: "scroll", when: "Instead of scrolling · 1 min", title: "Closing the Glass Door",
      steps: "When your thumb reaches for the feed. Turn the phone face down, rest your palm on it, breathe out slowly three times. Then open one passion and begin.",
      words: "Little window, close your light,\nmy hours come home to me tonight.\nWhat I love is waiting near —\nI choose the thing that brought me here." },
    { id: "ink", tag: "create", when: "Morning · before morning pages", title: "Opening the Ink",
      steps: "Hold your pen to your heart, then touch it to the first page.",
      words: "Whatever is tangled, let it spill,\nno one is reading, the page is still.\nThree pages to empty, one day to fill." },
    { id: "candle-wish", tag: "call", when: "Calling in · new moon", title: "The Candle and the Wish",
      steps: "You need a candle and a slip of paper. Write one wish in the present tense, as if it already lives with you. Fold it toward you three times and set it under the candle holder. Afterwards, write one small action toward the wish in your journal. Never leave a flame alone.",
      words: "Small flame, carry what I name,\ngrow it slow and grow it true.\nI make room, I make the way —\nI meet it halfway, every day." },
    { id: "old-story", tag: "release", when: "Letting go · full moon", title: "Tearing the Old Story",
      steps: "Write a thought that keeps pulling you down — your Journal shows the ones that come back most often. Read it once out loud, then tear it into small pieces and put them in the bin.",
      words: "You were a story, not a law.\nI thank you for the thing you saw,\nand now I tear you, piece by piece —\nthe moon is full, and I am free." },
    { id: "humming-shield", tag: "protect", when: "Protection · voice", title: "The Humming Shield",
      steps: "Before a hard conversation or a crowded place. Hum one low note until your chest buzzes. Imagine the sound making a soft bubble around you.",
      words: "My voice is a wall that is also a song,\nwhat's mine stays in, what's not moves along." },
    { id: "pocket-stone", tag: "protect", when: "Courage · nature walk", title: "The Pocket Stone",
      steps: "On a phone-free walk, let a stone choose you. Warm it in your hand and whisper what you need courage for. Keep it in your pocket and hold it when you wobble.",
      words: "Old stone, you waited a thousand years,\nlend me your patience, take my fears." },
    { id: "three-knots", tag: "call", when: "A promise to myself", title: "Three Knots of Keeping",
      steps: "You need a piece of red or gold thread. Tie three knots while you speak, one per line. Wear it on your wrist until the promise has become a habit.",
      words: "One knot: I said it.\nTwo knots: I meant it.\nThree knots: I keep it." },
    { id: "hidden-door", tag: "create", when: "Creativity · fairytale", title: "Drawing the Hidden Door",
      steps: "Draw a small door anywhere in your sketchbook. Knock on the page three times, then draw or write whatever you imagine is behind it.",
      words: "Door in the paper, door in the tree,\nopen a little and show it to me." },
    { id: "mirror", tag: "love", when: "Self-love · out loud", title: "The Mirror Greeting",
      steps: "Meet your own eyes in a mirror and say your full name, slowly, like greeting someone you have missed. Record it as a voice note if you like.",
      words: "There you are. I see you.\nYou don't have to earn today.\nYou're already invited." },
    { id: "tea", tag: "rest", when: "Rest · evening", title: "Tea of Putting Down",
      steps: "Make a herbal tea. Stir clockwise and, with each turn, name one thing from today you are putting down for the night. Leave the phone in another room.",
      words: "Steam rise, day close,\nwhat I carried, now I compose\ninto sleep, into dark, into rose." },
    { id: "salt-hands", tag: "release", when: "Cleansing · after a heavy day", title: "Salt on the Hands",
      steps: "Rub a pinch of salt between wet palms over the sink, then rinse with cool water while you speak.",
      words: "Salt of the sea, water of the rain,\ntake what isn't mine back down the drain." },
    { id: "wake-mat", tag: "love", when: "Body · before yoga", title: "Waking the Mat",
      steps: "Kneel, place both palms flat on the mat, chant one Om, and choose one word for the practice.",
      words: "This square of ground is mine to keep,\nI move to wake, I breathe to deepen." },
  ];

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */

  function defaults() {
    return {
      name: "Julie",
      customPassions: [],
      tasks: [],
      deleted: [],
      hiddenPassions: [],
      promptIndex: {},
      sessions: [],
      people: PEOPLE.map((p) => ({ ...p })),
      spells: [],
      curiosity: { topic: "", notes: [] },
      active: null,
      journalRange: "week",
      spellTag: "",
      energy: "",
      minutes: 20,
      reminderIndex: 0,
    };
  }
  let S = (() => {
    try { const raw = localStorage.getItem(KEY); return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults(); }
    catch (e) { return defaults(); }
  })();
  function forget(id) { S.deleted = (S.deleted || []).concat(id).slice(-2000); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* keep working in memory */ } }

  function passions() {
    return PASSIONS.concat(S.customPassions).filter((p) => !S.hiddenPassions.includes(p.id));
  }
  const TASK_PROMPTS = [
    "Just 10 minutes. Start with the smallest possible piece.",
    "Write down the very next step, then do only that.",
    "Set the timer and work until it rings — then you're allowed to stop.",
    "Open the thing. That's the whole first step.",
    "Do the worst five minutes first, then reward yourself with a passion.",
  ];
  function taskAsPassion(t) { return { id: t.id, name: t.name, color: "#D9BFC5", task: true, energy: [], prompts: TASK_PROMPTS }; }
  function tasks() { return (S.tasks || []).map(taskAsPassion); }
  function passionById(id) { return PASSIONS.concat(S.customPassions, tasks()).find((p) => p.id === id) || null; }
  function addTask(name) {
    const clean = (name || "").trim().slice(0, 50);
    if (!clean) return null;
    const existing = (S.tasks || []).find((t) => t.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing.id;
    const t = { id: "t-" + uid(), name: clean };
    S.tasks = (S.tasks || []).concat(t);
    save();
    return t.id;
  }
  function addPassion(name, step) {
    const clean = (name || "").trim().slice(0, 40);
    if (!clean) return null;
    const p = { id: "c-" + uid(), name: clean, color: "#DCD3E6", custom: true, energy: ["make", "curious", "low", "restless"], prompts: step ? [step] : [] };
    S.customPassions.push(p);
    save();
    return p.id;
  }
  function promptFor(p) {
    const list = p.prompts && p.prompts.length ? p.prompts : ["Do it for 15 minutes, just for the joy of it."];
    const i = (S.promptIndex[p.id] || 0) % list.length;
    return list[i];
  }
  function nextPrompt(id) { S.promptIndex[id] = (S.promptIndex[id] || 0) + 1; save(); }

  /* ------------------------------------------------------------------ */
  /* Helpers & stats                                                     */
  /* ------------------------------------------------------------------ */

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function fmtMin(m) {
    m = Math.round(m);
    if (m < 60) return m + " min";
    const h = Math.floor(m / 60), r = m % 60;
    return h + " h" + (r ? " " + String(r).padStart(2, "0") : "");
  }
  function dayKey(t) { const d = new Date(t); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function startOfDay(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function rangeStart(range) {
    const now = Date.now();
    if (range === "week") return startOfDay(now) - 6 * 864e5;
    if (range === "month") return startOfDay(now) - 29 * 864e5;
    return 0;
  }
  function sessionsIn(range) { const from = rangeStart(range); return S.sessions.filter((s) => s.start >= from); }
  function lift(s) { return (s.after && s.before && s.after.mood != null && s.before.mood != null) ? s.after.mood - s.before.mood : null; }
  function avg(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null; }
  function signed(n) { return n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1); }
  function streak() {
    const days = new Set(S.sessions.map((s) => dayKey(s.start)));
    let n = 0, t = Date.now();
    if (!days.has(dayKey(t))) t -= 864e5; // today not done yet still counts yesterday's streak
    while (days.has(dayKey(t))) { n++; t -= 864e5; }
    return n;
  }
  function liftByPassion(list) {
    const m = {};
    list.forEach((s) => { const l = lift(s); if (l == null) return; (m[s.passion] = m[s.passion] || []).push(l); });
    return Object.keys(m).map((id) => ({ id, lift: avg(m[id]), n: m[id].length })).sort((a, b) => b.lift - a.lift);
  }
  function suggestFor(reasons, energy) {
    // Passions that lifted me most when I felt like this before; fall back to the energy match.
    const ps = passions();
    const similar = S.sessions.filter((s) => (s.reasons || []).some((r) => (reasons || []).includes(r)));
    const ranked = liftByPassion(similar.length ? similar : S.sessions).filter((x) => x.lift > 0 && passionById(x.id));
    const out = ranked.map((x) => ({ p: passionById(x.id), why: signed(x.lift) + " mood, " + x.n + (x.n === 1 ? " time" : " times") }));
    ps.filter((p) => !energy || (p.energy || []).includes(energy)).forEach((p) => {
      if (!out.some((o) => o.p.id === p.id)) out.push({ p, why: "" });
    });
    return out.slice(0, 3);
  }

  /* ------------------------------------------------------------------ */
  /* Tabs & routing                                                      */
  /* ------------------------------------------------------------------ */

  const TABS = ["today", "passions", "move", "sounds", "journal", "spells"];
  function showTab(id, scrollTarget) {
    if (!TABS.includes(id)) id = "today";
    TABS.forEach((t) => { const el = $("#tab-" + t); if (el) el.hidden = t !== id; });
    $$("#tabs a").forEach((a) => {
      const on = a.dataset.tab === id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    renderTab(id);
    if (scrollTarget) scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0 });
  }
  function route() {
    const h = decodeURIComponent(location.hash || "");
    if (h.startsWith("#/")) { showTab(h.slice(2)); return; }
    if (h.length > 1) {
      const el = document.getElementById(h.slice(1));
      const tab = el && el.closest(".tab");
      if (tab) { showTab(tab.id.replace("tab-", ""), el); return; }
    }
    showTab("today");
  }
  function renderTab(id) {
    if (id === "today") renderToday();
    if (id === "passions") renderPassions();
    if (id === "journal") renderJournal();
    if (id === "spells") renderSpells();
  }

  /* ------------------------------------------------------------------ */
  /* Today                                                               */
  /* ------------------------------------------------------------------ */

  function greeting() {
    const h = new Date().getHours();
    const part = h < 5 ? "Late night" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
    const day = new Date().toLocaleDateString(undefined, { weekday: "long" });
    return day + " · " + part.toLowerCase();
  }

  function peopleHtml() {
    return '<div class="people-grid">' + S.people.map((p, i) =>
      '<article class="person p' + (i % 3) + '">' +
      '<span class="person-name">' + esc(p.name) + "</span>" +
      '<span class="person-line">' + esc(p.line) + "</span>" +
      (p.sub ? '<span class="person-sub">' + esc(p.sub) + "</span>" : "") +
      '<div class="person-actions"><button type="button" class="link-btn" data-h-edit-person="' + esc(p.id) + '">Edit</button>' +
      '<button type="button" class="link-btn" data-h-del-person="' + esc(p.id) + '">Remove</button></div>' +
      "</article>").join("") +
      '<button type="button" class="person add" data-h-add-person>+ Add someone who inspires me</button></div>';
  }

  function sessionRow(s, withDelete) {
    const p = passionById(s.passion) || { name: s.passionName || "Session" };
    const l = lift(s);
    return '<article class="sess">' +
      '<div class="sess-main"><b>' + esc(p.name) + " · " + fmtMin(s.minutes || 0) + "</b>" +
      '<span class="muted small">' + new Date(s.start).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "</span></div>" +
      (s.thought ? '<span class="sess-thought">Thought before: “' + esc(s.thought) + "”</span>" : '<span class="sess-thought muted">' + esc((s.reasons || []).join(", ")) + "</span>") +
      '<div class="sess-mood"><span class="tag pink">' + esc(((s.before && s.before.feelings) || []).join(", ") || "before " + ((s.before && s.before.mood) || "?")) + "</span>" +
      '<span aria-hidden="true">→</span><span class="tag sage">' + esc(((s.after && s.after.feelings) || []).join(", ") || "after " + ((s.after && s.after.mood) || "?")) + "</span>" +
      (l != null ? '<span class="lift ' + (l >= 0 ? "up" : "down") + '">' + signed(l) + "</span>" : "") + "</div>" +
      (s.note ? '<p class="sess-note">' + esc(s.note) + "</p>" : "") +
      (withDelete ? '<button type="button" class="link-btn sess-del" data-h-del-session="' + esc(s.id) + '">Delete</button>' : "") +
      "</article>";
  }

  function renderToday() {
    const el = $("#tab-today");
    const week = sessionsIn("week");
    const mins = week.reduce((n, s) => n + (s.minutes || 0), 0);
    const urges = week.filter((s) => (s.reasons || []).length).length;
    const lifts = week.map(lift).filter((x) => x != null);
    const st = streak();
    const sug = suggestFor([], S.energy);
    el.innerHTML =
      '<section class="hero">' +
      '<div class="hero-text"><span class="eyebrow light">' + esc(greeting()) + "</span>" +
      "<h1>Reaching for your phone, " + esc(S.name) + "? Let's do something you love.</h1>" +
      "<p>Take 20 seconds to notice what pulled you here, then pick a passion. I'll time it and ask how you feel after.</p>" +
      '<div class="hero-btns"><button type="button" class="btn-light" data-h-urge>I feel the urge to scroll</button>' +
      '<button type="button" class="btn-ghost" data-h-pick>Pick something for me</button></div>' +
      (S.active ? '<button type="button" class="btn-light resume" data-h-resume>Back to my ' + esc((passionById(S.active.passion) || {}).name || "session") + "</button>" : "") +
      "</div>" +
      '<div class="hero-stats">' +
      '<div><b>' + fmtMin(mins) + "</b><span>on my passions this week</span></div>" +
      "<div><b>" + urges + "</b><span>scroll urges turned into something else</span></div>" +
      "<div><b>" + (lifts.length ? signed(avg(lifts)) : "—") + "</b><span>average mood lift, before → after</span></div>" +
      "<div><b>" + st + (st === 1 ? " day" : " days") + "</b><span>in a row with a passion session</span></div>" +
      "</div></section>" +

      '<section class="block"><div class="block-head"><h2>My people · what I remember from them</h2>' +
      '<span class="muted small">Shown during every session, one at a time</span></div>' + peopleHtml() + "</section>" +

      '<section class="block"><div class="block-head"><h2>How do I feel right now?</h2></div>' +
      '<div class="chip-row">' + ENERGY.map((e) => '<button type="button" class="chip pink" data-h-energy="' + e.id + '" aria-pressed="' + (S.energy === e.id) + '">' + esc(e.label) + "</button>").join("") + "</div>" +
      '<div class="grid sugg">' + sug.map((x) => suggestCard(x.p, x.why)).join("") + "</div></section>" +

      '<section class="block"><div class="block-head"><h2>Lately, instead of scrolling</h2><a href="#/journal">See my journal</a></div>' +
      (S.sessions.length
        ? '<div class="sess-list">' + S.sessions.slice(-3).reverse().map((s) => sessionRow(s, false)).join("") + "</div>"
        : '<p class="empty">Your first session will show up here. Tap “I feel the urge to scroll” or start any passion.</p>') +
      "</section>";
  }

  function suggestCard(p, why) {
    return '<article class="sugg-card"><span class="bar" style="background:' + p.color + '"></span>' +
      "<b>" + esc(p.name) + "</b><span class=\"muted small\">" + esc(promptFor(p)) + "</span>" +
      (why ? '<span class="tag sage">' + esc(why) + "</span>" : "") +
      '<button type="button" class="btn-dark" data-h-start="' + esc(p.id) + '">Start</button></article>';
  }

  /* ------------------------------------------------------------------ */
  /* Passions                                                            */
  /* ------------------------------------------------------------------ */

  function passionStats(id) {
    const w = sessionsIn("week").filter((s) => s.passion === id);
    return { mins: w.reduce((n, s) => n + (s.minutes || 0), 0), n: w.length };
  }

  function renderPassions() {
    const el = $("#tab-passions");
    el.innerHTML =
      '<section class="block"><div class="block-head"><h1 class="page-title">My passions</h1>' +
      '<span class="muted small">Each one has a tiny first step, so starting is easy</span></div>' +
      '<div class="chip-row" role="group" aria-label="Session length"><span class="muted small">How long?</span>' +
      TIMES.map((t) => '<button type="button" class="chip" data-h-minutes="' + t.m + '" aria-pressed="' + (S.minutes === t.m) + '">' + t.label + "</button>").join("") + "</div>" +
      '<div class="grid passions">' + passions().map(passionCard).join("") +
      '<button type="button" class="passion add" data-h-add-passion>+ Add a passion</button></div></section>' +
      '<section class="block avoid-block"><div class="block-head"><h2>Things I tend to avoid</h2>' +
      '<span class="muted small">When scrolling is really avoiding, do 10 brave minutes of one of these</span></div>' +
      '<div class="avoid-list">' + tasks().map((t) => {
        const st = passionStats(t.id);
        return '<div class="avoid-row"><div><b>' + esc(t.name) + '</b><span class="muted small">' +
          (st.n ? fmtMin(st.mins) + " this week" : "Not yet this week") + "</span></div>" +
          '<button type="button" class="btn-dark" data-h-start="' + esc(t.id) + '">10 brave minutes</button>' +
          '<button type="button" class="btn-soft" data-h-del-task="' + esc(t.id) + '" aria-label="Remove ' + esc(t.name) + '">Remove</button></div>';
      }).join("") +
      '<button type="button" class="chip dashed" data-h-add-task>+ Add what I\'m avoiding</button></div></section>';
  }

  function passionCard(p) {
    const st = passionStats(p.id);
    if (p.curiosity) {
      const c = S.curiosity;
      return '<article class="passion curiosity"><span class="eyebrow">Curiosity of the week</span>' +
        '<label class="sr-only" for="curTopic">My topic this week</label>' +
        '<input id="curTopic" class="cur-topic" placeholder="[any topic I\'m into]" value="' + esc(c.topic) + '" maxlength="60">' +
        '<span class="muted small">A rabbit hole I choose on purpose: questions and things I learned, all in one place.</span>' +
        (c.notes.length ? '<ul class="cur-notes">' + c.notes.slice(-4).reverse().map((n) => "<li>" + esc(n.text) + "</li>").join("") + "</ul>" : "") +
        '<form class="cur-add" data-h-cur-form><label class="sr-only" for="curNote">Add a question or something I learned</label>' +
        '<input id="curNote" placeholder="A question, or something I learned" maxlength="200"><button type="submit" class="btn-soft">Add</button></form>' +
        '<span class="muted small">' + c.notes.length + " notes · " + fmtMin(st.mins) + " this week</span>" +
        '<div class="passion-btns"><button type="button" class="btn-dark grow" data-h-start="curiosity">Dive in</button></div></article>';
    }
    return '<article class="passion' + (p.dark ? " dark" : "") + '">' +
      '<span class="bar" style="background:' + (p.dark ? "#F3DCC8" : p.color) + '"></span>' +
      '<span class="passion-name">' + esc(p.name) + "</span>" +
      '<span class="passion-step">Tiny step: ' + esc(promptFor(p)) + "</span>" +
      '<span class="passion-stat">' + (st.n ? fmtMin(st.mins) + " this week · " + st.n + (st.n === 1 ? " session" : " sessions") : "Not yet this week") + "</span>" +
      '<div class="passion-btns"><button type="button" class="' + (p.dark ? "btn-light" : "btn-dark") + ' grow" data-h-start="' + esc(p.id) + '">Start</button>' +
      '<button type="button" class="btn-soft" data-h-next-prompt="' + esc(p.id) + '">Another idea</button>' +
      (p.id === "spell" ? '<a class="btn-soft" href="#/spells">Spell book</a>' : "") +
      (p.id === "dancing" ? '<a class="btn-soft" href="#dance">Classes</a>' : "") +
      (p.custom ? '<button type="button" class="btn-soft" data-h-del-passion="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">Remove</button>' : "") +
      "</div></article>";
  }

  /* ------------------------------------------------------------------ */
  /* Meditation bells — synthesised in the browser, so they work offline */
  /* ------------------------------------------------------------------ */

  const MED_TIMES = [5, 10, 15, 20, 30, 45, 60];
  const MED_INTERVALS = [{ m: 0, label: "No interval bells" }, { m: 1, label: "Every 1 min" }, { m: 2, label: "Every 2 min" }, { m: 5, label: "Every 5 min" }, { m: 10, label: "Every 10 min" }];
  const MED_SOUNDS = [{ id: "bowl", label: "Tibetan singing bowl" }, { id: "bell", label: "Small bell" }, { id: "deep", label: "Deep bowl" }];
  let actx = null;
  function audio() {
    if (!actx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; actx = new AC(); }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function strike(kind, when) {
    const ac = audio();
    if (!ac) return;
    const t0 = when || ac.currentTime + 0.05;
    const v = { bowl: { f: 262, parts: [[1, 1, 9], [2.76, 0.45, 6], [5.4, 0.22, 4], [8.9, 0.1, 2.5]] },
                deep: { f: 131, parts: [[1, 1, 12], [2.72, 0.5, 8], [5.2, 0.2, 5], [8.6, 0.08, 3]] },
                bell: { f: 880, parts: [[1, 1, 4], [2.0, 0.5, 2.5], [3.01, 0.35, 1.8], [4.2, 0.2, 1.2], [5.43, 0.12, 0.9]] } }[kind] || null;
    if (!v) return;
    const master = ac.createGain();
    master.gain.value = 0.32;
    master.connect(ac.destination);
    v.parts.forEach(([ratio, amp, decay]) => {
      [0, 1.6].forEach((detune, k) => { // two slightly detuned partials make the bowl's gentle "beating"
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        o.frequency.value = v.f * ratio + (k ? detune : 0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(amp * (k ? 0.5 : 1), t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t0 + decay + 0.1);
      });
    });
  }
  function ringBell(kind, times) {
    const ac = audio();
    if (!ac) return;
    for (let i = 0; i < (times || 1); i++) strike(kind, ac.currentTime + 0.05 + i * 3.2);
  }

  /* ------------------------------------------------------------------ */
  /* Session flow: before → doing → after                                */
  /* ------------------------------------------------------------------ */

  let draft = null;   // check-in being filled
  let tick = null;

  function openFlow() { $("#flow").hidden = false; document.body.classList.add("flow-open"); }
  function closeFlow() {
    $("#flow").hidden = true;
    document.body.classList.remove("flow-open");
    clearInterval(tick);
    tick = null;
    const t = $("#tabs a.active");
    renderTab(t ? t.dataset.tab : "today");
  }

  function chipGroup(name, options, selected, cls) {
    return '<div class="chip-row" role="group" aria-label="' + esc(name) + '">' + options.map((o) =>
      '<button type="button" class="chip ' + (cls || "") + '" data-h-pick-' + name + '="' + esc(o) + '" aria-pressed="' + selected.includes(o) + '">' + esc(o) + "</button>").join("") + "</div>";
  }

  function startCheckIn(passionId) {
    if (S.active) { openFlow(); renderDoing(); return; }
    draft = { passion: passionId || "", reasons: [], thought: "", feelings: [], mood: 5, minutes: S.minutes,
      med: { minutes: S.medMinutes || 10, interval: S.medInterval != null ? S.medInterval : 5, sound: S.medSound || "bowl" } };
    openFlow();
    renderCheckIn();
  }

  function avoidHtml(d) {
    const avoiding = d.reasons.includes("Avoiding something");
    return '<div class="field avoid' + (avoiding ? " on" : "") + '"><span>' +
      (avoiding ? "You said you're avoiding something. What is it? Let's do 10 minutes of it." : "Or face the thing I'm avoiding") + "</span>" +
      '<div class="chip-row">' + tasks().map((t) =>
        '<button type="button" class="chip" data-h-pick-passion="' + esc(t.id) + '" aria-pressed="' + (d.passion === t.id) + '">' + esc(t.name) + "</button>").join("") +
      '<button type="button" class="chip dashed" data-h-add-task>+ Add what I\'m avoiding</button></div></div>';
  }

  function renderCheckIn() {
    const d = draft;
    const sug = suggestFor(d.reasons, "");
    const avoidFirst = d.reasons.includes("Avoiding something");
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">Before · 20 seconds</span>' +
      '<button type="button" class="icon-btn" data-h-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<h2 id="flowTitle" class="flow-h">What pulled you here?</h2>' +
      chipGroup("reason", REASONS, d.reasons, "") +
      '<label class="field">The thought, word for word<textarea id="hThought" rows="2" placeholder="e.g. I\'ll just check one thing first">' + esc(d.thought) + "</textarea></label>" +
      '<div class="field"><span>How do I feel right now?</span>' + chipGroup("feel", FEEL_BEFORE.concat(d.feelings.filter((f) => !FEEL_BEFORE.includes(f))), d.feelings, "pink") +
      '<button type="button" class="link-btn" data-h-own-feel>+ my own word</button></div>' +
      '<label class="vol">Mood <input type="range" id="hMood" min="1" max="10" value="' + d.mood + '"> <b id="hMoodVal">' + d.mood + "/10</b></label>" +
      (avoidFirst ? avoidHtml(d) : "") +
      '<div class="field"><span>' + (avoidFirst ? "Or something I love" : "Instead, I\'ll do…") + "</span>" +
      (sug.some((x) => x.why) ? '<span class="muted small">When I felt like this before, these helped:</span>' : "") +
      '<div class="chip-row">' + sug.map((x) => '<button type="button" class="chip sage" data-h-pick-passion="' + esc(x.p.id) + '" aria-pressed="' + (d.passion === x.p.id) + '">' + esc(x.p.name) + (x.why ? " · " + esc(x.why) : "") + "</button>").join("") + "</div>" +
      '<label class="sr-only" for="hPassion">Passion</label><select id="hPassion" class="kind-select"><option value="">— choose a passion —</option>' +
      '<optgroup label="My passions">' + passions().map((p) => '<option value="' + esc(p.id) + '"' + (d.passion === p.id ? " selected" : "") + ">" + esc(p.name) + "</option>").join("") + "</optgroup>" +
      (tasks().length ? '<optgroup label="Things I\'m avoiding">' + tasks().map((p) => '<option value="' + esc(p.id) + '"' + (d.passion === p.id ? " selected" : "") + ">" + esc(p.name) + "</option>").join("") + "</optgroup>" : "") +
      "</select>" +
      '<button type="button" class="link-btn" data-h-add-activity>+ Another activity (saved to my passions)</button></div>' +
      (avoidFirst ? "" : avoidHtml(d)) +
      (d.passion === "meditation"
        ? '<div class="med-set"><span class="eyebrow">Meditation timer</span>' +
          '<div class="chip-row" role="group" aria-label="Meditation length">' + MED_TIMES.map((m) => '<button type="button" class="chip" data-h-med-min="' + m + '" aria-pressed="' + (d.med.minutes === m) + '">' + m + " min</button>").join("") + "</div>" +
          '<div class="chip-row" role="group" aria-label="Interval bells">' + MED_INTERVALS.map((x) => '<button type="button" class="chip" data-h-med-int="' + x.m + '" aria-pressed="' + (d.med.interval === x.m) + '">' + x.label + "</button>").join("") + "</div>" +
          '<div class="chip-row" role="group" aria-label="Bell sound">' + MED_SOUNDS.map((x) => '<button type="button" class="chip sage" data-h-med-sound="' + x.id + '" aria-pressed="' + (d.med.sound === x.id) + '">' + x.label + "</button>").join("") +
          '<button type="button" class="link-btn" data-h-med-test>Listen</button></div>' +
          '<span class="muted small">A bell at the start, ' + (d.med.interval ? "every " + d.med.interval + " min, " : "") + "and three at the end.</span></div>"
        : '<div class="chip-row" role="group" aria-label="Length">' + TIMES.map((t) => '<button type="button" class="chip" data-h-flow-min="' + t.m + '" aria-pressed="' + (d.minutes === t.m) + '">' + t.label + "</button>").join("") + "</div>") +
      '<button type="button" class="btn-primary" data-h-begin>' + (d.passion ? (passionById(d.passion).task ? "Start 10 brave minutes · " : "Start ") + esc(passionById(d.passion).name) : "Start") + "</button>";
    $("#hMood").addEventListener("input", function () { d.mood = Number(this.value); $("#hMoodVal").textContent = d.mood + "/10"; });
    $("#hThought").addEventListener("input", function () { d.thought = this.value; });
    $("#hPassion").addEventListener("change", function () { d.passion = this.value; renderCheckIn(); });
  }

  function begin() {
    const d = draft;
    if (!d.passion) { toast("Pick a passion first"); $("#hPassion").focus(); return; }
    S.active = {
      id: uid(), passion: d.passion, start: Date.now(), planned: d.minutes, pausedMs: 0, pausedAt: null,
      reasons: d.reasons, thought: d.thought.trim(), before: { feelings: d.feelings, mood: d.mood },
      prompt: promptFor(passionById(d.passion)), parked: [], notes: "",
    };
    if (d.passion === "meditation") {
      S.active.planned = d.med.minutes;
      S.active.med = { interval: d.med.interval, sound: d.med.sound, bells: 0, endRung: false };
      S.medMinutes = d.med.minutes; S.medInterval = d.med.interval; S.medSound = d.med.sound;
      ringBell(d.med.sound, 1);
    }
    draft = null;
    save();
    renderDoing();
  }

  function elapsedMs(a) {
    const end = a.pausedAt || Date.now();
    return Math.max(0, end - a.start - a.pausedMs);
  }
  function clock(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(sec).padStart(2, "0");
  }

  function renderDoing() {
    const a = S.active;
    const p = passionById(a.passion) || { name: "Session" };
    const person = S.people.length ? S.people[S.reminderIndex % S.people.length] : null;
    const snd = window.CalmPlayer ? window.CalmPlayer.soundOptions() : [];
    const cur = window.CalmPlayer ? window.CalmPlayer.currentSound() : "";
    const writing = ["morning-pages", "journaling", "spell", "talking", "curiosity", "fairytales", "song"].includes(a.passion);
    const med = a.med ? '<div class="med-set"><span class="eyebrow">Bells</span><span>' +
      esc((MED_SOUNDS.find((x) => x.id === a.med.sound) || {}).label || "Bell") + " · start" + (a.med.interval ? " · every " + a.med.interval + " min" : "") + " · three at the end</span>" +
      '<span class="muted small">Keep the screen on so the bells can ring.</span></div>' : "";
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">Now · ' + esc(p.name) + '</span><span class="muted small">phone on do-not-disturb</span></div>' +
      '<div class="timer" role="timer" aria-live="off"><div class="ring" id="hRing"><b id="hClock">' + clock(elapsedMs(a)) + "</b>" +
      '<span id="hOf">' + (a.planned ? "of " + a.planned + " min" : "open-ended") + "</span></div></div>" +
      '<div class="flow-card"><span class="eyebrow">Today\'s tiny prompt</span><span class="flow-prompt" id="flowTitle">' + esc(a.prompt) + "</span>" +
      '<button type="button" class="link-btn" data-h-flow-prompt>Another idea</button></div>' +
      med +
      (person ? '<div class="reminder"><div><span class="eyebrow">Remember · ' + esc(person.name) + "</span><b>" + esc(person.line) + "</b></div>" +
        '<button type="button" class="icon-btn" data-h-next-reminder aria-label="Next reminder"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></div>' : "") +
      (snd.length > 1 ? '<div class="field"><span>Sound underneath</span><div class="chip-row">' +
        snd.slice(0, 9).map((o) => '<button type="button" class="chip" data-h-sound="' + esc(o.id) + '" aria-pressed="' + (cur === o.id) + '">' + esc(o.title) + "</button>").join("") + "</div></div>" : "") +
      (writing ? '<label class="field">My pages / notes<textarea id="hNotes" rows="5" placeholder="Write here if you like — it\'s saved with this session">' + esc(a.notes) + "</textarea></label>" : "") +
      '<form class="field park" data-h-park-form><label for="hPark">Urge to check something? Park it here and keep going</label>' +
      '<div class="cur-add"><input id="hPark" placeholder="e.g. reply to Léa, look up that song" maxlength="120"><button type="submit" class="btn-soft">Park</button></div>' +
      (a.parked.length ? '<ul class="parked">' + a.parked.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "") + "</form>" +
      '<div class="flow-btns"><button type="button" class="btn-ghost-dark" data-h-pause>' + (a.pausedAt ? "Resume" : "Pause") + "</button>" +
      '<button type="button" class="btn-primary" data-h-done>I\'m done</button></div>' +
      '<button type="button" class="link-btn center" data-h-discard>Discard this session</button>' +
      '<button type="button" class="link-btn center" data-h-close>Minimise — keep the timer running</button>';
    const notes = $("#hNotes");
    if (notes) notes.addEventListener("input", function () { a.notes = this.value; save(); });
    clearInterval(tick);
    tick = setInterval(updateClock, 1000);
    updateClock();
  }

  function updateClock() {
    const a = S.active;
    const c = $("#hClock");
    if (!a || !c) return;
    const ms = elapsedMs(a);
    c.textContent = clock(ms);
    const ring = $("#hRing");
    if (a.med && !a.pausedAt) {
      const total = a.planned * 60000;
      if (a.med.interval) {
        const k = Math.floor(ms / (a.med.interval * 60000));
        if (k > a.med.bells) { a.med.bells = k; if (ms < total - 5000) ringBell(a.med.sound, 1); save(); }
      }
      if (ms >= total && !a.med.endRung) { a.med.endRung = true; save(); ringBell(a.med.sound, 3); }
    }
    if (a.planned) {
      const pct = Math.min(1, ms / (a.planned * 60000));
      ring.style.setProperty("--pct", (pct * 360).toFixed(1) + "deg");
      if (pct >= 1 && !a.doneNotice) { a.doneNotice = true; save(); toast("Time's up — finish when you're ready"); }
    } else ring.style.setProperty("--pct", "360deg");
  }

  function renderCheckOut() {
    const a = S.active;
    const p = passionById(a.passion) || { name: "Session" };
    if (!a.after) a.after = { feelings: [], mood: a.before.mood };
    clearInterval(tick);
    if (!a.pausedAt) { a.pausedAt = Date.now(); save(); }
    const mins = Math.max(1, Math.round(elapsedMs(a) / 60000));
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">After · ' + esc(p.name) + " · " + fmtMin(mins) + "</span></div>" +
      '<h2 id="flowTitle" class="flow-h">You chose this over scrolling. How do you feel now?</h2>' +
      '<div class="flow-card light"><span class="eyebrow">Before, you ' + (a.thought ? "thought" : "felt") + "</span>" +
      (a.thought ? "<i>“" + esc(a.thought) + "”</i>" : "") +
      '<span class="muted small">' + esc((a.before.feelings || []).join(", ") || "—") + " · mood " + a.before.mood + "/10</span></div>" +
      chipGroup("after", FEEL_AFTER.concat(a.after.feelings.filter((f) => !FEEL_AFTER.includes(f))), a.after.feelings, "sage") +
      '<button type="button" class="link-btn" data-h-own-after>+ my own word</button>' +
      '<label class="vol">Mood <input type="range" id="hMoodAfter" min="1" max="10" value="' + a.after.mood + '"> <b id="hMoodAfterVal">' + a.after.mood + '/10</b> <span class="lift" id="hLift"></span></label>' +
      '<label class="field">One line about it<textarea id="hNote" rows="2" placeholder="What happened? What did you notice?">' + esc(a.note || "") + "</textarea></label>" +
      (a.parked.length ? '<div class="flow-card light"><span class="eyebrow">You parked</span><ul class="parked">' + a.parked.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></div>" : "") +
      '<div class="flow-btns"><button type="button" class="btn-ghost-dark" data-h-back-doing>Keep going</button>' +
      '<button type="button" class="btn-primary" data-h-save>Save to my journal</button></div>';
    const showLift = () => {
      const l = a.after.mood - a.before.mood;
      const el = $("#hLift");
      el.textContent = (l > 0 ? "+" : "") + l;
      el.className = "lift " + (l >= 0 ? "up" : "down");
    };
    $("#hMoodAfter").addEventListener("input", function () { a.after.mood = Number(this.value); $("#hMoodAfterVal").textContent = a.after.mood + "/10"; showLift(); save(); });
    $("#hNote").addEventListener("input", function () { a.note = this.value; save(); });
    showLift();
  }

  function saveSession() {
    const a = S.active;
    const mins = Math.max(1, Math.round(elapsedMs(a) / 60000));
    const p = passionById(a.passion);
    S.sessions.push({
      id: a.id, passion: a.passion, passionName: p ? p.name : "", start: a.start, minutes: mins,
      reasons: a.reasons, thought: a.thought, before: a.before, after: a.after,
      note: (a.note || "").trim(), notes: (a.notes || "").trim(), parked: a.parked, prompt: a.prompt,
    });
    S.active = null;
    save();
    closeFlow();
    const l = S.sessions[S.sessions.length - 1];
    toast("Saved · " + fmtMin(mins) + (lift(l) != null ? " · mood " + signed(lift(l)) : ""));
  }

  /* ------------------------------------------------------------------ */
  /* Journal                                                             */
  /* ------------------------------------------------------------------ */

  function renderJournal() {
    const el = $("#tab-journal");
    const r = S.journalRange;
    const list = sessionsIn(r);
    const mins = list.reduce((n, s) => n + (s.minutes || 0), 0);
    const lifts = list.map(lift).filter((x) => x != null);
    // minutes per day
    const days = r === "week" ? 7 : r === "month" ? 30 : 0;
    let bars = "";
    if (days) {
      const start = rangeStart(r);
      const perDay = Array.from({ length: days }, (_, i) => {
        const d0 = start + i * 864e5;
        return { d: d0, m: list.filter((s) => s.start >= d0 && s.start < d0 + 864e5).reduce((n, s) => n + (s.minutes || 0), 0) };
      });
      const max = Math.max(30, ...perDay.map((x) => x.m));
      const label = perDay.map((x) => new Date(x.d).toLocaleDateString(undefined, { weekday: "short" }) + " " + x.m + " min").join(", ");
      bars = '<div class="panel"><span class="panel-title">Minutes per day</span><div class="bars" role="img" aria-label="' + esc(label) + '">' +
        perDay.map((x) => '<div class="bar-col"><div class="bar-fill" style="height:' + Math.round((x.m / max) * 100) + '%"></div>' +
          (days === 7 ? '<span>' + new Date(x.d).toLocaleDateString(undefined, { weekday: "narrow" }) + "</span>" : "") + "</div>").join("") +
        "</div></div>";
    }
    const lp = liftByPassion(list);
    const reasons = {};
    list.forEach((s) => (s.reasons || []).forEach((x) => { reasons[x] = (reasons[x] || 0) + 1; }));
    const topReasons = Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const thoughts = {};
    list.forEach((s) => { const t = (s.thought || "").trim(); if (t) { const k = t.toLowerCase(); thoughts[k] = thoughts[k] || { t, n: 0 }; thoughts[k].n++; } });
    const topThoughts = Object.values(thoughts).sort((a, b) => b.n - a.n).slice(0, 5);
    const hours = {};
    list.filter((s) => (s.reasons || []).length).forEach((s) => { const h = new Date(s.start).getHours(); hours[h] = (hours[h] || 0) + 1; });
    const peak = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
    const best = lp[0];
    let pattern = "";
    if (peak && peak[1] >= 2) {
      pattern = "Most of your urges come around " + String(peak[0]).padStart(2, "0") + ":00" +
        (topReasons[0] ? ", often when you're “" + topReasons[0][0].toLowerCase() + "”" : "") + "." +
        (best && best.lift > 0 ? " " + (passionById(best.id) || { name: "Your passions" }).name + " lifts your mood the most (" + signed(best.lift) + ")." : "");
    }
    el.innerHTML =
      '<section class="block"><div class="block-head"><h1 class="page-title">Journal</h1>' +
      '<div class="chip-row">' + [["week", "Week"], ["month", "Month"], ["all", "All time"]].map(([k, l]) =>
        '<button type="button" class="pill' + (r === k ? " active" : "") + '" data-h-range="' + k + '">' + l + "</button>").join("") + "</div></div>" +
      '<div class="stat-row"><div><b>' + fmtMin(mins) + "</b><span>of things I love</span></div><div><b>" + list.length + "</b><span>sessions</span></div>" +
      "<div><b>" + (lifts.length ? signed(avg(lifts)) : "—") + "</b><span>average mood lift</span></div><div><b>" + streak() + "</b><span>day streak</span></div></div>" +
      (pattern ? '<div class="pattern"><span class="eyebrow light">A pattern I noticed</span><p>' + esc(pattern) + "</p></div>" : "") +
      '<div class="journal-grid">' + bars +
      '<div class="panel"><span class="panel-title">What lifts me most (before → after)</span>' +
      (lp.length ? lp.slice(0, 6).map((x) => '<div class="kv"><span>' + esc((passionById(x.id) || { name: x.id }).name) + "</span><b>" + signed(x.lift) + "</b></div>").join("") : '<span class="muted small">After a few sessions you\'ll see which passions help most.</span>') + "</div>" +
      '<div class="panel"><span class="panel-title">What pulls me toward scrolling</span>' +
      (topReasons.length ? topReasons.map(([k, n]) => '<div class="kv"><span>' + esc(k) + "</span><b>" + n + "×</b></div>").join("") : '<span class="muted small">Nothing logged yet.</span>') + "</div>" +
      '<div class="panel"><span class="panel-title">Thoughts that came back most</span>' +
      (topThoughts.length ? topThoughts.map((x) => '<div class="kv"><i>“' + esc(x.t) + "”</i><b>" + x.n + "×</b></div>").join("") : '<span class="muted small">Write the thought word for word in the check-in and it shows here.</span>') + "</div>" +
      "</div>" +
      '<h2 class="sub-h">Sessions</h2>' +
      (list.length ? '<div class="sess-list">' + list.slice().reverse().map((s) => sessionRow(s, true) + (s.notes ? '<details class="sess-pages"><summary>My pages / notes</summary><p>' + esc(s.notes) + "</p></details>" : "")).join("") + "</div>"
        : '<p class="empty">No sessions in this period yet.</p>') +
      '<p class="muted small"><button type="button" class="link-btn" data-h-export>Export my journal</button> · everything stays in this browser.</p>' +
      "</section>";
  }

  /* ------------------------------------------------------------------ */
  /* Spell book                                                          */
  /* ------------------------------------------------------------------ */

  function allSpells() { return S.spells.concat(SPELLS); }

  function renderSpells() {
    const el = $("#tab-spells");
    const tag = S.spellTag;
    const list = allSpells().filter((s) => !tag || s.tag === tag);
    el.innerHTML =
      '<section class="spellbook"><div class="block-head"><div><span class="eyebrow light">My spell book</span>' +
      '<h1 class="page-title light">Little magic for real life</h1>' +
      '<span class="spell-intro">Say the words out loud. Change any line until it sounds like you.</span></div>' +
      '<button type="button" class="btn-light" data-h-new-spell>+ Write a spell</button></div>' +
      '<div class="chip-row">' + [{ id: "", label: "All" }].concat(SPELL_TAGS).map((t) =>
        '<button type="button" class="pill dark' + (tag === t.id ? " active" : "") + '" data-h-spell-tag="' + t.id + '">' + esc(t.label) + "</button>").join("") + "</div>" +
      '<form class="spell-form" id="spellForm" hidden>' +
      '<label class="field">Name<input id="spTitle" maxlength="60" placeholder="e.g. The Sunday Reset" required></label>' +
      '<label class="field">Kind<select id="spTag" class="kind-select">' + SPELL_TAGS.map((t) => '<option value="' + t.id + '">' + esc(t.label) + "</option>").join("") + "</select></label>" +
      '<label class="field">When / what I need<input id="spWhen" maxlength="80" placeholder="e.g. Sunday evening · a candle, a bay leaf"></label>' +
      '<label class="field">What I do<textarea id="spSteps" rows="3"></textarea></label>' +
      '<label class="field">The words<textarea id="spWords" rows="4" placeholder="One line per line"></textarea></label>' +
      '<div class="flow-btns"><button type="button" class="btn-ghost" data-h-cancel-spell>Cancel</button><button type="submit" class="btn-light">Save spell</button></div></form>' +
      '<div class="spells">' + list.map((s, i) =>
        '<article class="spell' + (i === 0 && !tag ? " first" : "") + '">' +
        '<span class="eyebrow">' + esc(s.when || (SPELL_TAGS.find((t) => t.id === s.tag) || {}).label || "") + "</span>" +
        '<span class="spell-title">' + esc(s.title) + "</span>" +
        (s.steps ? '<span class="spell-steps">' + esc(s.steps) + "</span>" : "") +
        (s.words ? '<p class="spell-words">' + esc(s.words) + "</p>" : "") +
        (s.mine ? '<button type="button" class="link-btn" data-h-del-spell="' + esc(s.id) + '">Remove</button>' : "") +
        "</article>").join("") + "</div></section>";
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */

  document.addEventListener("click", function (e) {
    const b = e.target.closest("button, a");
    if (!b) return;
    const d = b.dataset;

    if (d.hUrge !== undefined) { startCheckIn(""); return; }
    if (d.hResume !== undefined) { openFlow(); renderDoing(); return; }
    if (d.hPick !== undefined) {
      const sug = suggestFor([], S.energy);
      const pool = sug.length ? sug.map((x) => x.p) : passions();
      startCheckIn(pool[Math.floor(Math.random() * pool.length)].id);
      return;
    }
    if (d.hStart) { startCheckIn(d.hStart); return; }
    if (d.hEnergy) { S.energy = S.energy === d.hEnergy ? "" : d.hEnergy; save(); renderToday(); return; }
    if (d.hMinutes !== undefined) { S.minutes = Number(d.hMinutes); save(); renderPassions(); return; }
    if (d.hNextPrompt) { nextPrompt(d.hNextPrompt); renderPassions(); return; }
    if (d.hAddPassion !== undefined) {
      const name = (prompt("Name of the passion") || "").trim();
      if (!name) return;
      const step = (prompt("A tiny first step for it (optional)") || "").trim();
      addPassion(name, step); renderPassions(); toast(name + " added"); return;
    }
    if (d.hDelPassion) {
      const p = passionById(d.hDelPassion);
      if (p && confirm("Remove “" + p.name + "”? Its past sessions stay in your journal.")) {
        S.customPassions = S.customPassions.filter((x) => x.id !== p.id); forget(p.id); save(); renderPassions();
      }
      return;
    }
    // people
    if (d.hAddPerson !== undefined || d.hEditPerson) {
      const p = d.hEditPerson ? S.people.find((x) => x.id === d.hEditPerson) : null;
      const name = (prompt("Who inspires you?", p ? p.name : "") || "").trim();
      if (!name) return;
      const line = (prompt("What do you want to remember from " + name + "?", p ? p.line : "") || "").trim();
      if (!line) return;
      const sub = (prompt("A longer line in your own words (optional)", p ? p.sub || "" : "") || "").trim();
      if (p) Object.assign(p, { name, line, sub });
      else S.people.push({ id: uid(), name, line, sub });
      save(); renderToday(); return;
    }
    if (d.hDelPerson) {
      const p = S.people.find((x) => x.id === d.hDelPerson);
      if (p && confirm("Remove " + p.name + " from My people?")) { S.people = S.people.filter((x) => x !== p); forget(p.id); save(); renderToday(); }
      return;
    }
    // flow
    if (d.hClose !== undefined) { closeFlow(); return; }
    if (d.hPickReason) { toggle(draft.reasons, d.hPickReason); renderCheckIn(); return; }
    if (d.hPickFeel) { toggle(draft.feelings, d.hPickFeel); renderCheckIn(); return; }
    if (d.hOwnFeel !== undefined) { const w = (prompt("Your word for how you feel") || "").trim(); if (w) { draft.feelings.push(w.slice(0, 24)); renderCheckIn(); } return; }
    if (d.hPickPassion) { draft.passion = d.hPickPassion; renderCheckIn(); return; }
    if (d.hAddTask !== undefined) {
      const id = addTask(prompt("What are you avoiding? (e.g. work, emails, the query letter, tidying)"));
      if (!id) return;
      if (draft) { draft.passion = id; if (!draft.minutes) draft.minutes = 20; renderCheckIn(); }
      else renderPassions();
      return;
    }
    if (d.hAddActivity !== undefined) {
      const name = prompt("What would you like to do?");
      if (!name || !name.trim()) return;
      const step = (prompt("A tiny first step for it (optional)") || "").trim();
      const id = addPassion(name, step);
      if (id) { draft.passion = id; renderCheckIn(); toast(name.trim() + " added to your passions"); }
      return;
    }
    if (d.hDelTask) {
      const t = (S.tasks || []).find((x) => x.id === d.hDelTask);
      if (t && confirm("Remove “" + t.name + "”? Past sessions stay in your journal.")) { S.tasks = S.tasks.filter((x) => x !== t); forget(t.id); save(); renderPassions(); }
      return;
    }
    if (d.hFlowMin !== undefined) { draft.minutes = Number(d.hFlowMin); renderCheckIn(); return; }
    if (d.hMedMin) { draft.med.minutes = Number(d.hMedMin); renderCheckIn(); return; }
    if (d.hMedInt !== undefined) { draft.med.interval = Number(d.hMedInt); renderCheckIn(); return; }
    if (d.hMedSound) { draft.med.sound = d.hMedSound; ringBell(d.hMedSound, 1); renderCheckIn(); return; }
    if (d.hMedTest !== undefined) { ringBell(draft.med.sound, 1); return; }
    if (d.hBegin !== undefined) { begin(); return; }
    if (d.hFlowPrompt !== undefined) {
      const p = passionById(S.active.passion);
      nextPrompt(p.id); S.active.prompt = promptFor(p); save(); renderDoing(); return;
    }
    if (d.hNextReminder !== undefined) { S.reminderIndex = (S.reminderIndex || 0) + 1; save(); renderDoing(); return; }
    if (d.hSound !== undefined) { if (window.CalmPlayer) window.CalmPlayer.playSound(d.hSound); setTimeout(renderDoing, 50); return; }
    if (d.hPause !== undefined) {
      const a = S.active;
      if (a.pausedAt) { a.pausedMs += Date.now() - a.pausedAt; a.pausedAt = null; }
      else a.pausedAt = Date.now();
      save(); renderDoing(); return;
    }
    if (d.hDone !== undefined) { renderCheckOut(); return; }
    if (d.hBackDoing !== undefined) {
      const a = S.active;
      if (a.pausedAt) { a.pausedMs += Date.now() - a.pausedAt; a.pausedAt = null; }
      save(); renderDoing(); return;
    }
    if (d.hPickAfter) { toggle(S.active.after.feelings, d.hPickAfter); save(); renderCheckOut(); return; }
    if (d.hOwnAfter !== undefined) { const w = (prompt("Your word for how you feel now") || "").trim(); if (w) { S.active.after.feelings.push(w.slice(0, 24)); save(); renderCheckOut(); } return; }
    if (d.hSave !== undefined) { saveSession(); return; }
    if (d.hDiscard !== undefined) { if (confirm("Discard this session? It won't be saved.")) { S.active = null; save(); closeFlow(); } return; }
    // journal
    if (d.hRange) { S.journalRange = d.hRange; save(); renderJournal(); return; }
    if (d.hDelSession) {
      if (confirm("Delete this session from your journal?")) { S.sessions = S.sessions.filter((s) => s.id !== d.hDelSession); forget(d.hDelSession); save(); renderJournal(); }
      return;
    }
    if (d.hExport !== undefined) {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "my-hangout-journal.json";
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
      return;
    }
    // spells
    if (d.hSpellTag !== undefined) { S.spellTag = d.hSpellTag; save(); renderSpells(); return; }
    if (d.hNewSpell !== undefined) { $("#spellForm").hidden = false; $("#spTitle").focus(); return; }
    if (d.hCancelSpell !== undefined) { $("#spellForm").hidden = true; return; }
    if (d.hDelSpell) { if (confirm("Remove this spell?")) { S.spells = S.spells.filter((s) => s.id !== d.hDelSpell); forget(d.hDelSpell); save(); renderSpells(); } return; }
  });

  function toggle(arr, v) { const i = arr.indexOf(v); if (i === -1) arr.push(v); else arr.splice(i, 1); }

  document.addEventListener("submit", function (e) {
    const f = e.target;
    if (f.dataset.hParkForm !== undefined) {
      e.preventDefault();
      const v = $("#hPark").value.trim();
      if (!v) return;
      S.active.parked.push(v.slice(0, 120)); save(); renderDoing(); toast("Parked. Back to it.");
      return;
    }
    if (f.dataset.hCurForm !== undefined) {
      e.preventDefault();
      const v = $("#curNote").value.trim();
      if (!v) return;
      S.curiosity.notes.push({ text: v.slice(0, 200), date: Date.now() }); save(); renderPassions();
      return;
    }
    if (f.id === "spellForm") {
      e.preventDefault();
      const title = $("#spTitle").value.trim();
      if (!title) return;
      S.spells.unshift({ id: uid(), mine: true, title, tag: $("#spTag").value, when: $("#spWhen").value.trim(),
        steps: $("#spSteps").value.trim(), words: $("#spWords").value.trim() });
      S.spellTag = ""; save(); renderSpells(); toast("Spell saved to your book");
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "curTopic") { S.curiosity.topic = e.target.value.trim(); save(); }
  });

  window.addEventListener("hashchange", route);

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  route();
  if (S.active) {
    const a = S.active;
    const p = passionById(a.passion);
    toast("Your " + (p ? p.name.toLowerCase() : "session") + " session is still running — tap “Back to my …” on Today");
  }
})();
