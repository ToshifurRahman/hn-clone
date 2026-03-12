import type { Story } from "./types";

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
