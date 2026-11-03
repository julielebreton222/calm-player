# My Hangout

A calm place to go instead of scrolling: my passions, a before → during → after session tracker, a journal that shows what really lifts my mood, the people who inspire me, a spell book, and all my movement classes, background sounds and offline files.

Plain HTML, CSS and JavaScript. There's no build step and nothing to install. Live at https://julielebreton222.github.io/calm-player/

## Tabs

- **Today:** "I feel the urge to scroll" button, this week's stats (time on passions, urges turned into something else, average mood lift, streak), My people, suggestions for how I feel right now, and recent sessions.
- **Passions:** 14 passions, each with tiny first steps — drawing, listening to music, making playlists, dancing, fairytales, learning about yoga, playing with dolls, morning pages, journaling, singing/humming/chanting, talking to myself out loud, nature with no phone, creating a magic spell, and a curiosity of the week. Add my own.
- **Session flow:** before (what pulled me here, the thought word for word, feelings, mood 1–10) → doing (timer, prompt, a reminder from my people, sound underneath, a place to park urges, pages/notes) → after (feelings, mood, lift, one line). Survives a reload.
- **Move:** the Calm Player — yoga, calisthenics, flexibility, Pilates, dance, soundscapes, playlists, yoga path, ladders.
- **Sounds & files:** my YouTube background playlist and My files (offline).
- **Journal:** minutes per day, what lifts me most, what pulls me toward scrolling, thoughts that come back, patterns, every session.
- **Spell book:** 12 original spells plus my own.

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
