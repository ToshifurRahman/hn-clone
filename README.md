# Hacker News Clone

A client-side Hacker News clone built with TypeScript, Vite, and Tailwind CSS — styled to match [news.ycombinator.com](https://news.ycombinator.com).

---

## Architecture

This is a **CSR (Client-Side Rendering)** single-page application. The server serves only static files; all data fetching, routing, and HTML generation happens in the browser.

```
Browser
  └── index.html          (empty shell)
       └── main.ts        (entry — bootstraps router)
            ├── router.ts (hash-based navigation)
            ├── api.ts    (fetch wrapper → HNPWA API)
            └── render.ts (HTML string builders + Tailwind classes)
```

### Data flow

```
hashchange / page load
  → router.ts: parse window.location.hash
  → api.ts:    fetch from api.hnpwa.com
  → render.ts: build HTML string with Tailwind classes
  → inject into <div id="app">
```

### Routing

Hash-based routing via `window.addEventListener("hashchange", navigate)`:

| Hash pattern      | Renders               |
|-------------------|-----------------------|
| `#/` or `#/news`  | Top stories (page 1)  |
| `#/news/2`        | Top stories (page 2)  |
| `#/newest`        | New stories           |
| `#/ask`           | Ask HN                |
| `#/show`          | Show HN               |
| `#/jobs`          | Jobs                  |
| `#/item/12345`    | Story + comments      |

---

## Project Structure

```
hn-clone/
├── index.html              # Entry HTML — mounts <div id="app">
├── vite.config.ts          # Vite + Tailwind CSS v4 plugin + Vitest config
├── tsconfig.json           # Strict TypeScript (ESNext, bundler resolution)
├── package.json
├── public/
└── src/
    ├── main.ts             # Entry point — imports style + router
    ├── router.ts           # Hash router, exported navigate()
    ├── api.ts              # fetchStories(feed, page), fetchItem(id)
    ├── render.ts           # renderStories(), renderItem(), renderComment()
    ├── types.ts            # Story, Item, Comment interfaces
    ├── style.css           # @import "tailwindcss"
    └── __tests__/
        ├── api.test.ts     # Unit tests — API fetch layer
        ├── render.test.ts  # Unit tests — HTML rendering
        └── router.test.ts  # Integration tests — routing logic
```

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Vite](https://vite.dev) | ^7 | Build tool & dev server |
| [TypeScript](https://typescriptlang.org) | ~5.9 | Type safety (strict mode) |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Utility-first styling |
| [Vitest](https://vitest.dev) | ^4 | Unit & integration testing |
| [jsdom](https://github.com/jsdom/jsdom) | ^28 | DOM environment for tests |

---

## API

Data is sourced from the **HNPWA API** — an unofficial Hacker News API optimised for PWAs.

- **GitHub:** [github.com/davideast/hnpwa-api](https://github.com/davideast/hnpwa-api)
- **Base URL:** `https://api.hnpwa.com/v0/`

### Endpoints used

| Endpoint | Description |
|----------|-------------|
| `GET /news/{page}.json` | Top stories |
| `GET /newest/{page}.json` | New stories |
| `GET /ask/{page}.json` | Ask HN |
| `GET /show/{page}.json` | Show HN |
| `GET /jobs/{page}.json` | Jobs |
| `GET /item/{id}.json` | Story + nested comments |

---

## Setup & Running

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Install

```bash
git clone <your-repo-url>
cd hn-clone
bun install
```

### Dev server

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
bun run build       # type-check + bundle
bun run preview     # preview the production build locally
```

Output goes to `dist/` — deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## Testing

```bash
bun run test            # run all tests once
bun run test:watch      # re-run on file changes
bun run test:coverage   # generate coverage report
```

### Test coverage

| File | Type | What's tested |
|------|------|---------------|
| `api.test.ts` | Unit | Correct URLs, feed types, page params, error propagation |
| `render.test.ts` | Unit | Story/item HTML output, rank offsets, comment nesting, edge cases |
| `router.test.ts` | Integration | Hash parsing, feed/page/item routing, loading state, error handling |
