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
      const item = await fetchItem(id);
      if (app) {
        app.innerHTML = renderItem(item);
      }
    } else {
      const feed = parts[0] || "news";
      const page = parseInt(parts[1]) || 1;
      const stories = await fetchStories(feed, page);
      if (app) {
        app.innerHTML = renderStories(stories, feed, page);
      }
    }
  } catch (error) {
    if (app) {
      app.innerHTML = `<p>Error loading content. Please try again later.</p>
      <button onclick="navigate()">Try Again</button>`;
      document.querySelector("button")?.addEventListener("click", navigate);
    }
  }
}

window.addEventListener("hashchange", navigate);
navigate();
