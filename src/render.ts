import type { Comment, Item, Story } from "./types";

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
              .map((comment) => renderComment(comment, 0))
              .join("")}</span>
        </div>`;
}

function renderComment(comment: Comment, depth: number): string {
  const indent = depth * 24;
  return `
  <div style="margin-left: ${indent}px">
      <p><strong>${comment.user ?? "Deleted User"}</strong> ${comment.time_ago}</p>
      <div>${comment.content}</div>
      ${comment.comments.map((c) => renderComment(c, depth + 1)).join("")}
    </div>`;
}
