import { fetchItem, fetchStories } from "./api";
import { renderItem, renderStories } from "./render";

const app = document.getElementById("app");

export async function navigate() {
  const hash = location.hash;
  const path = hash.slice(1);
  const parts = path.split("/").filter(Boolean);
  try {
    if (app) app.innerHTML = "<p>Loading...</p>";
    if (parts[0] === "item") {
      const id = Number(parts[1]);
      if (!Number.isInteger(id) || id <= 0) {
        if (app) app.innerHTML = "<p>Invalid item id.</p>";
        return;
      }
      const item = await fetchItem(id);
      if (app) {
        app.innerHTML = renderItem(item);
      }
    } else {
      const feed = parts[0] || "news";
      const page = parseInt(parts[1]) || 1;
      if (!Number.isInteger(page) || page <= 0) {
        if (app) app.innerHTML = "<p>Invalid page number.</p>";
        return;
      }
      const stories = await fetchStories(feed, page);
      if (app) {
        app.innerHTML = renderStories(stories, feed, page);
      }
    }
  } catch (error) {
    if (app) {
      app.innerHTML = `<p>Error loading content. Please try again later.</p>
      <button id="retry-btn">Try Again</button>`;
      document.getElementById("retry-btn")?.addEventListener("click", navigate);
    }
  }
}

window.addEventListener("hashchange", navigate);
navigate();
