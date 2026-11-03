# Playground

A calm, childlike watercolour playground to go to instead of scrolling. The game is simple: play, live and be curious. It helps me do things I enjoy, notice the random good things I already do, spend time with myself, and keep ideas for later.

Plain HTML, CSS and JavaScript — no build step. Live at https://julielebreton222.github.io/calm-player/ · made for iPhone (bottom tab bar, safe areas, add to Home Screen) and Mac.

## Places

- **Welcome:** opens with “In the true man there is a child hidden — it wants to play.” (Nietzsche, *Thus Spoke Zarathustra*, Thomas Common's public-domain translation) and starts the calm noise.
- **Playground (home):** just for breathing and catching me: a breathing flower (in 4, out 6), one quote at a time from fiction and non-fiction (tap “another”), “Remember to play”, and two buttons — I want to scroll… and I don't know what to do with myself (one suggestion, two minutes). My people live at the bottom of Things I love; gentle mode is in the footer.
- **Things I love:** tiny things (2–5 min) and cozy things, each with tiny prompts. **Just 2 min** skips the questions. Things I tend to avoid, for 10 brave minutes.
- **Compost:** drop ideas you can't do yet. An 8-bit heap grows every 5 ideas (worm → sprout → leaves → bud → lily → awake lily → garden). Try an idea later, or mark “I did it”.
- **Meditate:** 5–60 min, interval bells, Tibetan singing bowl / deep bowl / small bell (generated in the browser, works offline).
- **Move:** yoga counter (+1, and yoga classes played here count by themselves), plus all the classes, playlists, yoga path and ladders.
- **Sounds:** calm noise (soft breeze, pauses while other music plays), Spotify playlists/albums/songs, my YouTube background playlist, and My files (offline).
- **Journal & Spell book:** every session and moment, patterns, and 12 original spells plus my own.

## Sync across devices

Footer → **Sync across my devices**. Paste a GitHub token that only has the `gist` permission (one per device, or reuse it). Everything the app saves goes into one private gist in your account, “My Hangout sync (private)”, and is combined entry by entry, so journal sessions are never lost and deletions stay deleted. Files in My files stay on each device.

## Run it

- **Online:** turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). The app will live at `https://<your-username>.github.io/calm-player/`.
- **On your computer:** serve the folder, e.g. `python3 -m http.server`, then open http://localhost:8000.
  Opening `index.html` directly as a file mostly works, but YouTube refuses to play embeds from `file://` pages.

## What's inside

- **Mood filters:** Gentle / Flow / Strong / Rest & breathe, ~15 / ~30 / 60+ min, Beginner / Intermediate.
- **Player:** embedded YouTube player (privacy-enhanced mode), with Keep ♡, Add to playlist, and a **soundscape underneath** with its own volume.
- **Playlists:** each playlist holds one kind of video (Yoga, Calisthenics, Flexibility, Pilates or Dance). Up next queue, play a whole playlist (auto-advances), plus create, rename, reorder and delete.
- **By person / channel:** an automatic playlist of every video in your library from one person, one per kind. Paste a link on that person's row to add more of their videos.
- **Background:** my YouTube playlist “background videos” (focus & pomodoro, lofi & jazz, calm & dreamy, chant & flute, rain, talks). Play all or shuffle the whole list, or one video, under anything. A bottom bar keeps it playing with volume, next/previous and stop.
- **My files · offline:** add your own audio or video files from your device. They're saved inside the app (IndexedDB) on that device only, play with no internet and no ads, and work in the bottom player bar and under any class. Nothing is uploaded.
- **Works offline / installable:** the app caches itself (service worker) and can be added to your home screen. YouTube videos still need a connection.
- **Remove any video** with the bin button (or "Remove" under the player). Undo right away, or restore removed starter videos from the footer.
- **My yoga path:** teachers marked To try / Trying / Kept / Not for me. After a class there's a "how was it?" rating and a "What I loved in India" note to compare against.
- **Calisthenics ladders:** Push, Pull, Legs and Core progressions. Log reps and move up a step.
- **Sections:** Yoga, Calisthenics, Flexibility, Pilates (no equipment), Dance (no equipment), Soundscapes. 111 starter videos, each checked against YouTube, including popular picks (★) from the biggest channels and 30 min+ yoga classes.
- **Add a video or teacher:** paste a YouTube link and the title and channel fill in automatically, then tag it.
- **Export / import** your library as JSON.

Everything you add, keep or log is saved in your browser (`localStorage`).

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Look & layout (desktop + phone) |
| `data.js` | Starter library: videos, tags, teachers, playlists, ladders |
| `app.js` | All behaviour |

To change the starter content, edit `data.js`. Each video has `section`, `level`, `feel`, `min` and `style` tags.
