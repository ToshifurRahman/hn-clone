# Build a Hacker News Clone — TypeScript + Vite + Tailwind

> A beginner-friendly, step-by-step project guide.
> **Stack:** TypeScript · Vite · Tailwind CSS · Hacker News PWA API
> **No other dependencies.**

---

## How This Guide Works

Each subtask is a self-contained milestone. Finish one before moving to the next.
Every subtask has:

1. **What you'll learn** — the core TypeScript / web concept.
2. **Steps** — exactly what to do.
3. **Coding hints** — 2-3 lines to nudge you in the right direction.
4. **Learn more** — links to deepen your understanding.

---

## API Reference (keep this open in a tab)

Base URL: `https://api.hnpwa.com/v0`

| Endpoint          | Returns                          |
| ----------------- | -------------------------------- |
| `/news/1.json`    | Page 1 of top stories (30 items) |
| `/newest/1.json`  | Page 1 of newest stories         |
| `/ask/1.json`     | Page 1 of Ask HN                 |
| `/show/1.json`    | Page 1 of Show HN                |
| `/jobs/1.json`    | Page 1 of jobs                   |
| `/item/{id}.json` | Single item with comments        |

Each **story item** looks like:

```json
{
  "id": 123,
  "title": "Some title",
  "points": 42,
  "user": "username",
  "time_ago": "3 hours ago",
  "comments_count": 12,
  "url": "https://example.com",
  "domain": "example.com"
}
```

Each **comment** inside `/item/{id}.json` looks like:

```json
{
  "id": 456,
  "user": "someone",
  "time_ago": "1 hour ago",
  "content": "<p>HTML string</p>",
  "comments": [
    /* nested replies */
  ]
}
```

Full docs → https://github.com/davideast/hnpwa-api

---

## Subtask 0 — Project Setup

### What you'll learn

How Vite scaffolds a TypeScript project, what `tsconfig.json` does, and how to add Tailwind.

### Steps

1. Open your terminal and run:
   ```bash
   bun create vite@latest hn-clone -- --template vanilla-ts
   cd hn-clone
   bun install
   ```
2. Install Tailwind CSS (v4 works with Vite out of the box):
   ```bash
   bun install tailwindcss @tailwindcss/vite
   ```
