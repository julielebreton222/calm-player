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
      "Draw your teacup slowly growing roots and leaves.",
      { t: "Look up Remedios Varo's “Creation of the Birds” and copy one small corner of it in pencil.", look: "Remedios Varo Creation of the Birds" },
      "Draw a staircase that leads into a cloud. Who lives at the top?",
      { t: "Look up Leonora Carrington's “Self-Portrait (The Inn of the Dawn Horse)” and borrow its hyena, horse or chair for a drawing of your own.", look: "Leonora Carrington Self-Portrait Inn of the Dawn Horse" },
      "Draw your hand as a tiny house — windows, a door, a chimney.",
      { t: "Look up Remedios Varo's “Embroidering the Earth's Mantle”. Copy the tower, then draw your own room inside it.", look: "Remedios Varo Embroidering the Earth's Mantle" },
      "Draw an animal wearing your clothes, sitting at your table.",
      { t: "Look up Leonora Carrington's “The Giantess” and draw your own giantess holding something small and precious.", look: "Leonora Carrington The Giantess" },
      "Draw the moon, come indoors to rest on your bed.",
      "Draw a creature that is half plant, half you.",
      { t: "Look up a Remedios Varo painting you haven't seen. Copy one figure, then give it a new job.", look: "Remedios Varo paintings" },
      "Draw a door in the middle of a field. What's leaking out from under it?",
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
    if (id && id.startsWith("breath:")) { const x = pranaById(id.slice(7)); return x ? { id, name: x.name, color: "#B9C7E8", breath: true, prompts: [] } : null; }
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
  function promptItem(p) {
    const list = p.prompts && p.prompts.length ? p.prompts : ["Do it for 15 minutes, just for the joy of it."];
    return list[(S.promptIndex[p.id] || 0) % list.length];
  }
  function promptFor(p) { const x = promptItem(p); return typeof x === "string" ? x : x.t; }
  function lookFor(p) { const x = promptItem(p); return typeof x === "string" ? "" : (x.look || ""); }
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

  const TABS = ["today", "breathe", "passions", "meditate", "spells", "move", "sounds", "keep"];
  const NAV_OF = { meditate: "passions", spells: "passions" };
  function showTab(id, scrollTarget) {
    if (id === "compost" || id === "journal") { S.keepView = id; id = "keep"; }
    if (!TABS.includes(id)) id = "today";
    TABS.forEach((t) => { const el = $("#tab-" + t); if (el) el.hidden = t !== id; });
    $$("#tabs a").forEach((a) => {
      const on = a.dataset.tab === (NAV_OF[id] || id);
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    renderTab(id);
    if (scrollTarget) scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0 });
  }
  function route() {
    if (!$("#flow").hidden) { stopBreathEngine(); $("#flow").hidden = true; document.body.classList.remove("flow-open"); clearInterval(tick); tick = null; }
    const h = decodeURIComponent(location.hash || "");
    if (h.startsWith("#/")) { showTab(h.slice(2) === "playground" ? "today" : h.slice(2)); return; }
    if (h.length > 1) {
      const el = document.getElementById(h.slice(1));
      const tab = el && el.closest(".tab");
      if (tab) {
        const t = tab.id.replace("tab-", "");
        if (t === "move" && MOVE_SECTIONS.includes(el.id)) S.moveView = el.id;
        if (t === "sounds" && LISTEN_SECTIONS.includes(el.id)) S.listenView = el.id;
        showTab(t, el);
        return;
      }
    }
    showTab("today");
  }
  function renderTab(id) {
    document.body.classList.toggle("gentle", !!S.gentle);
    if (id === "today") renderToday();
    if (id === "keep") renderKeep();
    if (id === "breathe") renderBreathe();
    if (id === "meditate") renderMeditate();
    if (id === "move") renderMoveTop();
    if (id === "sounds") renderSoundsExtras();
    if (id === "passions") renderPassions();
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
      '<p class="breath-words" aria-live="off"><span class="w1">breathe in</span><span class="w2">hold</span><span class="w3">breathe out</span><span class="w4">hold</span></p>' +
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
    inMix().forEach((c) => { pool.push(ideaAsPassion(c)); pool.push(ideaAsPassion(c)); }); // ideas from my compost come up a bit more often
    const uniq = pool.filter((p, i) => pool.findIndex((x) => x.id === p.id) === i);
    oneIx = next ? (oneIx + 1) % uniq.length : Math.floor(Math.random() * uniq.length);
    const p = uniq[oneIx];
    openFlow();
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">Just one thing</span>' +
      '<button type="button" class="icon-btn" data-h-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      (p.idea
        ? (() => { const c = S.compost.find((x) => "idea:" + x.id === p.id); const dd = restDays(c);
            return '<div class="moment-face">' + sprout(dd, "big") + "</div>" +
              '<p class="muted small center">From your compost · resting ' + (dd ? dd + (dd === 1 ? " day" : " days") : "since today") + " — it's " + SPROUT_WORDS[sproutStage(dd)] + " now</p>"; })()
        : '<div class="moment-face">' + mascot(110, "awake") + "</div>") +
      '<h2 id="flowTitle" class="flow-h center">How about… ' + esc(p.idea ? p.name : p.name.toLowerCase()) + "?</h2>" +
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

  const LONG = ["nature", "music", "curiosity", "fairytales", "drawing", "yoga-learning", "morning-pages", "song"];
  const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  const BACK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  function backRow(label, attr) {
    return '<button type="button" class="back-row" ' + attr + '>' + BACK + "<span>" + esc(label) + "</span></button>";
  }
  function playList(len) {
    const ps = passions().filter((p) => p.id !== "meditation");
    let list;
    if (len === "2") list = ps.filter((p) => TINY.includes(p.id));
    else if (len === "long") list = ps.filter((p) => LONG.includes(p.id) || p.custom);
    else list = ps.filter((p) => !TINY.includes(p.id));
    return list.concat(inMix().map(ideaAsPassion));
  }
  function renderPassions() {
    const el = $("#tab-passions");
    const view = S.playView || "list";
    if (view === "avoid") {
      el.innerHTML = '<section class="block calm-page">' + backRow("Play", "data-h-play-view=\"list\"") +
        '<h1 class="page-title">Things I avoid</h1><p class="muted">When scrolling is really avoiding, do 10 brave minutes of one of these.</p>' +
        '<div class="rows">' + tasks().map((t) => {
          const st = passionStats(t.id);
          return '<div class="row"><span class="row-dot" style="background:#D9BFC5"></span><span class="row-main"><b>' + esc(t.name) + "</b><span>" +
            (st.n ? fmtMin(st.mins) + " this week" : "not yet this week") + "</span></span>" +
            '<button type="button" class="btn-soft" data-h-start="' + esc(t.id) + '">10 min</button>' +
            '<button type="button" class="icon-btn small" data-h-del-task="' + esc(t.id) + '" aria-label="Remove ' + esc(t.name) + '"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
        }).join("") + "</div>" +
        '<button type="button" class="wide-btn" data-h-add-task>+ Add what I\'m avoiding</button></section>';
      return;
    }
    if (view === "edit") {
      el.innerHTML = '<section class="block">' + backRow("Play", "data-h-play-view=\"list\"") +
        '<h1 class="page-title">My list</h1><p class="muted">Every activity, with its tiny prompts. Add your own, or remove ones you added.</p>' +
        '<div class="grid passions">' + passions().map(passionCard).join("") +
        '<button type="button" class="passion add" data-h-add-passion>+ Add a passion</button></div></section>' +
        '<section class="block" id="people"><div class="block-head"><h2>My people · what I remember from them</h2>' +
        '<span class="muted small">Shown during every session, one at a time</span></div>' + peopleHtml() + "</section>";
      return;
    }
    const len = S.playLen || "2";
    const lens = [["2", "2 min"], ["15", "15 min"], ["long", "Longer"]];
    el.innerHTML = '<section class="block calm-page"><h1 class="page-title">Play</h1>' +
      '<div class="seg" role="group" aria-label="How much time do I have">' + lens.map(([k, l]) =>
        '<button type="button" class="seg-btn' + (len === k ? " active" : "") + '" data-h-len="' + k + '" aria-pressed="' + (len === k) + '">' + l + "</button>").join("") + "</div>" +
      '<div class="rows">' + playList(len).map((p) =>
        '<button type="button" class="row row-btn" data-h-play-row="' + esc(p.id) + '">' +
        '<span class="row-dot" style="background:' + (p.idea ? "#9CC28E" : p.dark ? "#B83A72" : p.color) + '"></span>' +
        '<span class="row-main"><b>' + esc(p.name) + "</b><span>" + esc(p.idea ? "From your compost" : promptFor(p)) + "</span></span>" + CHEV + "</button>").join("") + "</div>" +
      '<div class="pill-grid">' +
      '<a class="pill-link" href="#/meditate">Meditate</a>' +
      '<a class="pill-link" href="#/spells">Spell book</a>' +
      '<button type="button" class="pill-link" data-h-play-view="avoid">Things I avoid</button>' +
      '<button type="button" class="pill-link" data-h-play-view="edit">Edit my list</button>' +
      "</div></section>";
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
      prompt: promptFor(passionById(d.passion)), look: lookFor(passionById(d.passion)), parked: [], notes: "",
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
      (a.look ? '<a class="look-link" href="https://www.google.com/search?tbm=isch&amp;q=' + encodeURIComponent(a.look) + '" target="_blank" rel="noopener">Look it up</a>' : "") +
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
    if (a.passion && a.passion.startsWith("idea:")) {
      const c = (S.compost || []).find((x) => "idea:" + x.id === a.passion);
      if (c && !c.done) c.done = Date.now();
    }
    S.active = null;
    save();
    closeFlow();
    const l = S.sessions[S.sessions.length - 1];
    toast("Saved · " + fmtMin(mins) + (lift(l) != null ? " · mood " + signed(lift(l)) : ""));
  }

  /* ================================================================== */
  /* Breathe — pranayamas, suggested from how I feel / what I want       */
  /* Written in my own words from the classic Hatha texts (Hatha Yoga     */
  /* Pradipika, Gheranda Samhita) and modern teachers (B. K. S. Iyengar's */
  /* Light on Pranayama). Traditional claims are labelled as tradition.   */
  /* ================================================================== */

  const BREATH_FEELINGS = [
    { id: "anxious", label: "Anxious" }, { id: "overwhelmed", label: "Overwhelmed" }, { id: "restless", label: "Restless" },
    { id: "hot", label: "Angry or hot" }, { id: "sleep", label: "Can't sleep" }, { id: "tired", label: "Tired, sluggish" },
    { id: "foggy", label: "Foggy" }, { id: "scattered", label: "Scattered" }, { id: "low", label: "Low" }, { id: "shallow", label: "Breathing shallow" },
  ];
  const BREATH_WANTS = [
    { id: "calm", label: "Calm" }, { id: "energy", label: "Energy" }, { id: "focus", label: "Focus" },
    { id: "cool", label: "Cool down" }, { id: "rest", label: "Rest / sleep" }, { id: "ground", label: "Feel grounded" },
  ];
  const ENERGISING_CAUTION = "Skip this one if you're pregnant, or have high blood pressure, a heart condition, epilepsy, glaucoma, a hernia, recent surgery, or panic attacks. Not on a full stomach or right before sleep. Stop if you feel dizzy.";
  const HOLD_CAUTION = "The holds are gentle and optional — just breathe through them if you're pregnant, have high blood pressure, or they make you uneasy.";

  // step: { k: "in"|"hold"|"out"|"pump"|"rest", s: seconds, say: cue }
  const PRANAYAMAS = [
    { id: "nadi", name: "Nadi Shodhana", en: "Alternate nostril breathing", group: "Calm", good: ["anxious", "overwhelmed", "restless", "scattered", "calm", "focus", "rest", "ground"],
      rounds: 9, steps: [{ k: "in", s: 4, say: "In through the left" }, { k: "out", s: 6, say: "Out through the right" }, { k: "in", s: 4, say: "In through the right" }, { k: "out", s: 6, say: "Out through the left" }],
      how: ["Sit tall. Rest your right thumb by the right nostril and your ring finger by the left.", "Close the right side, breathe in through the left.", "Close the left, breathe out through the right — then in through the right.", "Switch, and breathe out through the left. That's one round."],
      what: "A slow, even, side-to-side breath that most people find settling within a few rounds. Tradition says it balances the body's two main energy channels (ida and pingala). Small studies suggest slow alternate-nostril breathing can lower heart rate and feelings of anxiety — the long, unhurried exhale is likely doing a lot of the work.",
      source: "Described in the Hatha Yoga Pradipika (15th century, chapter 2) as the practice that purifies the energy channels — “nadi shodhana” means “cleaning the channels” — and taught as preparation for every other pranayama.",
      caution: "If one side is blocked, just imagine the breath moving through it. Never strain." },
    { id: "bhramari", name: "Bhramari", en: "Bee breath", group: "Calm", good: ["anxious", "overwhelmed", "restless", "hot", "sleep", "calm", "rest"],
      rounds: 7, steps: [{ k: "in", s: 4, say: "Breathe in through the nose" }, { k: "out", s: 8, say: "Hum out like a bee — mmmm" }],
      how: ["Sit comfortably, lips closed, jaw soft.", "Optionally rest your thumbs gently on the little flaps in front of your ears and your fingers over your closed eyes.", "Breathe in through the nose.", "Breathe out slowly making a low, steady humming sound. Feel it buzz in your face and head."],
      what: "The hum makes the exhale long and slow, which is one of the most reliable ways to calm the nervous system. Humming also greatly increases nitric oxide in the nose (shown in research by Weitzberg and Lundberg). Many people use it to quiet a busy mind or to wind down at night.",
      source: "One of the eight classical breath practices (kumbhakas) in the Hatha Yoga Pradipika, which compares the in-breath to a male bee and the out-breath to a female bee; also taught in the Gheranda Samhita.",
      caution: "Keep the sound soft. Don't press hard on your ears or eyes. Fine for almost everyone." },
    { id: "chandra", name: "Chandra Bhedana", en: "Left-nostril, moon breath", group: "Cooling", good: ["hot", "overwhelmed", "sleep", "restless", "cool", "calm", "rest"],
      rounds: 12, steps: [{ k: "in", s: 4, say: "In through the left nostril" }, { k: "out", s: 6, say: "Out through the right" }],
      how: ["Close the right nostril with your thumb.", "Breathe in slowly through the left.", "Close the left with your ring finger, open the right, and breathe out through the right.", "Every in-breath is through the left."],
      what: "Tradition links the left nostril with the cooling, “lunar” channel (ida), so this is used to cool down, soften emotional heat and prepare for rest. Small studies suggest left-nostril breathing may slightly lower heart rate and blood pressure, though the evidence is limited.",
      source: "The counterpart of Surya Bhedana (which the Hatha Yoga Pradipika describes); taught in modern Hatha yoga, including B. K. S. Iyengar's Light on Pranayama.",
      caution: "Avoid if you feel cold, very low, or heavy already. Keep it gentle." },
    { id: "surya", name: "Surya Bhedana", en: "Right-nostril, sun breath", group: "Energy", good: ["tired", "foggy", "low", "energy", "focus"],
      rounds: 12, steps: [{ k: "in", s: 4, say: "In through the right nostril" }, { k: "out", s: 6, say: "Out through the left" }],
      how: ["Close the left nostril with your ring finger.", "Breathe in slowly through the right.", "Close the right with your thumb and breathe out through the left.", "Every in-breath is through the right."],
      what: "Tradition links the right nostril with the warming, “solar” channel (pingala), so this is used to wake up, lift heaviness and kindle digestion. It's a gentle way to feel more alert without fast breathing.",
      source: "The first of the eight kumbhakas in the Hatha Yoga Pradipika (chapter 2) and also described in the Gheranda Samhita.",
      caution: "Skip if you have high blood pressure or a heart condition, or in the evening if you want to sleep." },
    { id: "bhastrika", name: "Bhastrika", en: "Bellows breath", group: "Energy", good: ["tired", "foggy", "low", "energy"],
      rounds: 3, pump: { n: 15, s: 1.2, rest: 30 },
      how: ["Sit tall with a straight back.", "Breathe in and out through the nose, both strongly and evenly, like a bellows — about one breath a second.", "After 15 breaths, stop and breathe normally for half a minute.", "Repeat for three rounds. Go slower if it feels like too much."],
      what: "Fast, full, forceful breaths in and out create warmth and a strong wake-up feeling. It is stimulating — heart rate and alertness go up — so it's for sluggish moments, not anxious ones.",
      source: "One of the eight kumbhakas in the Hatha Yoga Pradipika, which describes the breath moving “like a blacksmith's bellows”; also in the Gheranda Samhita.",
      caution: ENERGISING_CAUTION },
    { id: "kapalabhati", name: "Kapalabhati", en: "Skull-shining breath", group: "Energy", good: ["tired", "foggy", "energy", "focus"],
      rounds: 3, pump: { n: 30, s: 1, rest: 30 },
      how: ["Sit tall, hands on knees.", "Breathe out sharply through the nose by snapping your belly in. Let the in-breath happen by itself.", "About one sharp exhale a second, for 30.", "Then rest with normal breaths for half a minute. Three rounds."],
      what: "Short active exhales and passive inhales. Breathing out quickly lowers carbon dioxide in the blood a little, which is part of why it feels clearing and energising. Often used to shake off fog.",
      source: "Not a breath-retention practice in the old texts but one of the six cleansing actions (shatkarmas) in the Hatha Yoga Pradipika (chapter 2); also in the Gheranda Samhita.",
      caution: ENERGISING_CAUTION + " Also skip during your period if it feels uncomfortable." },
    { id: "ujjayi", name: "Ujjayi", en: "Victorious, ocean breath", group: "Focus", good: ["scattered", "restless", "anxious", "focus", "ground", "calm"],
      rounds: 12, steps: [{ k: "in", s: 5, say: "In, with a soft ocean sound" }, { k: "out", s: 7, say: "Out, with the same soft sound" }],
      how: ["Breathe through the nose.", "Gently narrow the back of your throat, as if fogging a mirror with your mouth closed.", "You'll hear a soft ocean sound on the in- and out-breath.", "Keep it quiet and even — the sound is your anchor."],
      what: "The sound gives the mind something steady to follow, and the slight narrowing slows the breath. It's the breath often used during yoga flows to stay focused and warm.",
      source: "One of the eight kumbhakas in the Hatha Yoga Pradipika (chapter 2) and in the Gheranda Samhita; central in many modern styles and in Iyengar's Light on Pranayama.",
      caution: "Keep the throat soft — it should never feel tight." },
    { id: "viloma", name: "Viloma", en: "Interrupted breath", group: "Focus", good: ["scattered", "focus", "shallow", "low"],
      rounds: 6, steps: [{ k: "in", s: 2, say: "In a little" }, { k: "hold", s: 2, say: "Pause" }, { k: "in", s: 2, say: "In a little more" }, { k: "hold", s: 2, say: "Pause" }, { k: "in", s: 2, say: "Fill to the top" }, { k: "out", s: 8, say: "Long, slow breath out" }],
      how: ["Sit or lie down.", "Breathe in a third of the way, pause; another third, pause; then fill up.", "Breathe out slowly and smoothly all the way.", "Later you can try the opposite: a smooth in-breath and a stepped out-breath."],
      what: "Breaking the breath into steps asks for attention, which helps a scattered mind settle, and gently trains you to use more of your lungs.",
      source: "“Viloma” means “against the grain”. It's taught in detail in B. K. S. Iyengar's Light on Pranayama.",
      caution: HOLD_CAUTION },
    { id: "dirgha", name: "Dirgha", en: "Complete yogic breath (three-part)", group: "Focus", good: ["shallow", "anxious", "overwhelmed", "ground", "calm", "rest"],
      rounds: 8, steps: [{ k: "in", s: 2, say: "Belly fills" }, { k: "in", s: 2, say: "Ribs widen" }, { k: "in", s: 2, say: "Chest and collarbones rise" }, { k: "out", s: 8, say: "Empty from top to belly" }],
      how: ["Sit or lie down, one hand on the belly, one on the chest.", "Breathe in to the belly, then the ribs, then up to the chest and collarbones.", "Breathe out in reverse, letting the belly fall last.", "Keep it smooth — a wave, not three jumps."],
      what: "Combines belly, rib and upper-chest (clavicular) breathing into one full, slow breath. It's a gentle way to undo shallow, chest-only breathing and slow everything down.",
      source: "A modern teaching drawn from the older practices; popularised by teachers such as Swami Sivananda and in many yoga lineages today.",
      caution: "Fine for almost everyone. Don't force the last part of the in-breath." },
    { id: "sitali", name: "Sitali", en: "Cooling breath", group: "Cooling", good: ["hot", "restless", "cool"],
      rounds: 10, steps: [{ k: "in", s: 4, say: "In through the curled tongue" }, { k: "out", s: 6, say: "Out through the nose" }],
      how: ["Curl your tongue into a tube and let it peek out between your lips.", "Breathe in through it — the air feels cool.", "Close your mouth and breathe out through the nose.", "Can't curl your tongue? Breathe in through your teeth instead (that's Sitkari)."],
      what: "The in-breath passes over the wet tongue and feels cool. Used when you're overheated — in body, temper or mood.",
      source: "One of the eight kumbhakas in the Hatha Yoga Pradipika (chapter 2) and in the Gheranda Samhita.",
      caution: "Skip in very cold weather or if you have low blood pressure or a cold." },
    { id: "sama", name: "Sama Vritti", en: "Equal (box) breathing", group: "Calm", good: ["anxious", "scattered", "overwhelmed", "focus", "calm", "rest"],
      rounds: 6, steps: [{ k: "in", s: 4, say: "Breathe in" }, { k: "hold", s: 4, say: "Hold" }, { k: "out", s: 4, say: "Breathe out" }, { k: "hold", s: 4, say: "Hold" }],
      how: ["Breathe in for four, hold for four, out for four, hold for four.", "Keep the holds soft — no gripping in the throat.", "If four is too long, use three."],
      what: "Equal, steady counts give the mind a simple job and slow the breath down. A favourite for anxious or busy moments.",
      source: "“Sama vritti” (equal movement) is described in Iyengar's Light on Pranayama; the four-part box version is widely taught today.",
      caution: HOLD_CAUTION },
  ];
  function pranaById(id) { return PRANAYAMAS.find((x) => x.id === id) || null; }

  let breathEngine = null;
  function stopBreathEngine() { if (breathEngine) { clearTimeout(breathEngine.t); breathEngine = null; } }

  function renderBreathe() {
    const el = $("#tab-breathe");
    const sel = S.breathSel || [];
    const groups = ["Calm", "Cooling", "Energy", "Focus"];
    el.innerHTML = '<section class="block calm-page"><h1 class="page-title">Breathe</h1>' +
      '<p class="muted">How are you, and what would you like? Pick as many as fit.</p>' +
      '<div class="field"><span class="field-label">I feel</span><div class="chip-row">' + BREATH_FEELINGS.map((f) =>
        '<button type="button" class="chip" data-h-bsel="' + f.id + '" aria-pressed="' + sel.includes(f.id) + '">' + esc(f.label) + "</button>").join("") + "</div></div>" +
      '<div class="field"><span class="field-label">I want</span><div class="chip-row">' + BREATH_WANTS.map((f) =>
        '<button type="button" class="chip sage" data-h-bsel="' + f.id + '" aria-pressed="' + sel.includes(f.id) + '">' + esc(f.label) + "</button>").join("") + "</div></div>" +
      '<button type="button" class="btn-primary" data-h-bsuggest>Suggest a breath for me</button>' +
      '<h2 class="sub-h">All the breaths</h2>' +
      groups.map((g) => '<div class="day"><span class="day-name">' + g + '</span><div class="rows">' +
        PRANAYAMAS.filter((x) => x.group === g).map((x) =>
          '<button type="button" class="row row-btn" data-h-bopen="' + x.id + '"><span class="row-main"><b>' + esc(x.name) + "</b><span>" + esc(x.en) + "</span></span>" + CHEV + "</button>").join("") +
        "</div></div>").join("") +
      '<p class="muted small">Breathe gently, never force. If you feel dizzy, light-headed or anxious, stop and breathe normally. Not a substitute for medical advice.</p></section>';
  }

  function suggestBreath() {
    const sel = S.breathSel || [];
    let pool = PRANAYAMAS.map((x) => ({ x, w: sel.length ? x.good.filter((g) => sel.includes(g)).length : 1 }));
    const wantsCalm = sel.some((g) => ["anxious", "overwhelmed", "restless", "sleep", "hot", "calm", "rest", "cool"].includes(g));
    const wantsEnergy = sel.some((g) => ["tired", "foggy", "energy"].includes(g));
    // never offer fast breathing to someone anxious or wanting rest, unless they also asked for energy
    if (wantsCalm && !wantsEnergy) pool = pool.filter((p) => !["bhastrika", "kapalabhati", "surya"].includes(p.x.id));
    const matched = pool.filter((p) => p.w > 0);
    const list = matched.length ? matched : pool;
    // mostly the best matches, sometimes a gentle surprise from the rest
    const total = list.reduce((n, p) => n + p.w * p.w + 0.3, 0);
    let r = Math.random() * total;
    for (const p of list) { r -= p.w * p.w + 0.3; if (r <= 0) return p.x.id; }
    return list[0].x.id;
  }

  function readMore(x) {
    return '<details class="read-more"><summary>Read about it</summary>' +
      "<p><b>What it does.</b> " + esc(x.what) + "</p>" +
      "<p><b>Where it comes from.</b> " + esc(x.source) + "</p>" +
      "<p><b>Take care.</b> " + esc(x.caution) + "</p></details>";
  }

  function openPranayama(id, suggested) {
    const x = pranaById(id);
    if (!x) return;
    stopBreathEngine();
    const rounds = (S.breathRounds && S.breathRounds[id]) || x.rounds;
    openFlow();
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">' + (suggested ? "A breath for you" : esc(x.group)) + "</span>" +
      '<button type="button" class="icon-btn" data-h-bclose aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<h2 id="flowTitle" class="flow-h">' + esc(x.name) + '</h2><p class="muted" style="margin-top:-8px">' + esc(x.en) + "</p>" +
      '<ol class="how">' + x.how.map((h) => "<li>" + esc(h) + "</li>").join("") + "</ol>" +
      (x.pump ? '<p class="caution">' + esc(x.caution) + "</p>" : "") +
      '<div class="stepper small"><button type="button" class="round-btn" data-h-bround="-1" aria-label="Fewer rounds">−</button>' +
      '<span><b class="rounds-num">' + rounds + "</b> rounds</span>" +
      '<button type="button" class="round-btn" data-h-bround="1" aria-label="More rounds">+</button></div>' +
      '<button type="button" class="btn-primary" data-h-bbegin="' + x.id + '">Begin</button>' +
      (suggested ? '<button type="button" class="link-btn center" data-h-bsuggest>Suggest another</button>' : "") +
      readMore(x);
    $("#flowInner").dataset.breath = x.id;
  }

  function beginPranayama(id) {
    const x = pranaById(id);
    const rounds = (S.breathRounds && S.breathRounds[id]) || x.rounds;
    stopBreathEngine();
    // build the sequence of phases
    const seq = [];
    if (x.pump) {
      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < x.pump.n; i++) seq.push({ k: "pump", s: x.pump.s, say: x.id === "kapalabhati" ? "Sharp out" : "In · out", n: i + 1, of: x.pump.n, round: r + 1 });
        if (r < rounds - 1) seq.push({ k: "rest", s: x.pump.rest, say: "Rest — breathe normally", round: r + 1 });
      }
    } else {
      const nIn = x.steps.filter((st) => st.k === "in").length;
      for (let r = 0; r < rounds; r++) {
        let k = 0;
        x.steps.forEach((st) => {
          if (st.k === "in") k++;
          seq.push(Object.assign({ round: r + 1, to: st.k === "in" ? 0.62 + 0.38 * (k / nIn) : null }, st));
        });
      }
    }
    breathEngine = { id, seq, i: 0, started: Date.now(), rounds, paused: false };
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">' + esc(x.name) + '</span><span class="muted small" id="bRound"></span></div>' +
      '<div class="pr-stage"><div class="pr-circle" id="bCircle"></div><div class="pr-text"><b id="bSay"></b><span id="bCount"></span></div></div>' +
      '<div class="flow-btns"><button type="button" class="btn-ghost-dark" data-h-bpause>Pause</button>' +
      '<button type="button" class="btn-primary" data-h-bfinish>Finish</button></div>';
    ringBell("bell", 1);
    runPhase();
  }

  function runPhase() {
    const e = breathEngine;
    if (!e) return;
    if (e.i >= e.seq.length) { finishPranayama(true); return; }
    const ph = e.seq[e.i];
    const c = $("#bCircle");
    if (!c) { stopBreathEngine(); return; }
    $("#bSay").textContent = ph.say;
    $("#bRound").textContent = "Round " + ph.round + " of " + e.rounds;
    if (ph.k === "pump") {
      c.style.transition = "transform " + (ph.s * 0.35) + "s ease-out";
      c.style.transform = "scale(.86)";
      setTimeout(() => { if (c.isConnected) { c.style.transition = "transform " + (ph.s * 0.6) + "s ease-in"; c.style.transform = "scale(.7)"; } }, ph.s * 350);
      $("#bCount").textContent = ph.n + " / " + ph.of;
    } else {
      c.style.transition = "transform " + ph.s + "s ease-in-out";
      if (ph.k === "in") c.style.transform = "scale(" + (ph.to || 1) + ")";
      else if (ph.k === "out") c.style.transform = "scale(.62)";
      else if (ph.k === "rest") c.style.transform = "scale(.75)";
      let left = Math.round(ph.s);
      const tickDown = () => {
        if (!breathEngine || breathEngine !== e || e.paused) return;
        $("#bCount") && ($("#bCount").textContent = left > 0 ? String(left) : "");
        left--;
        if (left >= 0) e.cd = setTimeout(tickDown, 1000);
      };
      tickDown();
    }
    c.dataset.k = ph.k;
    e.t = setTimeout(() => { e.i++; runPhase(); }, ph.s * 1000);
  }

  function finishPranayama(complete) {
    const e = breathEngine;
    if (!e) return;
    const x = pranaById(e.id);
    const secs = Math.max(1, Math.round((Date.now() - e.started) / 1000));
    const roundsDone = complete ? e.rounds : (e.seq[Math.max(0, e.i - 1)] || { round: 0 }).round;
    stopBreathEngine();
    ringBell("bowl", 1);
    const draft = { id: e.id, secs, rounds: roundsDone, feelings: [] };
    S.breathDraft = draft;
    renderBreathSummary();
  }

  function renderBreathSummary() {
    const d = S.breathDraft;
    const x = pranaById(d.id);
    $("#flowInner").innerHTML =
      '<div class="flow-top"><span class="eyebrow">Well breathed</span></div>' +
      '<div class="moment-face">' + mascot(90, "sleepy") + "</div>" +
      '<h2 id="flowTitle" class="flow-h center">' + esc(x.name) + "</h2>" +
      '<p class="muted center">' + d.rounds + (d.rounds === 1 ? " round" : " rounds") + " · " + (d.secs >= 60 ? Math.round(d.secs / 60) + " min" : d.secs + " sec") + "</p>" +
      '<div class="field"><span class="field-label">How do you feel now?</span>' + chipGroup("bfeel", ["Calmer", "Clearer", "Lighter", "Awake", "Warm", "Cool", "Sleepy", "The same", "Uneasy"], d.feelings, "sage") + "</div>" +
      readMore(x).replace("<details", "<details open") +
      '<button type="button" class="btn-primary" data-h-bsave>Keep it in my journal</button>' +
      '<button type="button" class="link-btn center" data-h-bclose>Close without saving</button>';
  }

  function saveBreath() {
    const d = S.breathDraft;
    if (!d) return;
    const x = pranaById(d.id);
    S.sessions.push({ id: uid(), passion: "breath:" + d.id, passionName: x.name, start: Date.now() - d.secs * 1000, minutes: Math.max(1, Math.round(d.secs / 60)),
      reasons: [], thought: "", before: { feelings: (S.breathSel || []).map((g) => ((BREATH_FEELINGS.concat(BREATH_WANTS).find((f) => f.id === g) || {}).label || g)), mood: null },
      after: { feelings: d.feelings, mood: null }, note: d.rounds + " rounds of " + x.name + " (" + x.en.toLowerCase() + ")", parked: [] });
    S.breathDraft = null;
    save();
    closeFlow();
    toast("Kept in your journal");
  }

  /* ---------- Quick starts: "Just 2 min", meditation without questions ---------- */
  function quickStart(pid, minutes, med) {
    if (S.active) { openFlow(); renderDoing(); return; }
    const p = passionById(pid);
    if (!p) return;
    S.active = {
      id: uid(), passion: pid, start: Date.now(), planned: minutes, pausedMs: 0, pausedAt: null,
      reasons: [], thought: "", before: { feelings: [], mood: null }, prompt: promptFor(p), look: lookFor(p), parked: [], notes: "",
    };
    nextPrompt(p.id); // a different idea next time
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
    const mins = S.medMinutes || 10;
    const iv = S.medInterval != null ? S.medInterval : 5;
    const snd = S.medSound || "bowl";
    const ivLabel = (MED_INTERVALS.find((x) => x.m === iv) || MED_INTERVALS[0]).label.replace("No interval bells", "none").replace("Every", "every");
    const sndLabel = (MED_SOUNDS.find((x) => x.id === snd) || MED_SOUNDS[0]).label.toLowerCase();
    el.innerHTML = '<section class="block calm-page med-calm">' +
      '<div class="title-row"><a class="round-btn" href="#/passions" aria-label="Back to Play">' + BACK + '</a><h1 class="page-title">Meditate</h1></div>' +
      '<div class="stepper"><button type="button" class="round-btn big" data-h-mp-step="-1" aria-label="Less time">−</button>' +
      '<span class="big-num" aria-live="polite">' + mins + '</span><button type="button" class="round-btn big" data-h-mp-step="1" aria-label="More time">+</button></div>' +
      '<span class="muted center">minutes</span>' +
      '<div class="rows settings">' +
      '<button type="button" class="row row-btn" data-h-mp-bells><span class="row-main"><b>Bells in between</b></span><span class="row-val">' + esc(ivLabel) + "</span>" + CHEV + "</button>" +
      '<button type="button" class="row row-btn" data-h-mp-snd><span class="row-main"><b>Sound</b></span><span class="row-val">' + esc(sndLabel) + "</span>" + CHEV + "</button>" +
      "</div>" +
      '<button type="button" class="btn-primary big-begin" data-h-mp-begin>Begin</button>' +
      '<p class="muted small center">One bell to begin, three to end. Keep the screen on so the bells can ring.</p>' +
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
  const MOVE_SECTIONS = ["yoga", "move", "flex", "pilates", "dance", "lists", "kept"];
  const MOVE_LABELS = { yoga: "Yoga", move: "Calisthenics", flex: "Flexibility", pilates: "Pilates", dance: "Dance", lists: "My playlists & kept" };
  function renderYoga() { renderMoveTop(); }
  function renderMoveTop() {
    const el = $("#yogaCounter");
    const tab = $("#tab-move");
    if (!el || !tab) return;
    const view = MOVE_SECTIONS.includes(S.moveView) ? S.moveView : "";
    tab.dataset.view = view || "summary";
    if (view) {
      el.innerHTML = '<div class="move-cat-head">' + backRow("Move", "data-h-move-view=\"\"") +
        '<div class="title-row spread"><h1 class="page-title">' + esc(MOVE_LABELS[view] || "Move") + "</h1>" +
        '<button type="button" class="btn-soft" data-h-open-add>+ Add a video</button></div></div>';
      return;
    }
    const cp = window.CalmPlayer;
    const cur = cp && cp.currentVideo ? cp.currentVideo() : null;
    const counts = cp && cp.counts ? cp.counts() : {};
    const all = S.yoga || [];
    const dots = Array.from({ length: 7 }, (_, i) => {
      const d0 = rangeStart("week") + i * 864e5;
      const on = all.some((y) => y.t >= d0 && y.t < d0 + 864e5);
      return '<span class="ydot' + (on ? " on" : "") + (i === 6 ? " today" : "") + '" title="' + new Date(d0).toLocaleDateString(undefined, { weekday: "long" }) + '"></span>';
    }).join("");
    const week = all.filter((y) => y.t >= rangeStart("week")).length;
    el.innerHTML = '<section class="block calm-page"><h1 class="page-title">Move</h1>' +
      (cur ? '<button type="button" class="continue" data-h-continue="' + esc(cur.id) + '" data-sec="' + esc(cur.section) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(cur.id) + '/mqdefault.jpg" alt="" loading="lazy">' +
        '<span class="row-main"><span>Continue · ' + esc(cur.where || "") + "</span><b>" + esc(cur.title) + "</b></span></button>" : "") +
      '<div class="yoga-line"><div><b>Yoga this week</b><div class="ydots" role="img" aria-label="Yoga on ' + week + ' of the last 7 days">' + dots + "</div></div>" +
      '<button type="button" class="btn-soft" data-h-yoga-plus aria-label="I did yoga today">+1</button></div>' +
      '<div class="rows">' + ["yoga", "move", "flex", "pilates", "dance", "lists"].map((k) =>
        '<button type="button" class="row row-btn" data-h-move-view="' + k + '"><span class="row-main"><b>' + esc(MOVE_LABELS[k]) + "</b></span>" +
        '<span class="row-val">' + (k === "lists" ? "" : (counts[k] || 0)) + "</span>" + CHEV + "</button>").join("") + "</div></section>";
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
  function restDays(c) { return Math.floor((Date.now() - c.t) / 864e5); }
  function sproutStage(days) { return days >= 21 ? 5 : days >= 14 ? 4 : days >= 7 ? 3 : days >= 3 ? 2 : days >= 1 ? 1 : 0; }
  const SPROUT_WORDS = ["a seed", "a sprout", "two leaves", "a little plant", "a bud", "a flower"];
  function sprout(days, cls) {
    const st = sproutStage(days);
    const px = [], pl = [];
    const put = (x, y, c, arr) => (arr || px).push([x, y, c]);
    // pot
    for (let x = 2; x <= 9; x++) put(x, 9, "pr");
    for (let x = 3; x <= 8; x++) { put(x, 10, "pt"); put(x, 11, "pt"); }
    for (let x = 4; x <= 7; x++) put(x, 12, "pd");
    for (let x = 3; x <= 8; x++) put(x, 8, "s2");
    if (st === 0) put(5, 7, "s3", pl);
    if (st >= 1) { put(5, 7, "g1", pl); put(5, 6, "g1", pl); put(4, 6, "g2", pl); }
    if (st >= 2) { put(6, 5, "g2", pl); put(7, 5, "g2", pl); put(5, 5, "g1", pl); }
    if (st >= 3) { put(5, 4, "g1", pl); put(5, 3, "g1", pl); put(3, 5, "g2", pl); put(4, 4, "g2", pl); }
    if (st === 4) { put(5, 2, "p1", pl); put(4, 2, "p2", pl); put(6, 2, "p2", pl); put(5, 1, "p1", pl); }
    if (st >= 5) {
      [[5, 0], [3, 1], [4, 1], [6, 1], [7, 1], [3, 3], [7, 3], [4, 3], [6, 3]].forEach(([x, y]) => put(x, y, (x + y) % 2 ? "p1" : "p2", pl));
      put(4, 2, "p2", pl); put(6, 2, "p2", pl); put(5, 2, "y", pl); put(5, 1, "p2", pl); put(3, 2, "d", pl); put(7, 2, "d", pl);
    }
    const col = Object.assign({ pr: "#E07E5E", pt: "#C8664A", pd: "#A4503A" }, PX);
    const rect = ([x, y, c]) => '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + col[c] + '"/>';
    return '<svg class="sprout ' + (cls || "") + '" viewBox="0 0 12 13" shape-rendering="crispEdges" role="img" aria-label="' + SPROUT_WORDS[st] + '">' +
      px.map(rect).join("") + '<g class="sprout-plant">' + pl.map(rect).join("") + "</g></svg>";
  }
  function inMix() { return (S.compost || []).filter((c) => c.mix && !c.done); }

  const STAGE_NAMES = ["Fresh soil", "A worm moved in", "A sprout!", "Leaves", "A bud", "A lily", "A lily that's awake", "A little garden"];
  function renderCompost() {
    const el = $("#keepCompost");
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
      '<p class="muted small">“Add to the mix” puts an idea into the random ideas for <b>I don\'t know what to do with myself</b> on the home page. Each idea\'s little plant grows the longer it rests.</p>' +
      '<form class="compost-add" data-h-compost-form><label class="sr-only" for="compostText">An idea for later</label>' +
      '<input id="compostText" placeholder="An idea for something I could do…" maxlength="140" autocomplete="off"><button type="submit" class="btn-dark">Add to compost</button></form>' +
      (resting.length ? '<h2 class="sub-h">Resting in the compost</h2><div class="compost-list">' + resting.map((c) =>
        '<div class="compost-item">' + sprout(restDays(c)) + '<div><b>' + esc(c.text) + '</b><span class="muted small">' +
        (restDays(c) ? "resting " + restDays(c) + (restDays(c) === 1 ? " day" : " days") + " · " + SPROUT_WORDS[sproutStage(restDays(c))] : "planted today") + "</span></div>" +
        '<button type="button" class="btn-soft mix-btn" data-h-idea-mix="' + esc(c.id) + '" aria-pressed="' + !!c.mix + '">' + (c.mix ? "✓ In the mix" : "Add to the mix") + "</button>" +
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
  const LISTEN_SECTIONS = ["shelf", "background", "sound", "spotify"];
  const LISTEN_LABELS = { shelf: "My files", background: "Background videos", sound: "Soundscapes", spotify: "Spotify" };
  function spotifyHtml() {
    const list = S.spotify || [];
    return '<section class="block" id="spotify"><p class="muted small">Paste a playlist, album or song link from the Spotify app (Share → Copy link).</p>' +
      '<form class="compost-add" data-h-spotify-form><label class="sr-only" for="spotifyUrl">Spotify link</label>' +
      '<input id="spotifyUrl" placeholder="https://open.spotify.com/playlist/…" autocomplete="off"><button type="submit" class="btn-dark">Add</button></form>' +
      (list.length ? '<div class="spotify-list">' + list.map((x) =>
        '<div class="spotify-item"><iframe title="Spotify ' + esc(x.type) + '" src="https://open.spotify.com/embed/' + esc(x.type) + "/" + esc(x.sid) +
        '?utm_source=generator" width="100%" height="' + (x.type === "track" || x.type === "episode" ? 152 : 352) + '" frameborder="0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; storage-access"></iframe>' +
        '<button type="button" class="link-btn" data-h-spotify-del="' + esc(x.id) + '">Remove</button></div>').join("") + "</div>"
        : '<p class="empty">No Spotify links yet.</p>') +
      '<p class="muted small spotify-help">Full songs play when you\'re logged in to Spotify in this same browser — ' +
      '<a href="https://accounts.spotify.com/login?continue=https%3A%2F%2Fopen.spotify.com%2F" target="_blank" rel="noopener">log in to Spotify here</a>, then come back and reload.</p></section>';
  }
  function nowPlaying() {
    const cp = window.CalmPlayer;
    const title = cp && cp.soundTitle ? cp.soundTitle() : "";
    const kind = cp && cp.soundKind ? cp.soundKind() : "";
    return { title, kind, on: !!title };
  }
  function renderSoundsExtras() {
    const el = $("#spotifyBox");
    const tab = $("#tab-sounds");
    if (!el || !tab) return;
    const view = LISTEN_SECTIONS.includes(S.listenView) ? S.listenView : "";
    tab.dataset.view = view || "summary";
    if (view) {
      el.innerHTML = '<div class="move-cat-head">' + backRow("Listen", "data-h-listen-view=\"\"") +
        '<h1 class="page-title">' + esc(LISTEN_LABELS[view]) + "</h1></div>" + (view === "spotify" ? spotifyHtml() : "");
      return;
    }
    const np = nowPlaying();
    const cp = window.CalmPlayer;
    const vol = cp && cp.volume ? cp.volume() : 40;
    const noiseOn = !!(S.noise && S.noise.on);
    const filesN = document.querySelectorAll("#grid-files .file-tile").length;
    el.innerHTML = '<section class="block calm-page"><h1 class="page-title">Listen</h1>' +
      '<div class="now-card' + (np.on ? "" : " idle") + '"><div class="now-top"><div class="row-main"><span id="npKind">' + (np.on ? esc(np.kind) : "Nothing playing") + '</span><b id="npTitle">' +
      (np.on ? esc(np.title) : (noiseOn ? "Just the calm noise" : "Quiet")) + "</b></div>" +
      (np.on ? '<button type="button" class="stop-btn" data-h-stop-sound aria-label="Stop"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/></svg></button>' : "") + "</div>" +
      (np.on ? '<label class="vol">Volume <input type="range" id="listenVol" min="0" max="100" value="' + vol + '"></label>' : "") + "</div>" +
      '<div class="rows">' +
      '<div class="row"><span class="row-main"><b>Calm noise</b><span>soft breeze · pauses under music</span></span>' +
      '<button type="button" class="toggle' + (noiseOn ? " on" : "") + '" data-h-noise aria-pressed="' + noiseOn + '">' + (noiseOn ? "On" : "Off") + "</button></div>" +
      (noiseOn ? '<div class="row slim"><label class="vol">Calm noise volume <input type="range" id="noiseVol" min="0" max="60" value="' + Math.round(((S.noise && S.noise.vol) || 0.18) * 100) + '"></label></div>' : "") +
      '<button type="button" class="row row-btn" data-h-listen-view="shelf"><span class="row-main"><b>My files</b><span>' + (filesN ? filesN + " · " : "") + "work without internet</span></span>" + CHEV + "</button>" +
      '<button type="button" class="row row-btn" data-h-listen-view="background"><span class="row-main"><b>Background videos</b><span>my YouTube playlist</span></span>' + CHEV + "</button>" +
      '<button type="button" class="row row-btn" data-h-listen-view="spotify"><span class="row-main"><b>Spotify</b><span>' + ((S.spotify || []).length ? (S.spotify.length + " saved") : "add a playlist") + "</span></span>" + CHEV + "</button>" +
      '<button type="button" class="row row-btn" data-h-listen-view="sound"><span class="row-main"><b>Soundscapes</b><span>rain, bowls, ocean, forest</span></span>' + CHEV + "</button>" +
      "</div></section>";
    const v = $("#noiseVol");
    if (v) v.addEventListener("input", function () { S.noise = S.noise || {}; S.noise.vol = Number(this.value) / 100; save(); noiseLevel(); });
    const lv = $("#listenVol");
    if (lv) lv.addEventListener("input", function () { if (window.CalmPlayer) window.CalmPlayer.setVolume(Number(this.value)); });
  }
  // keep "Playing" fresh without redrawing the slider
  let lastNp = "";
  setInterval(function () {
    const tab = $("#tab-sounds");
    if (!tab || tab.hidden || tab.dataset.view !== "summary") return;
    const np = nowPlaying();
    const key = np.title + "|" + np.kind;
    if (key !== lastNp) { lastNp = key; renderSoundsExtras(); }
  }, 2000);

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
    sp.innerHTML = '<div class="splash-inner"><div class="breath small" aria-hidden="true"><div class="breath-glow"></div><div class="breath-flower">' + mascot(130, "sleepy") + "</div></div>" +
      '<p class="breath-words" aria-live="off"><span class="w1">breathe in</span><span class="w2">hold</span><span class="w3">breathe out</span><span class="w4">hold</span></p>' +
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

  function insight() {
    const week = sessionsIn("week");
    if (!week.length) return "Whatever you do this week will gather here, kindly.";
    const lp = liftByPassion(week).filter((x) => x.lift > 0);
    const hours = {};
    week.filter((x) => (x.reasons || []).length).forEach((x) => { const h = new Date(x.start).getHours(); hours[h] = (hours[h] || 0) + 1; });
    const peak = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
    const parts = [];
    if (lp[0]) parts.push(((passionById(lp[0].id) || {}).name || "One thing") + " lifted you the most this week.");
    if (peak && peak[1] >= 2) parts.push("Most urges came around " + (Number(peak[0]) % 12 || 12) + (Number(peak[0]) < 12 ? " am." : " pm."));
    if (!parts.length) parts.push("You spent time with yourself " + week.length + (week.length === 1 ? " time" : " times") + " this week.");
    return parts.join(" ");
  }
  function moodWords(x) {
    const b = ((x.before && x.before.feelings) || []).join(", ");
    const a = ((x.after && x.after.feelings) || []).join(", ");
    if (x.moment) return [x.minutes ? fmtMin(x.minutes) : "a moment", a].filter(Boolean).join(" · ");
    if (b && a) return b.toLowerCase() + " → " + a.toLowerCase();
    return (a || b || "").toLowerCase();
  }
  function renderJournal() {
    const el = $("#keepJournal");
    const limit = S.journalLimit || 40;
    const list = S.sessions.slice().sort((a, b) => b.start - a.start);
    const shown = list.slice(0, limit);
    const groups = [];
    shown.forEach((x) => {
      const k = dayKey(x.start);
      let g = groups[groups.length - 1];
      if (!g || g.k !== k) { g = { k, t: x.start, items: [] }; groups.push(g); }
      g.items.push(x);
    });
    const today = dayKey(Date.now()), yest = dayKey(Date.now() - 864e5);
    const dayName = (g) => g.k === today ? "Today" : g.k === yest ? "Yesterday" :
      new Date(g.t).toLocaleDateString(undefined, Date.now() - g.t < 6 * 864e5 ? { weekday: "long" } : { weekday: "short", day: "numeric", month: "short" });
    el.innerHTML = '<section class="block calm-page">' +
      '<p class="insight">' + esc(insight()) + "</p>" +
      (groups.length ? groups.map((g) => '<div class="day"><span class="day-name">' + esc(dayName(g)) + '</span><div class="rows">' +
        g.items.map((x) => {
          const p = passionById(x.passion);
          const name = x.moment ? x.passionName : ((p && p.name) || x.passionName || "Session") + (x.minutes ? " · " + fmtMin(x.minutes) : "");
          const extra = [x.thought ? "Thought before: “" + x.thought + "”" : "", x.note || "", x.prompt && !x.moment ? "Prompt: " + x.prompt : ""].filter(Boolean);
          return '<details class="jrow"><summary><span class="jtime">' + new Date(x.start).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + "</span>" +
            '<span class="row-main"><b>' + esc(name) + "</b><span>" + esc(moodWords(x)) + "</span></span></summary>" +
            '<div class="jmore">' + extra.map((t) => "<p>" + esc(t) + "</p>").join("") +
            (x.notes ? '<p class="jpages">' + esc(x.notes) + "</p>" : "") +
            '<button type="button" class="link-btn" data-h-del-session="' + esc(x.id) + '">Delete</button></div></details>';
        }).join("") + "</div></div>").join("")
        : '<p class="empty">Nothing here yet. Everything you do — and every little moment you keep — gathers here.</p>') +
      (list.length > limit ? '<button type="button" class="wide-btn" data-h-more-journal>Show earlier days</button>' : "") +
      '<p class="muted small center"><button type="button" class="link-btn" data-h-export>Export my journal</button></p></section>';
  }

  function renderKeep() {
    const v = S.keepView === "journal" ? "journal" : "compost";
    $$("#tab-keep .seg-tabs a").forEach((a) => {
      const on = a.dataset.keep === v;
      a.classList.toggle("active", on);
      a.setAttribute("aria-selected", String(on));
    });
    $("#keepCompost").hidden = v !== "compost";
    $("#keepJournal").hidden = v !== "journal";
    if (v === "compost") renderCompost(); else renderJournal();
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
    if (d.hBsel) { S.breathSel = S.breathSel || []; toggle(S.breathSel, d.hBsel); save(); renderBreathe(); return; }
    if (d.hBsuggest !== undefined) { openPranayama(suggestBreath(), true); return; }
    if (d.hBopen) { openPranayama(d.hBopen, false); return; }
    if (d.hBround) {
      const id = $("#flowInner").dataset.breath;
      const x = pranaById(id);
      S.breathRounds = S.breathRounds || {};
      const cur = S.breathRounds[id] || x.rounds;
      S.breathRounds[id] = Math.max(1, Math.min(40, cur + Number(d.hBround)));
      save();
      const n = $(".rounds-num"); if (n) n.textContent = S.breathRounds[id];
      return;
    }
    if (d.hBbegin) { beginPranayama(d.hBbegin); return; }
    if (d.hBpause !== undefined) {
      const e2 = breathEngine;
      if (!e2) return;
      if (!e2.paused) { e2.paused = true; clearTimeout(e2.t); clearTimeout(e2.cd); b.textContent = "Resume"; $("#bSay").textContent = "Paused"; }
      else { e2.paused = false; b.textContent = "Pause"; runPhase(); }
      return;
    }
    if (d.hBfinish !== undefined) { finishPranayama(false); return; }
    if (d.hPickBfeel) { toggle(S.breathDraft.feelings, d.hPickBfeel); renderBreathSummary(); return; }
    if (d.hBsave !== undefined) { saveBreath(); return; }
    if (d.hBclose !== undefined) { stopBreathEngine(); S.breathDraft = null; closeFlow(); return; }
    if (d.hLen) { S.playLen = d.hLen; save(); renderPassions(); return; }
    if (d.hPlayView) { S.playView = d.hPlayView; save(); renderPassions(); window.scrollTo({ top: 0 }); return; }
    if (d.hPlayRow) {
      const len = S.playLen || "2";
      quickStart(d.hPlayRow, len === "2" ? 2 : len === "15" ? 15 : 0);
      return;
    }
    if (d.hMpStep) {
      const steps = MED_TIMES;
      const cur = S.medMinutes || 10;
      let i = steps.indexOf(cur); if (i === -1) i = 1;
      i = Math.max(0, Math.min(steps.length - 1, i + Number(d.hMpStep)));
      S.medMinutes = steps[i]; save(); renderMeditate(); return;
    }
    if (d.hMpBells !== undefined) {
      const ivs = MED_INTERVALS.map((x) => x.m);
      const cur = S.medInterval != null ? S.medInterval : 5;
      S.medInterval = ivs[(ivs.indexOf(cur) + 1) % ivs.length]; save(); renderMeditate(); return;
    }
    if (d.hMpSnd !== undefined) {
      const ids = MED_SOUNDS.map((x) => x.id);
      S.medSound = ids[(ids.indexOf(S.medSound || "bowl") + 1) % ids.length]; save(); ringBell(S.medSound, 1); renderMeditate(); return;
    }
    if (d.hMoveView !== undefined) { S.moveView = d.hMoveView; save(); renderMoveTop(); window.scrollTo({ top: 0 }); return; }
    if (d.hContinue) {
      S.moveView = MOVE_SECTIONS.includes(d.sec) ? d.sec : "yoga"; save(); renderMoveTop();
      if (window.CalmPlayer) window.CalmPlayer.play(d.hContinue);
      return;
    }
    if (d.hOpenAdd !== undefined) { const b2 = $("#openAdd"); if (b2) b2.click(); return; }
    if (d.hListenView !== undefined) { S.listenView = d.hListenView; save(); renderSoundsExtras(); window.scrollTo({ top: 0 }); return; }
    if (d.hStopSound !== undefined) { if (window.CalmPlayer) window.CalmPlayer.stopSound(); setTimeout(renderSoundsExtras, 60); return; }
    if (d.hMoreJournal !== undefined) { S.journalLimit = (S.journalLimit || 40) + 40; renderJournal(); return; }
    if (d.keep) { /* handled by the link's hash */ }
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
    if (d.hIdeaMix) {
      const c = S.compost.find((x) => x.id === d.hIdeaMix);
      if (c) { c.mix = !c.mix; save(); renderCompost(); toast(c.mix ? "Added to your random ideas" : "Taken out of the mix"); }
      return;
    }
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
      nextPrompt(p.id); S.active.prompt = promptFor(p); S.active.look = lookFor(p); save(); renderDoing(); return;
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
