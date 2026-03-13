import type { Item, Story } from "./types";

export function renderStories(stories: Story[]): string {
  return stories
    .map(
      (story, index) =>
        `<div>
            <span>${index + 1}.</span>
            <a href="${story.url}">${story.title}</a>
            <span>${story.domain}</span>
            <span>${story.time_ago}</span>
            <span>${story.points ?? 0}</span>
            <span>${story.comments_count}</span>
        </div>`,
    )
    .join("");
}

export function renderItem(item: Item): string {
  return `<div>
            <a href="${item.url}">${item.title}</a>
            <span>${item.domain}</span>
            <span>${item.time_ago}</span>
            <span>${item.points ?? 0}</span>
            <span>${item.comments_count}</span>
            <span>${item.comments
              .map(
                (comment, index) =>
                  `<p>${comment.content}</p>
              <p>${comment.user ?? "Deleted User"}</p>`,
              )
              .join("")}</span>
        </div>`;
}
