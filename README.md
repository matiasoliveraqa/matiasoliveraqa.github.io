# Matías Olivera — QA & SDET Web Portfolio

A high-performance, dark agency portfolio tailored specifically for a **Senior QA Engineer & SDET**.

Built with the **Skills UI "Studio" Design System**:
- Near-black canvas with pure dark aesthetics (`#000000`).
- Slow animated aurora mesh gradient in the background as the only subtle color accent.
- Bracketed bento-grid cards with bracket corners and frosted glassmorphism.
- Interactive QA Test Runner Simulator (Playwright, API idempotency, and k6 performance SLA).
- Staggered scroll reveals and animated metric counters.
- Giant footer wordmark (`MATÍAS OLIVERA`) with parallax depth.
- Direct PDF resume download (`/Matias_Olivera_QA_CV.pdf`).

---

## 🚀 Quick Start

### 1. Development Server
```bash
cd /home/kraper/Projects/portfolio
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
```
The optimized static build is generated into the `dist/` directory.

### 3. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deploying to GitHub Pages (Free & Instant)

Since your GitHub account is `matiasoliveraqa`:

1. Create a repository on GitHub named `portfolio` (or `matiasoliveraqa.github.io` for a root domain):
```bash
git remote add origin git@github.com:matiasoliveraqa/portfolio.git
git branch -M main
git push -u origin main
```

2. Build and deploy `dist/` using GitHub Actions or GitHub Pages:
- In your GitHub repo settings: **Settings > Pages > Source > GitHub Actions** or **Deploy from a branch (`gh-pages`)**.
- The `vite.config.js` is already configured with `base: './'` for frictionless static hosting on any subpath or domain.

---

## 📂 Project Structure
```
portfolio/
├── index.html                   # Semantic HTML with Studio layout & QA sections
├── vite.config.js               # Optimized Vite configuration with relative assets
├── package.json
├── public/
│   └── Matias_Olivera_QA_CV.pdf # Direct download CV asset
└── src/
    ├── style.css                # Studio dark design system (Urbanist, Inter, JetBrains Mono)
    ├── main.js                  # Main controller (scroll reveals, counters, parallax, tabs)
    ├── aurora.js                # Fluid aurora background engine with WebGL/Canvas fallback
    ├── terminalSimulation.js    # Interactive Playwright & k6 terminal simulator
    └── artifactsData.js         # Exemplary Bug Ticket & Test Strategy data
```
