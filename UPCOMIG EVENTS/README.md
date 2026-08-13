# Onam 2026 — University Cultural Festival Website

## Quick Start
Just open `index.html` in any modern browser. No build step required.

---

## Drop Your Assets Here

| Asset | Path | Notes |
|---|---|---|
| Loading video | `assets/loading/loading-video.mp4` | Cinematic preloader. Autoplays, muted. |
| Hero background | `assets/hero/hero-bg.jpg` | Full-screen background image |
| Heading video | `assets/hero/heading.mp4` | Your event name video. Loops silently. |
| Float element 1 | `assets/hero/elem1.png` | Optional — SVG lamp used as fallback |
| Float element 2 | `assets/hero/elem2.png` | Optional — SVG pookalam used as fallback |
| About GIF | `assets/about/about-character.gif` | 500px+ animated character |
| Snapshot photos | `assets/snapshots/photo1.jpg` … | Add as many as you want |
| Coordinator photos | `assets/coordinators/name.jpg` | Linked from js/data.js |

---

## Edit Content

All content lives in **`js/data.js`** — edit it to update:
- Event name, date, venue
- Upcoming events (add/remove cards)
- Coordinators (add names, positions, photos, social links)
- Snapshot photo paths
- About text

### Adding a coordinator photo
```js
{
  name: "John Doe",
  position: "Festival Director",
  department: "CS Department",
  photo: "assets/coordinators/john.jpg",  // ← add photo path here
  instagram: "https://instagram.com/...",
  linkedin: "https://linkedin.com/in/...",
}
```

### Adding snapshot photos
```js
snapshots: [
  "assets/snapshots/photo1.jpg",
  "assets/snapshots/photo2.jpg",
  // add more...
],
```

---

## Connecting the Registration Form

The form in `js/sections.js` has a comment block where you connect your backend:

```js
// ── Connect your backend here ──────────────────────────
// Example: fetch('/api/register', { method: 'POST', body: new FormData(form) })
// Or: emailjs.send(...), Formspree, Google Apps Script, etc.
// ──────────────────────────────────────────────────────
```

**Easiest option:** Use [Formspree](https://formspree.io) — add `action="https://formspree.io/f/YOUR_ID"` to the `<form>` tag and remove `e.preventDefault()`.

---

## File Structure
```
onam-fest/
├── index.html              ← Main page
├── css/
│   ├── globals.css         ← Design tokens, utilities
│   ├── loading-header.css  ← Loading screen + header + sidebar
│   ├── hero.css            ← Hero, countdown, floating elements
│   ├── about.css           ← About section + 3D glass
│   ├── snapshot.css        ← Film roll gallery
│   └── sections.css        ← Events, Register, Coordinators, Footer
├── js/
│   ├── data.js             ← ★ EDIT THIS — all your content
│   ├── loading.js          ← Loading screen controller
│   ├── header.js           ← Sticky header + sidebar
│   ├── countdown.js        ← Live countdown timer
│   ├── snapshot.js         ← Film roll builder
│   ├── sections.js         ← Dynamic events/coordinators/form
│   ├── about-tilt.js       ← 3D mouse-tilt on About glass
│   └── scroll-reveal.js    ← Intersection Observer reveals
└── assets/
    ├── loading/            ← loading-video.mp4
    ├── hero/               ← hero-bg.jpg, heading.mp4, elem1.png, elem2.png
    ├── about/              ← about-character.gif
    ├── snapshots/          ← photo1.jpg, photo2.jpg, ...
    └── coordinators/       ← coord photos
```