3. Open `vite.config.ts` (create it if it doesn't exist) and register the plugin:

   ```ts
   import { defineConfig } from "vite";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [tailwindcss()],
   });
   ```

4. Replace the contents of `src/style.css` with a single line:
   ```css
   @import "tailwindcss";
   ```
5. Clean up `src/main.ts` — remove all the demo code. Just keep:
   ```ts
   import "./style.css";
   console.log("HN Clone ready!");
   ```
6. Delete `src/counter.ts` and the `src/typescript.svg` file — you won't need them.
7. Run `npm run dev` and open `http://localhost:5173`. You should see a blank page with the console message.

### Coding hints

```ts
// After cleanup, your main.ts is the entry point for everything.
// The "#app" div in index.html is where you'll render all content.
const app = document.querySelector<HTMLDivElement>("#app")!;
```

### Learn more

- Vite Getting Started → https://vite.dev/guide/
- TypeScript for JS Programmers → https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- Tailwind v4 + Vite → https://tailwindcss.com/docs/installation/vite

---

## Subtask 1 — Define TypeScript Types for the API

### What you'll learn

How to create `interface` and `type` to describe the shape of data. This is the #1 reason to use TypeScript.

### Steps

1. Create a new file `src/types.ts`.
2. Define an interface for a **Story** (the items returned by `/news/1.json` etc.).
3. Define an interface for a **Comment** (nested inside `/item/{id}.json`).
4. Define an interface for an **Item** (the full single-item response — it has a `comments` array).
5. Export all three interfaces.

### Coding hints

```ts
// src/types.ts
export interface Story {
  id: number;
  title: string;
  points: number | null;
  user: string | null;
  time_ago: string;
  comments_count: number;
  url: string;
  domain: string;
}

// Comment has nested comments — this is a "recursive type"
export interface Comment {
  id: number;
  user: string;
  time_ago: string;
  content: string;
  comments: Comment[]; // <-- recursion!
}
```

### Learn more

- TS Interfaces → https://www.typescriptlang.org/docs/handbook/2/objects.html
- Union types (`string | null`) → https://www.typescriptlang.org/docs/handbook/2/narrowing.html

---

## Subtask 2 — Fetch Data with Type-Safe Functions

### What you'll learn

How to use `fetch()`, `async/await`, and **generics** to write reusable API helpers.

### Steps

1. Create `src/api.ts`.
2. Write a generic helper function that fetches JSON from any URL and returns a typed result.
3. Write specific functions: `fetchStories(feed, page)` and `fetchItem(id)`.
4. Test them in `main.ts` by logging the result to the console.

### Coding hints

```ts
// A generic fetch helper — notice the <T> generic parameter
const API_BASE = "https://api.hnpwa.com/v0";

export async function fetchStories(
  feed: string,
  page: number = 1,
): Promise<Story[]> {
  const res = await fetch(`${API_BASE}/${feed}/${page}.json`);
  return res.json(); // TypeScript now knows the return type
}

// Quick test in main.ts:
// fetchStories("news").then(stories => console.log(stories));
```

### Learn more

- Fetch API → https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Async / Await → https://javascript.info/async-await
- TS Generics → https://www.typescriptlang.org/docs/handbook/2/generics.html

---

## Subtask 3 — Render the Story List to the DOM

### What you'll learn

How to create HTML elements from TypeScript, use `innerHTML` vs `createElement`, and work with template literals.

### Steps

1. Create `src/render.ts`.
2. Write a function `renderStories(stories: Story[]): string` that takes an array of stories and returns an HTML string.
3. Each story should show: rank number, title (linked), domain, points, user, time, and comment count.
4. In `main.ts`, call `fetchStories`, then set `app.innerHTML` to the result of `renderStories`.

### Coding hints

```ts
// Building HTML with template literals is the simplest approach
export function renderStories(stories: Story[]): string {
  return stories
    .map(
      (story, index) =>
        `<div>
         <span>${index + 1}.</span>
         <a href="${story.url}">${story.title}</a>
         <span>${story.domain}</span>
       </div>`,
    )
    .join("");
}

// In main.ts — wire it together:
// app.innerHTML = renderStories(stories);
```

### Learn more

- Template Literals → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
- Array `.map()` → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- `innerHTML` → https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML

---

## Subtask 4 — Build a Simple Router (Hash-Based)

### What you'll learn

How single-page apps handle navigation without page reloads, using the `hashchange` event.

### Steps

1. Create `src/router.ts`.
2. Use hash-based routing (the simplest approach): `#/news`, `#/newest`, `#/ask`, `#/show`, `#/jobs`, `#/item/123`.
3. Listen for the `hashchange` event on `window`.
4. Parse `window.location.hash` to decide which page to show.
5. Create a `navigate()` function that reads the hash and calls the right render logic.

### Coding hints

```ts
// Parse the hash to figure out the current "route"
export function getCurrentRoute(): { page: string; id?: number } {
  const hash = window.location.hash || "#/news"; // default
  const parts = hash.replace("#/", "").split("/"); // ["item", "123"] or ["news"]
  if (parts[0] === "item") return { page: "item", id: Number(parts[1]) };
  return { page: parts[0] || "news" };
}

// Listen for changes:
// window.addEventListener("hashchange", () => navigate());
```

### Learn more

- Hash routing explained → https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
- `location.hash` → https://developer.mozilla.org/en-US/docs/Web/API/Location/hash

---

## Subtask 5 — Render the Item Detail Page (with Comments)

### What you'll learn

How to handle **recursive data structures** — each comment can have nested child comments.

### Steps

1. In `render.ts`, add a function `renderItem(item)` that shows the story title, metadata, and all comments.
2. Add a `renderComment(comment)` function that calls itself for each child comment (recursion).
3. Indent nested comments so the thread structure is visible.
4. Wire it into your router: when the route is `item/{id}`, fetch the item and render it.

### Coding hints

```ts
// Recursion in action — a comment renders its own children
function renderComment(comment: Comment, depth: number = 0): string {
  const indent = depth * 24; // pixels of left margin per nesting level
  return `
    <div style="margin-left: ${indent}px">
      <p><strong>${comment.user}</strong> ${comment.time_ago}</p>
      <div>${comment.content}</div>
      ${comment.comments.map((c) => renderComment(c, depth + 1)).join("")}
    </div>`;
}
```

### Learn more

- Recursion in JS → https://javascript.info/recursion
- The concept of tree rendering → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

---

## Subtask 6 — Add Navigation Header & Feed Switching

### What you'll learn

How to build a persistent UI element (the nav bar) and handle click events declaratively.

### Steps

1. In `render.ts`, add a `renderNav()` function that returns an HTML string for the top navigation bar.
2. Include links for: Top, New, Ask, Show, Jobs — each pointing to a hash route.
3. Call `renderNav()` at the top of every page render so the nav is always visible.
4. Highlight the currently active link based on the current route.

### Coding hints

```ts
const feeds = ["news", "newest", "ask", "show", "jobs"];

export function renderNav(activeFeed: string): string {
  const links = feeds
    .map(
      (f) =>
        `<a href="#/${f}" class="${f === activeFeed ? "font-bold" : ""}">${f}</a>`,
    )
    .join(" | ");
  return `<nav>${links}</nav>`;
}
```

### Learn more

- Anchor tags with hash → https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
- Event delegation → https://javascript.info/event-delegation

---

## Subtask 7 — Add Pagination

### What you'll learn

How to manage **state** (current page number) and update the URL accordingly.

### Steps

1. Modify your hash routes to include a page number: `#/news/1`, `#/news/2`, etc.
2. Update `getCurrentRoute()` to parse the page number (default to 1).
3. Add "Previous" and "Next" buttons below the story list.
4. Each button should change the hash, which triggers the router to re-fetch and re-render.

### Coding hints

```ts
// Updated route parsing
const parts = hash.replace("#/", "").split("/"); // ["news", "2"]
const page = parts[1] ? Number(parts[1]) : 1;

// Pagination buttons
export function renderPagination(feed: string, page: number): string {
  const prev = page > 1 ? `<a href="#/${feed}/${page - 1}">← Prev</a>` : "";
  const next = `<a href="#/${feed}/${page + 1}">Next →</a>`;
  return `<div>${prev} ${next}</div>`;
}
```

### Learn more

- Vite env & state → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
- URL as state → https://developer.mozilla.org/en-US/docs/Web/API/URL

---

## Subtask 8 — Loading & Error States

### What you'll learn

How to handle real-world async scenarios: loading indicators, network errors, and empty data.

### Steps

1. Before fetching, show a "Loading…" message inside `#app`.
2. Wrap your `fetch` calls in `try/catch` to handle network errors.
3. If the fetch fails, show a friendly error message with a "Retry" button.
4. If the API returns an empty array, show "No stories found."

### Coding hints

```ts
async function loadFeed(feed: string, page: number): Promise<void> {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = renderNav(feed) + `<p>Loading...</p>`;
  try {
    const stories = await fetchStories(feed, page);
    app.innerHTML =
      renderNav(feed) + renderStories(stories) + renderPagination(feed, page);
  } catch (error) {
    app.innerHTML =
      renderNav(feed) + `<p>Something went wrong. <a href="">Retry</a></p>`;
  }
}
```

### Learn more

- Try/Catch → https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
- Error handling patterns → https://javascript.info/try-catch

---

## Subtask 9 — Style with Tailwind CSS

### What you'll learn

Utility-first CSS — how to style entirely with class names, no custom CSS files needed.

### Steps

Now that everything works, go back through your render functions and add Tailwind classes. Here is a suggested approach for each section:

#### 9a — Page Layout & Nav Bar

- Wrap the whole app in a centered container with a max width.
- Style the nav bar with an orange background (Hacker News signature color).
- Make nav links white, bold, and spaced out.

```ts
// Nav example
`<nav class="bg-orange-500 text-white px-4 py-2 flex items-center gap-4 text-sm font-medium">
   <span class="font-bold text-base">HN</span>
   ${links}
 </nav>`
// Outer container in main.ts
`<div class="max-w-3xl mx-auto bg-gray-50 min-h-screen">${content}</div>`;
```

#### 9b — Story List Items

- Show rank number, title, and domain on the first line.
- Show points, user, time, and comment count on a second line in smaller, gray text.

```ts
`<div class="px-4 py-3 border-b border-gray-200">
   <div class="flex items-baseline gap-2">
     <span class="text-gray-400 text-sm w-6 text-right shrink-0">${i + 1}.</span>
     <a href="${story.url}" class="text-gray-900 hover:underline text-sm leading-snug">
       ${story.title}
     </a>
     <span class="text-xs text-gray-400 shrink-0">(${story.domain})</span>
   </div>
   <div class="text-xs text-gray-500 ml-8 mt-1">
     ${story.points} points by ${story.user} ${story.time_ago}
     | <a href="#/item/${story.id}" class="hover:underline">${story.comments_count} comments</a>
   </div>
 </div>`;
```

#### 9c — Item Detail & Comments

- Style the item header area with spacing and a border.
- Indent nested comments using Tailwind's `ml-` (margin-left) utilities.
- Add subtle left borders to show thread depth.

```ts
// Comment
`<div class="ml-${Math.min(depth * 4, 16)} pl-4 border-l-2 border-gray-200 mt-3">
   <div class="text-xs text-gray-500">${comment.user} · ${comment.time_ago}</div>
   <div class="text-sm text-gray-800 mt-1 prose-sm">${comment.content}</div>
   ${comment.comments.map((c) => renderComment(c, depth + 1)).join("")}
 </div>`;
```

> **Note on dynamic classes:** Tailwind v4 detects classes at build time. If you
> build class names dynamically like `` `ml-${value}` ``, they won't be found.
> Instead, pick from a fixed set:
>
> ```ts
> const indents = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16"];
> const indentClass = indents[Math.min(depth, 4)];
> ```

#### 9d — Pagination Buttons

- Center the buttons with spacing.
- Style them as simple text links or small pill buttons.

```ts
`<div class="flex justify-center gap-6 py-4 text-sm text-orange-600 font-medium">
   ${prev} ${next}
 </div>`;
```

#### 9e — Loading & Error States

- Center the loading text vertically.
- Style the error state with a subtle red background.

```ts
// Loading
`<p class="text-center text-gray-400 py-12">Loading...</p>`
// Error
`<div class="text-center py-12">
   <p class="text-red-500 mb-2">Failed to load stories.</p>
   <a href="" class="text-orange-500 underline">Retry</a>
 </div>`;
```

### Learn more

- Tailwind CSS Docs → https://tailwindcss.com/docs
- Flexbox utilities → https://tailwindcss.com/docs/display#flex
- Spacing / sizing → https://tailwindcss.com/docs/padding
- Colors → https://tailwindcss.com/docs/customizing-colors

---

## Final File Structure

```
hn-clone/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts        ← entry point, wires everything together
│   ├── style.css       ← just the Tailwind import
│   ├── types.ts        ← Story, Comment, Item interfaces
│   ├── api.ts          ← fetch helpers
│   ├── render.ts       ← all HTML-building functions
│   └── router.ts       ← hash-based routing logic
```

---

## Bonus Challenges (After You Finish)

If you want to keep learning, try these:

- **Relative time**: Replace `time_ago` with your own function using `Date.now()`.
- **Local storage favorites**: Let users save stories and view them on a `#/favorites` page.
- **Dark mode**: Add a toggle that swaps Tailwind's `dark:` variant classes.
- **Search**: Add a search bar that filters stories client-side by title.
- **Infinite scroll**: Replace pagination with `IntersectionObserver` to load more stories on scroll.

---

## Quick Reference — Key TypeScript Concepts Used

| Concept                | Where you used it                                |
| ---------------------- | ------------------------------------------------ |
| `interface`            | `types.ts` — describing API data shapes          |
| Generics `<T>`         | `api.ts` — reusable fetch helper                 |
| `async / await`        | `api.ts`, `main.ts` — all data fetching          |
| Union types            | `string \| null` in Story fields                 |
| Recursive types        | `Comment.comments: Comment[]`                    |
| Template literals      | `render.ts` — building HTML strings              |
| Type narrowing         | Checking if `story.user` exists before rendering |
| Module imports/exports | Every file — `import` / `export`                 |

---

_Happy hacking! Read the error messages, check the TypeScript compiler output, and use `console.log` liberally. That's how everyone learns._
