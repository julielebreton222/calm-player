# My Calm Player

A calm, distraction-free player for yoga, calisthenics, flexibility, Pilates, dance and soundscapes: only the classes you love, without comments, recommendations or the YouTube feed.

Plain HTML, CSS and JavaScript. There's no build step and nothing to install.

## Run it

- **Online:** turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). The app will live at `https://<your-username>.github.io/calm-player/`.
- **On your computer:** serve the folder, e.g. `python3 -m http.server`, then open http://localhost:8000.
  Opening `index.html` directly as a file mostly works, but YouTube refuses to play embeds from `file://` pages.

## What's inside

- **Mood filters:** Gentle / Flow / Strong / Rest & breathe, ~15 / ~30 / 60+ min, Beginner / Intermediate.
- **Player:** embedded YouTube player (privacy-enhanced mode), with Keep ♡, Add to playlist, and a **soundscape underneath** with its own volume.
- **Playlists:** Up next queue, play a whole playlist (auto-advances), plus create, rename, reorder and delete.
- **My yoga path:** teachers marked To try / Trying / Kept / Not for me. After a class there's a "how was it?" rating and a "What I loved in India" note to compare against.
- **Calisthenics ladders:** Push, Pull, Legs and Core progressions. Log reps and move up a step.
- **Sections:** Yoga, Calisthenics, Flexibility, Pilates (no equipment), Dance (no equipment), Soundscapes. 48 starter videos, each checked against YouTube.
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
