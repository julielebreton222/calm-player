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
      compost: [],
      compostAdded: 0,
      yoga: [],
      spotify: [],
      gentle: false,
      noise: { on: true, vol: 0.18 },
    };
  }
  let S = (() => {
    try { const raw = localStorage.getItem(KEY); return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults(); }
    catch (e) { return defaults(); }
  })();
  function forget(id) { S.deleted = (S.deleted || []).concat(id).slice(-2000); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* keep working in memory */ } }

  const TINY = ["playlists", "dancing", "singing", "talking", "dolls", "song"];
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
  function ideaAsPassion(c) { return { id: "idea:" + c.id, name: c.text, color: "#C9D9C0", idea: true, energy: [], prompts: ["Start with the very first tiny bit of it. That's enough."] }; }
  function passionById(id) {
    if (id && id.startsWith("idea:")) { const c = (S.compost || []).find((x) => "idea:" + x.id === id); return c ? ideaAsPassion(c) : null; }
    return PASSIONS.concat(S.customPassions, tasks()).find((p) => p.id === id) || null;
  }
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

  const TABS = ["today", "passions", "compost", "meditate", "move", "sounds", "journal", "spells"];
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
    if (h.startsWith("#/")) { showTab(h.slice(2) === "playground" ? "today" : h.slice(2)); return; }
    if (h.length > 1) {
      const el = document.getElementById(h.slice(1));
      const tab = el && el.closest(".tab");
      if (tab) { showTab(tab.id.replace("tab-", ""), el); return; }
    }
    showTab("today");
  }
  function renderTab(id) {
    document.body.classList.toggle("gentle", !!S.gentle);
    if (id === "today") renderToday();
    if (id === "compost") renderCompost();
    if (id === "meditate") renderMeditate();
    if (id === "move") renderYoga();
    if (id === "sounds") renderSoundsExtras();
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

  /* ---------- little drawings: an original flower-face friend + doodle icons ---------- */
  let mascotN = 0;
  function mascot(size, mood) {
    const gid = "pg" + (++mascotN);
    const petals = [0, 60, 120, 180, 240, 300].map((r, i) =>
      '<g transform="rotate(' + r + ' 50 50)"><ellipse cx="50" cy="22" rx="15" ry="24" fill="url(#' + gid + ')"/>' +
      '<circle cx="46" cy="14" r="1.3" fill="#8A2A45"/><circle cx="53" cy="20" r="1.1" fill="#8A2A45"/><circle cx="48" cy="27" r="1" fill="#8A2A45"/>' +
      (i % 2 ? '<circle cx="55" cy="11" r="0.9" fill="#8A2A45"/>' : "") + "</g>").join("");
    const eyes = mood === "awake"
      ? '<circle cx="42" cy="50" r="2.4" fill="#5A2638"/><circle cx="58" cy="50" r="2.4" fill="#5A2638"/>'
      : '<path d="M37.5 50 q4.5 3.2 9 0" stroke="#5A2638" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M53.5 50 q4.5 3.2 9 0" stroke="#5A2638" stroke-width="2" fill="none" stroke-linecap="round"/>';
    return '<svg class="mascot" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<defs><radialGradient id="' + gid + '" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#E0458A"/><stop offset=".55" stop-color="#F48FB8"/><stop offset="1" stop-color="#FCE1EC"/></radialGradient></defs>' +
      petals +
      '<circle cx="50" cy="52" r="19" fill="#F7C9AA"/>' +
      '<ellipse cx="38" cy="58" rx="5" ry="3.2" fill="#F29AB5" opacity=".75"/><ellipse cx="62" cy="58" rx="5" ry="3.2" fill="#F29AB5" opacity=".75"/>' +
      '<circle cx="36" cy="56" r=".8" fill="#A04A55"/><circle cx="39" cy="59" r=".8" fill="#A04A55"/><circle cx="61" cy="56" r=".8" fill="#A04A55"/><circle cx="64" cy="59" r=".8" fill="#A04A55"/>' +
      eyes + '<ellipse cx="50" cy="61" rx="2.6" ry="3.2" fill="#8A3A3A"/></svg>';
  }
  const ICONS = {
    passions: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    compost: '<path d="M4 18h16M6 18c0-3 2.5-5 6-5s6 2 6 5"/><path d="M12 13V8m0 0c-2 0-3.5-1.5-3.5-3.5C10.5 4.5 12 6 12 8zm0 0c2 0 3.5-1.5 3.5-3.5C13.5 4.5 12 6 12 8z"/>',
    meditate: '<circle cx="12" cy="6" r="2.5"/><path d="M5 19c2-1 4-1.5 7-1.5s5 .5 7 1.5M8 15l4-4 4 4M12 11v-2"/>',
    move: '<circle cx="14" cy="5" r="2"/><path d="M6 20l4-6 3 2 2-5 4 3M10 14l-1-4 5-1"/>',
    sounds: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    journal: '<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h10M10 8h5M10 11h4"/>',
    spells: '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M14.5 14.5c2.5-.3 4.8 1 5.5 3.5"/>',
  };
  function icon(name, size) {
    return '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  // Little lines to catch me. Short quotations, credited; the last few are what I remember from my people.
  const QUOTES = [
    { q: "In the true man there is a child hidden — it wants to play.", by: "Friedrich Nietzsche, Thus Spoke Zarathustra" },
    { q: "Curiouser and curiouser!", by: "Alice, in Lewis Carroll's Alice's Adventures in Wonderland" },
    { q: "Who in the world am I? Ah, that's the great puzzle!", by: "Alice, in Alice's Adventures in Wonderland" },
    { q: "Why, sometimes I've believed as many as six impossible things before breakfast.", by: "the White Queen, in Lewis Carroll's Through the Looking-Glass" },
    { q: "It's no use going back to yesterday, because I was a different person then.", by: "Alice, in Alice's Adventures in Wonderland" },
    { q: "You were much more… muchier. You've lost your muchness.", by: "the Mad Hatter, in the film Alice in Wonderland (2010)" },
    { q: "If you look the right way, you can see that the whole world is a garden.", by: "Frances Hodgson Burnett, The Secret Garden" },
    { q: "Where you tend a rose, my lad, a thistle cannot grow.", by: "Frances Hodgson Burnett, The Secret Garden" },
    { q: "Isn't it nice to think that tomorrow is a new day with no mistakes in it yet?", by: "Anne, in L. M. Montgomery's Anne of Green Gables" },
    { q: "I'm so glad I live in a world where there are Octobers.", by: "Anne, in Anne of Green Gables" },
    { q: "I am large, I contain multitudes.", by: "Walt Whitman, Song of Myself" },
    { q: "I celebrate myself, and sing myself.", by: "Walt Whitman, Song of Myself" },
    { q: "Pay attention. Be astonished. Tell about it.", by: "Mary Oliver, “Sometimes”" },
    { q: "Tell me, what is it you plan to do with your one wild and precious life?", by: "Mary Oliver, “The Summer Day”" },
    { q: "Not all those who wander are lost.", by: "J. R. R. Tolkien, The Fellowship of the Ring" },
    { q: "Play is the work of the child.", by: "Maria Montessori" },
    { q: "The creation of something new is not accomplished by the intellect but by the play instinct.", by: "Carl Jung, Psychological Types" },
    { q: "Child spirit. Doing me, with joy.", by: "what I remember from Kitty Lever" },
    { q: "Hard work and curiosity.", by: "what I remember from Xenia Adonts" },
    { q: "Art comes out of loneliness. It is good.", by: "what I remember from Heaven Sent Honey" },
  ];
  let quoteIx = Math.floor(Math.random() * QUOTES.length);
  function todaysQuote() { return QUOTES[quoteIx % QUOTES.length]; }

  function renderToday() {
    const el = $("#tab-today");
    const q = todaysQuote();
    el.innerHTML =
      '<section class="home">' +
      (S.active ? '<button type="button" class="resume-pill" data-h-resume>Back to my ' + esc((passionById(S.active.passion) || {}).name || "session") + "</button>" : "") +
      '<div class="breath" aria-hidden="true"><div class="breath-glow"></div><div class="breath-flower">' + mascot(150, "sleepy") + "</div></div>" +
      '<p class="breath-words" aria-live="off"><span class="in">breathe in</span><span class="out">breathe out</span></p>' +
      '<figure class="home-quote"><blockquote>“' + esc(q.q) + "”</blockquote><figcaption>— " + esc(q.by) + "</figcaption>" +
      '<button type="button" class="link-btn" data-h-quote>another</button></figure>' +
      '<p class="home-remind">Remember to play.</p>' +
      '<div class="home-catch">' +
      '<button type="button" class="catch-btn" data-h-urge>I want to scroll…</button>' +
      '<button type="button" class="catch-btn soft" data-h-onething>I don\'t know what to do with myself</button>' +
      "</div>" +
      '<button type="button" class="link-btn home-moment" data-h-moment>I just did something — keep it</button>' +
      "</section>";
  }

  /* ---------- "I don't know what to do with myself": one thing, one button ---------- */
  let oneIx = -1;
  function renderOneThing(next) {
    const pool = suggestFor([], "").map((x) => x.p).concat(passions().filter((p) => TINY.includes(p.id)));
    const uniq = pool.filter((p, i) => pool.findIndex((x) => x.id === p.id) === i);
    oneIx = next ? (oneIx + 1) % uniq.length : Math.floor(Math.random() * uniq.length);
    const p = uniq[oneIx];
    openFlow();
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">Just one thing</span>' +
      '<button type="button" class="icon-btn" data-h-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="moment-face">' + mascot(110, "awake") + "</div>" +
      '<h2 id="flowTitle" class="flow-h center">How about… ' + esc(p.name.toLowerCase()) + "?</h2>" +
      '<p class="one-step">' + esc(promptFor(p)) + "</p>" +
      '<p class="muted small center">You don\'t have to feel like it. Two minutes, and you\'re allowed to stop.</p>' +
      '<button type="button" class="btn-primary" data-h-two="' + esc(p.id) + '">Let\'s play for 2 minutes</button>' +
      '<div class="flow-btns"><button type="button" class="btn-ghost-dark" data-h-one-next>Something else</button>' +
      '<button type="button" class="btn-ghost-dark" data-h-start="' + esc(p.id) + '">Ask me first</button></div>';
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
      '<section class="block"><div class="block-head"><h1 class="page-title">Things I love</h1>' +
      '<span class="muted small">No need to feel like it first. “Just 2 min” skips the questions — you can always stop.</span></div>' +
      '<div class="chip-row" role="group" aria-label="Session length"><span class="muted small">How long?</span>' +
      TIMES.map((t) => '<button type="button" class="chip" data-h-minutes="' + t.m + '" aria-pressed="' + (S.minutes === t.m) + '">' + t.label + "</button>").join("") + "</div>" +
      '<h2 class="sub-h">Tiny things · 2–5 minutes</h2>' +
      '<div class="grid passions">' + passions().filter((p) => TINY.includes(p.id)).map(passionCard).join("") + "</div>" +
      '<h2 class="sub-h">Cozy things · when I have a little more time</h2>' +
      '<div class="grid passions">' + passions().filter((p) => !TINY.includes(p.id)).map(passionCard).join("") +
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
      '<button type="button" class="chip dashed" data-h-add-task>+ Add what I\'m avoiding</button></div></section>' +
      '<section class="block" id="people"><div class="block-head"><h2>My people · what I remember from them</h2>' +
      '<span class="muted small">Shown during every session, one at a time</span></div>' + peopleHtml() + "</section>";
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
      '<button type="button" class="btn-soft" data-h-two="' + esc(p.id) + '" title="Skip the questions and just begin">Just 2 min</button>' +
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
      '<button type="button" class="link-btn center" data-h-skip>Skip the questions and just begin</button>' +
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
      reasons: d.reasons, thought: d.thought.trim(), before: { feelings: d.feelings, mood: d.skipped ? null : d.mood },
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
    if (!a.after) a.after = { feelings: [], mood: a.before.mood != null ? a.before.mood : 6 };
    clearInterval(tick);
    if (!a.pausedAt) { a.pausedAt = Date.now(); save(); }
    const mins = Math.max(1, Math.round(elapsedMs(a) / 60000));
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">After · ' + esc(p.name) + " · " + fmtMin(mins) + "</span></div>" +
      '<h2 id="flowTitle" class="flow-h">You chose this over scrolling. How do you feel now?</h2>' +
      '<div class="flow-card light"><span class="eyebrow">Before, you ' + (a.thought ? "thought" : "felt") + "</span>" +
      (a.thought ? "<i>“" + esc(a.thought) + "”</i>" : "") +
      '<span class="muted small">' + esc((a.before.feelings || []).join(", ") || "—") + (a.before.mood != null ? " · mood " + a.before.mood + "/10" : " · you skipped the questions, that's fine") + "</span></div>" +
      chipGroup("after", FEEL_AFTER.concat(a.after.feelings.filter((f) => !FEEL_AFTER.includes(f))), a.after.feelings, "sage") +
      '<button type="button" class="link-btn" data-h-own-after>+ my own word</button>' +
      '<label class="vol">Mood <input type="range" id="hMoodAfter" min="1" max="10" value="' + a.after.mood + '"> <b id="hMoodAfterVal">' + a.after.mood + '/10</b> <span class="lift" id="hLift"></span></label>' +
      '<label class="field">One line about it<textarea id="hNote" rows="2" placeholder="What happened? What did you notice?">' + esc(a.note || "") + "</textarea></label>" +
      (a.parked.length ? '<div class="flow-card light"><span class="eyebrow">You parked</span><ul class="parked">' + a.parked.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul></div>" : "") +
      '<div class="flow-btns"><button type="button" class="btn-ghost-dark" data-h-back-doing>Keep going</button>' +
      '<button type="button" class="btn-primary" data-h-save>Save to my journal</button></div>';
    const showLift = () => {
      if (a.before.mood == null) { $("#hLift").textContent = ""; return; }
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

  /* ---------- Quick starts: "Just 2 min", meditation without questions ---------- */
  function quickStart(pid, minutes, med) {
    if (S.active) { openFlow(); renderDoing(); return; }
    const p = passionById(pid);
    if (!p) return;
    S.active = {
      id: uid(), passion: pid, start: Date.now(), planned: minutes, pausedMs: 0, pausedAt: null,
      reasons: [], thought: "", before: { feelings: [], mood: null }, prompt: promptFor(p), parked: [], notes: "",
    };
    if (med) {
      S.active.med = { interval: med.interval, sound: med.sound, bells: 0, endRung: false };
      ringBell(med.sound, 1);
    }
    save();
    openFlow();
    renderDoing();
  }

  /* ---------- "I just did something": log a random moment, no timer ---------- */
  let momentDraft = null;
  function openMoment() {
    momentDraft = { text: "", feelings: [], minutes: 0 };
    openFlow();
    renderMoment();
  }
  function renderMoment() {
    const m = momentDraft;
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">A little moment</span>' +
      '<button type="button" class="icon-btn" data-h-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="moment-face">' + mascot(90, "awake") + "</div>" +
      '<h2 id="flowTitle" class="flow-h">What did you do? Anything counts.</h2>' +
      '<label class="field"><span class="sr-only">What I did</span><textarea id="mText" rows="2" placeholder="e.g. watered the basil, danced to one song, looked at clouds">' + esc(m.text) + "</textarea></label>" +
      '<div class="field"><span>About how long?</span><div class="chip-row">' +
      [[0, "A moment"], [5, "5 min"], [15, "15 min"], [30, "30 min"], [60, "An hour+"]].map(([v, l]) =>
        '<button type="button" class="chip" data-h-m-min="' + v + '" aria-pressed="' + (m.minutes === v) + '">' + l + "</button>").join("") + "</div></div>" +
      '<div class="field"><span>How do I feel?</span>' + chipGroup("mfeel", FEEL_AFTER, m.feelings, "sage") + "</div>" +
      '<button type="button" class="btn-primary" data-h-m-save>Keep it in my journal</button>';
    $("#mText").addEventListener("input", function () { m.text = this.value; });
    $("#mText").focus();
  }
  function saveMoment() {
    const m = momentDraft;
    const text = (m.text || "").trim();
    if (!text) { toast("Write a few words about what you did"); $("#mText").focus(); return; }
    S.sessions.push({ id: uid(), passion: "moment", passionName: text.slice(0, 60), moment: true, start: Date.now(), minutes: m.minutes,
      reasons: [], thought: "", before: { feelings: [], mood: null }, after: { feelings: m.feelings, mood: null }, note: text.length > 60 ? text : "", parked: [] });
    momentDraft = null;
    save();
    closeFlow();
    toast("Kept. That was you, spending time with you.");
  }

  /* ---------- Meditate tab ---------- */
  function renderMeditate() {
    const el = $("#tab-meditate");
    const m = { minutes: S.medMinutes || 10, interval: S.medInterval != null ? S.medInterval : 5, sound: S.medSound || "bowl" };
    const done = S.sessions.filter((x) => x.passion === "meditation");
    const total = done.reduce((n, x) => n + (x.minutes || 0), 0);
    el.innerHTML =
      '<section class="block med-page"><div class="med-head">' + mascot(96, "sleepy") +
      '<div><h1 class="page-title">Meditate</h1><span class="muted">Sit, breathe, let the bowl keep time for you.</span></div></div>' +
      '<div class="med-set big"><span class="eyebrow">How long</span><div class="chip-row">' +
      MED_TIMES.map((x) => '<button type="button" class="chip" data-h-mp-min="' + x + '" aria-pressed="' + (m.minutes === x) + '">' + x + " min</button>").join("") + "</div>" +
      '<span class="eyebrow">Bells in between</span><div class="chip-row">' +
      MED_INTERVALS.map((x) => '<button type="button" class="chip" data-h-mp-int="' + x.m + '" aria-pressed="' + (m.interval === x.m) + '">' + x.label + "</button>").join("") + "</div>" +
      '<span class="eyebrow">Sound</span><div class="chip-row">' +
      MED_SOUNDS.map((x) => '<button type="button" class="chip sage" data-h-mp-sound="' + x.id + '" aria-pressed="' + (m.sound === x.id) + '">' + x.label + "</button>").join("") +
      '<button type="button" class="link-btn" data-h-mp-test>Listen</button></div>' +
      '<span class="muted small">One bell to begin' + (m.interval ? ", one every " + m.interval + " min" : "") + ", three to end. Keep the screen on so the bells can ring.</span></div>" +
      '<button type="button" class="btn-primary big-begin" data-h-mp-begin>Begin ' + m.minutes + " minutes</button>" +
      '<p class="muted small soft-count">' + (done.length ? done.length + (done.length === 1 ? " sit" : " sits") + " · " + fmtMin(total) + " in stillness so far" : "Your first sit will be remembered here.") + "</p>" +
      "</section>";
  }

  /* ---------- Yoga counter (in Move) ---------- */
  function countYoga(video, title) {
    S.yoga = S.yoga || [];
    const today = dayKey(Date.now());
    if (video && S.yoga.some((y) => y.video === video && dayKey(y.t) === today)) return false;
    S.yoga.push({ id: uid(), t: Date.now(), video: video || "", title: title || "" });
    save();
    renderYoga();
    return true;
  }
  function renderYoga() {
    const el = $("#yogaCounter");
    if (!el) return;
    const all = S.yoga || [];
    const week = all.filter((y) => y.t >= rangeStart("week")).length;
    const month = all.filter((y) => y.t >= rangeStart("month")).length;
    const dots = Array.from({ length: 7 }, (_, i) => {
      const d0 = rangeStart("week") + i * 864e5;
      const on = all.some((y) => y.t >= d0 && y.t < d0 + 864e5);
      return '<span class="ydot' + (on ? " on" : "") + '" title="' + new Date(d0).toLocaleDateString(undefined, { weekday: "long" }) + '"></span>';
    }).join("");
    el.innerHTML =
      '<div class="yoga-card"><div class="yoga-left">' + mascot(64, "awake") +
      '<div><span class="eyebrow">Yoga counter</span><b class="yoga-big">' + all.length + (all.length === 1 ? " practice" : " practices") + "</b>" +
      '<span class="muted small">' + week + " this week · " + month + " this month</span>" +
      '<div class="ydots" aria-label="Days with yoga this week">' + dots + "</div></div></div>" +
      '<div class="yoga-btns"><button type="button" class="btn-dark" data-h-yoga-plus>+1 I did yoga</button>' +
      (all.length ? '<button type="button" class="link-btn" data-h-yoga-undo>Undo last</button>' : "") + "</div>" +
      '<span class="muted small yoga-note">Yoga classes you play here count by themselves (once per class per day).</span></div>';
  }
  document.addEventListener("calm:play", function (e) {
    const d = e.detail || {};
    if (d.section === "yoga" && countYoga(d.id, d.title)) {
      const n = (S.yoga || []).length;
      toast("Counted in your yoga counter · " + n + (n === 1 ? " practice" : " practices"));
    }
  });

  /* ---------- Compost: ideas rest here and the heap grows every 5 ---------- */
  const PX = { s1: "#6B3A2E", s2: "#8A4E3A", s3: "#A9674C", g1: "#4E8F4E", g2: "#86C276", p1: "#E0458A", p2: "#F7A9C8", p3: "#FCE1EC",
    d: "#8A2A45", f: "#F7C9AA", e: "#5A2638", w: "#E8A0A0", b: "#6F95E6", y: "#F2C94C", l: "#B9C7E8" };
  function compostStage() { return Math.floor((S.compostAdded || 0) / 5); }
  function pixelHeap(stage, scraps) {
    const px = [];
    const put = (x, y, c) => px.push([x, y, c]);
    // soil mound (always)
    for (let x = 2; x <= 21; x++) put(x, 19, "s1");
    for (let x = 3; x <= 20; x++) put(x, 18, (x * 7) % 5 ? "s2" : "s1");
    for (let x = 5; x <= 18; x++) put(x, 17, (x * 3) % 4 ? "s2" : "s3");
    for (let x = 8; x <= 15; x++) put(x, 16, x % 3 ? "s3" : "s2");
    // scraps: one bit of peel/leaf per idea since the last growth
    const spots = [[6, 17, "y"], [16, 17, "g2"], [10, 16, "p2"], [13, 16, "w"], [4, 18, "l"]];
    for (let i = 0; i < Math.min(scraps, 5); i++) put(spots[i][0], spots[i][1], spots[i][2]);
    const st = Math.min(stage, 6);
    if (stage >= 1) { put(18, 18, "w"); put(19, 18, "w"); put(20, 17, "w"); } // a little worm moved in
    const plant = [];
    const pp = (x, y, c) => plant.push([x, y, c]);
    if (st >= 2) { for (let y = 13; y <= 15; y++) pp(11, y, "g1"); pp(10, 13, "g2"); pp(12, 13, "g2"); }
    if (st >= 3) { for (let y = 10; y <= 12; y++) pp(11, y, "g1"); pp(9, 12, "g2"); pp(10, 12, "g2"); pp(12, 11, "g2"); pp(13, 11, "g2"); pp(13, 12, "g1"); }
    if (st === 4) { pp(10, 8, "p2"); pp(11, 8, "p1"); pp(12, 8, "p2"); pp(11, 7, "p1"); pp(10, 9, "g2"); pp(12, 9, "g2"); pp(11, 9, "g1"); }
    if (st >= 5) {
      pp(11, 9, "g1");
      const petals = [[11, 2], [10, 3], [11, 3], [12, 3], [7, 5], [8, 5], [8, 6], [14, 5], [15, 5], [14, 6], [8, 8], [9, 8], [13, 8], [14, 8],
        [9, 4], [13, 4], [7, 6], [15, 6], [9, 9], [13, 9], [10, 9], [12, 9]];
      petals.forEach(([x, y]) => pp(x, y, (x + y) % 3 ? "p1" : "p2"));
      for (let x = 9; x <= 13; x++) for (let y = 4; y <= 8; y++) pp(x, y, st >= 6 ? "f" : ((x + y) % 2 ? "p2" : "p3"));
      if (st >= 6) { pp(10, 6, "e"); pp(12, 6, "e"); pp(11, 7, "d"); pp(9, 7, "p2"); pp(13, 7, "p2"); }
      else { pp(11, 6, "y"); pp(10, 6, "d"); pp(12, 5, "d"); }
      [[8, 4], [14, 4], [7, 7], [15, 7]].forEach(([x, y]) => pp(x, y, "d"));
    }
    // a small garden grows beside it after that
    const extra = Math.max(0, Math.min(stage - 6, 4));
    const garden = [[3, 14], [19, 14], [5, 12], [17, 12]];
    for (let i = 0; i < extra; i++) {
      const [gx, gy] = garden[i];
      for (let y = gy + 1; y <= 16; y++) put(gx, y, "g1");
      put(gx - 1, gy, "p2"); put(gx + 1, gy, "p2"); put(gx, gy - 1, "p2"); put(gx, gy, "y");
    }
    const rect = ([x, y, c]) => '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + PX[c] + '"/>';
    return '<svg class="heap" viewBox="0 0 24 21" shape-rendering="crispEdges" role="img" aria-label="My compost heap, stage ' + stage + '">' +
      '<g class="heap-soil">' + px.map(rect).join("") + "</g>" +
      '<g class="heap-plant">' + plant.map(rect).join("") + "</g></svg>";
  }
  const STAGE_NAMES = ["Fresh soil", "A worm moved in", "A sprout!", "Leaves", "A bud", "A lily", "A lily that's awake", "A little garden"];
  function renderCompost() {
    const el = $("#tab-compost");
    const added = S.compostAdded || 0;
    const stage = compostStage();
    const toNext = 5 - (added % 5);
    const resting = (S.compost || []).filter((c) => !c.done).slice().reverse();
    const grew = (S.compost || []).filter((c) => c.done).slice().reverse();
    el.innerHTML =
      '<section class="block compost-page"><div class="block-head"><div><h1 class="page-title">Compost</h1>' +
      '<span class="muted">Ideas I have but don\'t do yet. They rest here and feed the soil — nothing is wasted.</span></div></div>' +
      '<div class="heap-wrap"><div class="heap-box">' + pixelHeap(stage, added % 5) + "</div>" +
      '<div class="heap-info"><b class="heap-stage">' + esc(STAGE_NAMES[Math.min(stage, 7)]) + "</b>" +
      '<span class="muted">' + (toNext === 5 && added ? "It just grew! " : "") + toNext + (toNext === 1 ? " more idea" : " more ideas") + " until it grows again</span>" +
      '<div class="heap-bar" aria-hidden="true">' + Array.from({ length: 5 }, (_, i) => '<span class="' + (i < added % 5 ? "on" : "") + '"></span>').join("") + "</div></div></div>" +
      '<form class="compost-add" data-h-compost-form><label class="sr-only" for="compostText">An idea for later</label>' +
      '<input id="compostText" placeholder="An idea for something I could do…" maxlength="140" autocomplete="off"><button type="submit" class="btn-dark">Add to compost</button></form>' +
      (resting.length ? '<h2 class="sub-h">Resting in the compost</h2><div class="compost-list">' + resting.map((c) =>
        '<div class="compost-item"><span class="c-dot" aria-hidden="true"></span><div><b>' + esc(c.text) + '</b><span class="muted small">' +
        new Date(c.t).toLocaleDateString(undefined, { day: "numeric", month: "short" }) + "</span></div>" +
        '<button type="button" class="btn-soft" data-h-idea-try="' + esc(c.id) + '">Try it now</button>' +
        '<button type="button" class="btn-soft" data-h-idea-done="' + esc(c.id) + '">I did it</button>' +
        '<button type="button" class="icon-btn small" data-h-idea-del="' + esc(c.id) + '" aria-label="Remove idea"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>').join("") + "</div>"
        : '<p class="empty">Nothing resting yet. When an idea pops up and you can\'t do it now, drop it here.</p>') +
      (grew.length ? '<h2 class="sub-h">Grew into something</h2><div class="compost-list grew">' + grew.slice(0, 20).map((c) =>
        '<div class="compost-item"><span class="c-dot on" aria-hidden="true"></span><div><b>' + esc(c.text) + '</b><span class="muted small">did it ' +
        new Date(c.done).toLocaleDateString(undefined, { day: "numeric", month: "short" }) + "</span></div></div>").join("") + "</div>" : "") +
      "</section>";
  }

  /* ---------- Sounds tab extras: calm noise + Spotify ---------- */
  function parseSpotify(url) {
    const s2 = (url || "").trim();
    let m = s2.match(/open\.spotify\.com\/(?:intl-[a-z]{2}(?:-[A-Za-z]{2})?\/)?(?:embed\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]{10,40})/);
    if (!m) m = s2.match(/^spotify:(playlist|album|track|artist|episode|show):([A-Za-z0-9]{10,40})$/);
    return m ? { type: m[1], sid: m[2] } : null;
  }
  function renderSoundsExtras() {
    const el = $("#spotifyBox");
    if (!el) return;
    const list = S.spotify || [];
    el.innerHTML =
      '<section class="block"><div class="block-head"><h2>Calm noise</h2><span class="muted small">a soft breeze made inside the app — works offline</span></div>' +
      '<div class="noise-row"><button type="button" class="btn-soft" data-h-noise aria-pressed="' + !!(S.noise && S.noise.on) + '">' + (S.noise && S.noise.on ? "On" : "Off") + "</button>" +
      '<label class="vol">Volume <input type="range" id="noiseVol" min="0" max="60" value="' + Math.round(((S.noise && S.noise.vol) || 0.18) * 100) + '"></label></div>' +
      '<p class="muted small">It pauses by itself while other music plays, and comes back after.</p></section>' +
      '<section class="block"><div class="block-head"><h2>Spotify</h2><span class="muted small">paste a playlist, album or song link from the Spotify app (Share → Copy link)</span></div>' +
      '<form class="compost-add" data-h-spotify-form><label class="sr-only" for="spotifyUrl">Spotify link</label>' +
      '<input id="spotifyUrl" placeholder="https://open.spotify.com/playlist/…" autocomplete="off"><button type="submit" class="btn-dark">Add</button></form>' +
      (list.length ? '<div class="spotify-list">' + list.map((x) =>
        '<div class="spotify-item"><iframe title="Spotify ' + esc(x.type) + '" src="https://open.spotify.com/embed/' + esc(x.type) + "/" + esc(x.sid) +
        '?utm_source=generator" width="100%" height="' + (x.type === "track" || x.type === "episode" ? 152 : 352) + '" frameborder="0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>' +
        '<button type="button" class="link-btn" data-h-spotify-del="' + esc(x.id) + '">Remove</button></div>').join("") + "</div>"
        : '<p class="empty">No Spotify links yet. Log in to Spotify in this browser to hear full songs instead of 30-second previews.</p>') +
      "</section>";
    const v = $("#noiseVol");
    if (v) v.addEventListener("input", function () { S.noise = S.noise || {}; S.noise.vol = Number(this.value) / 100; save(); noiseLevel(); });
  }

  /* ---------- Calm noise: soft brown noise with a slow "breeze" ---------- */
  let noise = null;
  function startNoise() {
    const ac = audio();
    if (!ac || noise) { noiseLevel(); return; }
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
      // smooth the loop seam
      for (let i = 0; i < 2000; i++) { const k = i / 2000; d[i] = d[i] * k + d[len - 2000 + i] * (1 - k); }
    }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.Q.value = 0.4;
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.06;
    const lfoGain = ac.createGain(); lfoGain.gain.value = 180;
    lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
    const g = ac.createGain(); g.gain.value = 0;
    src.connect(lp); lp.connect(g); g.connect(ac.destination);
    src.start(); lfo.start();
    noise = { g, ac };
    noiseLevel();
  }
  function noiseLevel() {
    if (!noise) return;
    const otherPlaying = window.CalmPlayer && window.CalmPlayer.currentSound && window.CalmPlayer.currentSound();
    const target = S.noise && S.noise.on && !otherPlaying ? (S.noise.vol || 0.18) : 0;
    noise.g.gain.setTargetAtTime(target, noise.ac.currentTime, 0.8);
  }
  setInterval(noiseLevel, 2000);

  /* ---------- Welcome: a sentence to enter the playground ---------- */
  function showSplash() {
    const sp = $("#splash");
    if (!sp) return;
    const q = QUOTES[0];
    sp.innerHTML = '<div class="splash-inner">' + mascot(150, "sleepy") +
      '<p class="splash-q">“' + esc(q.q) + "”</p><p class=\"splash-by\">— " + esc(q.by) + "</p>" +
      '<p class="splash-sub">Play in this world like a child. That\'s the whole game.</p>' +
      '<button type="button" class="btn-primary soft" id="splashGo">Enter the playground</button>' +
      '<button type="button" class="link-btn" id="splashQuiet">Enter quietly (no calm noise)</button></div>';
    sp.hidden = false;
    document.body.classList.add("splash-open");
    const go = (quiet) => {
      sp.classList.add("leaving");
      document.body.classList.remove("splash-open");
      setTimeout(() => { sp.hidden = true; sp.classList.remove("leaving"); }, 450);
      if (quiet) { S.noise = S.noise || {}; S.noise.on = false; save(); }
      if (S.noise && S.noise.on) startNoise();
    };
    $("#splashGo").addEventListener("click", () => go(false));
    $("#splashQuiet").addEventListener("click", () => go(true));
    $("#splashGo").focus();
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
    if (d.hMoment !== undefined) { openMoment(); return; }
    if (d.hQuote !== undefined) { quoteIx++; renderToday(); return; }
    if (d.hOnething !== undefined) { renderOneThing(false); return; }
    if (d.hOneNext !== undefined) { renderOneThing(true); return; }
    if (d.hMMin !== undefined) { momentDraft.minutes = Number(d.hMMin); renderMoment(); return; }
    if (d.hPickMfeel) { toggle(momentDraft.feelings, d.hPickMfeel); renderMoment(); return; }
    if (d.hMSave !== undefined) { saveMoment(); return; }
    if (d.hTwo) { quickStart(d.hTwo, 2); return; }
    if (d.hSkip !== undefined) {
      if (!draft.passion) { toast("Pick what you'd like to do first"); $("#hPassion").focus(); return; }
      draft.skipped = true; draft.reasons = []; draft.feelings = []; begin(); return;
    }
    if (d.hGentle !== undefined) {
      S.gentle = !S.gentle; save(); document.body.classList.toggle("gentle", S.gentle);
      b.textContent = S.gentle ? "Show numbers again" : "Gentle mode: hide numbers";
      toast(S.gentle ? "Numbers hidden" : "Numbers back"); return;
    }
    if (d.hMpMin) { S.medMinutes = Number(d.hMpMin); save(); renderMeditate(); return; }
    if (d.hMpInt !== undefined) { S.medInterval = Number(d.hMpInt); save(); renderMeditate(); return; }
    if (d.hMpSound) { S.medSound = d.hMpSound; save(); ringBell(d.hMpSound, 1); renderMeditate(); return; }
    if (d.hMpTest !== undefined) { ringBell(S.medSound || "bowl", 1); return; }
    if (d.hMpBegin !== undefined) {
      quickStart("meditation", S.medMinutes || 10, { interval: S.medInterval != null ? S.medInterval : 5, sound: S.medSound || "bowl" });
      return;
    }
    if (d.hYogaPlus !== undefined) { countYoga("", ""); toast("Yoga counted. Lovely."); return; }
    if (d.hYogaUndo !== undefined) { const y = (S.yoga || []).pop(); if (y) forget(y.id); save(); renderYoga(); return; }
    if (d.hIdeaTry) { startCheckIn("idea:" + d.hIdeaTry); return; }
    if (d.hIdeaDone) { const c = S.compost.find((x) => x.id === d.hIdeaDone); if (c) { c.done = Date.now(); save(); renderCompost(); toast("It grew into something real"); } return; }
    if (d.hIdeaDel) { if (confirm("Remove this idea? It stays in the soil — the heap won't shrink.")) { S.compost = S.compost.filter((x) => x.id !== d.hIdeaDel); forget(d.hIdeaDel); save(); renderCompost(); } return; }
    if (d.hNoise !== undefined) { S.noise = S.noise || {}; S.noise.on = !S.noise.on; save(); if (S.noise.on) startNoise(); noiseLevel(); renderSoundsExtras(); updateNoiseBtn(); return; }
    if (d.hSpotifyDel) { S.spotify = (S.spotify || []).filter((x) => x.id !== d.hSpotifyDel); forget(d.hSpotifyDel); save(); renderSoundsExtras(); return; }
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
      save(); renderPassions(); return;
    }
    if (d.hDelPerson) {
      const p = S.people.find((x) => x.id === d.hDelPerson);
      if (p && confirm("Remove " + p.name + " from My people?")) { S.people = S.people.filter((x) => x !== p); forget(p.id); save(); renderPassions(); }
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
    if (f.dataset.hCompostForm !== undefined) {
      e.preventDefault();
      const v = $("#compostText").value.trim();
      if (!v) return;
      const before = compostStage();
      S.compost = (S.compost || []).concat({ id: uid(), text: v.slice(0, 140), t: Date.now() });
      S.compostAdded = (S.compostAdded || 0) + 1;
      save();
      renderCompost();
      if (compostStage() > before) { toast("Your compost grew: " + STAGE_NAMES[Math.min(compostStage(), 7)].toLowerCase()); $(".heap-box").classList.add("grew"); }
      else toast("Resting in the compost");
      $("#compostText").focus();
      return;
    }
    if (f.dataset.hSpotifyForm !== undefined) {
      e.preventDefault();
      const r = parseSpotify($("#spotifyUrl").value);
      if (!r) { toast("That doesn't look like a Spotify link"); return; }
      if ((S.spotify || []).some((x) => x.sid === r.sid)) { toast("Already here"); return; }
      S.spotify = (S.spotify || []).concat({ id: uid(), type: r.type, sid: r.sid });
      save(); renderSoundsExtras(); toast("Added from Spotify");
      return;
    }
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

  function updateNoiseBtn() {
    const b = $("#noiseBtn");
    if (!b) return;
    const on = !!(S.noise && S.noise.on);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? "Calm noise is on — turn off" : "Calm noise is off — turn on");
    b.classList.toggle("on", on);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("#noiseBtn")) {
      S.noise = S.noise || {}; S.noise.on = !S.noise.on; save();
      if (S.noise.on) startNoise();
      noiseLevel(); updateNoiseBtn();
      toast(S.noise.on ? "Calm noise on" : "Calm noise off");
    }
  });

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  route();
  updateNoiseBtn();
  document.body.classList.toggle("gentle", !!S.gentle);
  const gb = $("#gentleBtn");
  if (gb) gb.textContent = S.gentle ? "Show numbers again" : "Gentle mode: hide numbers";
  showSplash();
  if (S.active) {
    const a = S.active;
    const p = passionById(a.passion);
    toast("Your " + (p ? p.name.toLowerCase() : "session") + " session is still running — tap “Back to my …” on Today");
  }
})();
