import { fetchStories } from "./api";
import { renderStories } from "./render";
import "./style.css";

const app = document.getElementById("app");

async function main() {
  const stories = await fetchStories("news", 1);
  if (app) {
    app.innerHTML = renderStories(stories);
  }
}

main();
