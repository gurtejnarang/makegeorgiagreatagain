# Georgia Unleashed — USA First Lab

A policy vision website for bold leadership in Georgia.

## Stack

- React 18
- Vite 5
- Google Fonts (Big Shoulders Display, Fraunces, Public Sans)
- CSS-in-JS (inline styles, no external CSS framework)

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json` scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Add `base` to `vite.config.js`:
```js
base: '/georgia-vision/'
```

4. Run:
```bash
npm run deploy
```

## Project Structure

```
georgia-vision/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── assets/
        └── eagle-flag.png   ← USA First Lab logo
```

---

Built for USA First Lab · usafirstlab.org
