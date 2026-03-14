import type { Comment, Item, Story } from "./types";

const feeds = ["news", "newest", "ask", "show", "jobs"];

export function renderStories(stories: Story[], feed: string, page: number): string {
  const items = stories
    .map(
      (story, index) => `
<tr class="athing">
  <td class="title" style="text-align:right;vertical-align:top;padding-right:4px">
    <span class="rank text-[#828282] text-[10pt] font-normal">${(page - 1) * 30 + index + 1}.</span>
  </td>
  <td class="title">
    <a href="${story.url || `#/item/${story.id}`}" class="storylink text-[10pt] text-black hover:underline">${story.title}</a>
    ${story.domain ? `<span class="text-[#828282] text-[8pt] ml-1">(${story.domain})</span>` : ""}
    <div class="subtext text-[7pt] text-[#828282] mt-0.5">
      ${story.points != null ? `${story.points} points by ` : ""}
      <span class="hnuser">${story.user ?? ""}</span>
      ${story.time_ago} |
      <a href="#/item/${story.id}" class="hover:underline">${story.comments_count}\u00a0comment${story.comments_count !== 1 ? "s" : ""}</a>
    </div>
  </td>
</tr>`,
    )
    .join('<tr class="h-2"><td colspan="2"></td></tr>');

  return `
<div class="min-h-screen bg-[#f6f6ef]">
  ${renderNav(feed)}
  <div class="w-[85%] mx-auto">
    <table class="w-full border-spacing-0">
      <tbody>
        ${items}
        <tr><td colspan="2" class="py-2 pl-8">
          ${page > 1 ? `<a href="#/${feed}/${page - 1}" class="text-[7pt] text-[#828282] hover:underline mr-4">Prev</a>` : ""}
          <a href="#/${feed}/${page + 1}" class="text-[7pt] text-[#828282] hover:underline">More</a>
        </td></tr>
      </tbody>
    </table>
  </div>
  ${renderFooter()}
</div>`;
}

export function renderItem(item: Item): string {
  return `
<div class="min-h-screen bg-[#f6f6ef]">
  ${renderNav("item")}
  <div class="w-[85%] mx-auto py-2">
    <table class="w-full">
      <tbody>
        <tr class="athing">
          <td class="title">
            <a href="${item.url || "#"}" class="storylink text-[10pt] text-black hover:underline">${item.title}</a>
            ${item.domain ? `<span class="text-[#828282] text-[8pt] ml-1">(${item.domain})</span>` : ""}
            <div class="subtext text-[7pt] text-[#828282] mt-0.5">
              ${item.points ?? 0} points by
              <span class="hnuser">${item.user ?? ""}</span>
              ${item.time_ago} |
              ${item.comments_count}\u00a0comment${item.comments_count !== 1 ? "s" : ""}
            </div>
          </td>
        </tr>
        ${item.content ? `<tr><td class="py-2 text-[9pt]">${item.content}</td></tr>` : ""}
      </tbody>
    </table>
    <div class="mt-4 space-y-1">
      ${item.comments.map((c) => renderComment(c, 0)).join("")}
    </div>
  </div>
  ${renderFooter()}
</div>`;
}

function renderComment(comment: Comment, depth: number): string {
  const indent = depth * 40;
  return `
<div style="margin-left:${indent}px" class="py-1 border-t border-[#e6e6df]">
  <div class="text-[7pt] text-[#828282] mb-1">
    <a class="hnuser font-bold text-[#3c3c3c] hover:underline">${comment.user ?? "deleted"}</a>
    &nbsp;${comment.time_ago}
  </div>
  <div class="text-[9pt] commtext">${comment.content}</div>
  ${comment.comments.map((c) => renderComment(c, depth + 1)).join("")}
</div>`;
}

function renderNav(activeFeed: string): string {
  const links = feeds
    .map(
      (f) =>
        `<a href="#/${f}" class="text-black text-[10pt] hover:underline${f === activeFeed ? " font-bold" : ""}">${f}</a>`,
    )
    .join(" | ");
  return `
<header class="bg-[#ff6600] px-1 py-[2px]">
  <div class="w-[85%] mx-auto flex items-center gap-2">
    <a href="#/news" class="font-bold text-white border border-black/50 px-1 text-[10pt] mr-1 bg-white/10">Y</a>
    <a href="#/news" class="font-bold text-black text-[10pt] mr-2">Hacker News</a>
    <nav class="flex gap-2 text-[10pt]">${links}</nav>
    <div class="ml-auto">
      <a href="#" class="text-black text-[10pt] hover:underline">login</a>
    </div>
  </div>
</header>`;
}

function renderFooter(): string {
  return `
<footer class="border-t-2 border-[#ff6600] mt-6 py-3 text-center text-[8pt] text-[#828282]">
  <div class="w-[85%] mx-auto space-x-3">
    <a href="#" class="hover:underline">Guidelines</a>
    <a href="#" class="hover:underline">FAQ</a>
    <a href="#" class="hover:underline">Lists</a>
    <a href="#" class="hover:underline">API</a>
    <a href="#" class="hover:underline">Security</a>
    <a href="#" class="hover:underline">Legal</a>
    <a href="#" class="hover:underline">Contact</a>
    <a href="#" class="hover:underline">Search</a>
  </div>
</footer>`;
}
