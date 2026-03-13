import { fetchItem, fetchStories } from "./api";
import { renderItem, renderStories } from "./render";

const app = document.getElementById("app");

async function navigate() {
  const hash = location.hash;
  const path = hash.slice(1);
  const parts = path.split("/");

  if (parts[0] === "item") {
    const id = Number(parts[1]);
    const item = await fetchItem(id);
    if (app) {
      app.innerHTML = renderItem(item);
    }
  } else {
    const feed = parts[0] || "news";
    const stories = await fetchStories(feed);
    if (app) {
      app.innerHTML = renderStories(stories);
    }
  }
}

window.addEventListener("hashchange", navigate);
navigate();
