import { describe, expect, it } from "vitest";
import { renderItem, renderStories } from "../render";
import type { Comment, Item, Story } from "../types";

const makeStory = (overrides: Partial<Story> = {}): Story => ({
  id: 1,
  title: "Test Story Title",
  points: 100,
  user: "testuser",
  time: 1000000,
  time_ago: "2 hours ago",
  comments_count: 5,
  type: "story",
  url: "https://example.com",
  domain: "example.com",
  ...overrides,
});

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: 10,
  points: null,
  user: "commenter",
  time: 1000000,
  time_ago: "1 hour ago",
  type: "comment",
  content: "<p>Test comment content</p>",
  comments: [],
  ...overrides,
});

describe("renderStories", () => {
  it("renders story title", () => {
    const html = renderStories([makeStory()], "news", 1);
    expect(html).toContain("Test Story Title");
  });

  it("renders story URL", () => {
    const html = renderStories([makeStory({ url: "https://example.com" })], "news", 1);
    expect(html).toContain("https://example.com");
  });

  it("renders domain in parentheses", () => {
    const html = renderStories([makeStory({ domain: "example.com" })], "news", 1);
    expect(html).toContain("(example.com)");
  });

  it("renders correct rank number for page 1", () => {
    const stories = [makeStory({ id: 1 }), makeStory({ id: 2, title: "Second" })];
    const html = renderStories(stories, "news", 1);
    expect(html).toContain(">1.<");
    expect(html).toContain(">2.<");
  });

  it("offsets rank numbers for page 2", () => {
    const stories = [makeStory()];
    const html = renderStories(stories, "news", 2);
    expect(html).toContain(">31.<");
  });

  it("renders points and user", () => {
    const html = renderStories([makeStory({ points: 250, user: "alice" })], "news", 1);
    expect(html).toContain("250 points by");
    expect(html).toContain("alice");
  });

  it("renders comment count with link to item", () => {
    const html = renderStories([makeStory({ id: 42, comments_count: 17 })], "news", 1);
    expect(html).toContain("#/item/42");
    expect(html).toContain("17");
  });

  it("renders More link", () => {
    const html = renderStories([makeStory()], "news", 1);
    expect(html).toContain("#/news/2");
    expect(html).toContain("More");
  });

  it("renders Prev link only on page > 1", () => {
    const page1 = renderStories([makeStory()], "news", 1);
    expect(page1).not.toContain("Prev");

    const page2 = renderStories([makeStory()], "news", 2);
    expect(page2).toContain("Prev");
    expect(page2).toContain("#/news/1");
  });

  it("renders navigation with all feeds", () => {
    const html = renderStories([makeStory()], "news", 1);
    expect(html).toContain("#/news");
    expect(html).toContain("#/newest");
    expect(html).toContain("#/ask");
    expect(html).toContain("#/show");
    expect(html).toContain("#/jobs");
  });

  it("highlights active feed in nav", () => {
    const html = renderStories([makeStory()], "ask", 1);
    expect(html).toContain('href="#/ask"');
  });

  it("handles story with null points", () => {
    const html = renderStories([makeStory({ points: null })], "news", 1);
    expect(html).toBeDefined();
  });

  it("handles story with no domain", () => {
    const html = renderStories([makeStory({ domain: "" })], "news", 1);
    expect(html).not.toContain("()");
  });

  it("renders HN header with Y logo", () => {
    const html = renderStories([makeStory()], "news", 1);
    expect(html).toContain("Hacker News");
    expect(html).toContain(">Y<");
  });

  it("renders footer", () => {
    const html = renderStories([makeStory()], "news", 1);
    expect(html).toContain("Guidelines");
    expect(html).toContain("FAQ");
  });
});

describe("renderItem", () => {
  const makeItem = (overrides: Partial<Item> = {}): Item => ({
    ...makeStory(),
    content: "<p>Article content here</p>",
    comments: [],
    ...overrides,
  });

  it("renders item title", () => {
    const html = renderItem(makeItem({ title: "My Article" }));
    expect(html).toContain("My Article");
  });

  it("renders item URL", () => {
    const html = renderItem(makeItem({ url: "https://test.com" }));
    expect(html).toContain("https://test.com");
  });

  it("renders item content", () => {
    const html = renderItem(makeItem({ content: "<p>Body text</p>" }));
    expect(html).toContain("<p>Body text</p>");
  });

  it("renders comments", () => {
    const comment = makeComment({ user: "alice", content: "<p>Great post!</p>" });
    const html = renderItem(makeItem({ comments: [comment] }));
    expect(html).toContain("alice");
    expect(html).toContain("Great post!");
  });

  it("renders nested comments with indentation", () => {
    const nested = makeComment({ user: "bob", content: "<p>Reply</p>" });
    const parent = makeComment({ user: "alice", comments: [nested] });
    const html = renderItem(makeItem({ comments: [parent] }));
    expect(html).toContain("margin-left:40px");
    expect(html).toContain("bob");
  });

  it("handles deleted user in comments", () => {
    const comment = makeComment({ user: null });
    const html = renderItem(makeItem({ comments: [comment] }));
    expect(html).toContain("deleted");
  });

  it("renders plural comments label", () => {
    const html = renderItem(makeItem({ comments_count: 5 }));
    expect(html).toContain("5\u00a0comments");
  });

  it("renders singular comment label", () => {
    const html = renderItem(makeItem({ comments_count: 1 }));
    expect(html).toContain("1\u00a0comment");
    expect(html).not.toContain("1\u00a0comments");
  });

  it("renders nav with item not highlighted as feed", () => {
    const html = renderItem(makeItem());
    expect(html).toContain("Hacker News");
  });

  it("handles empty comments array", () => {
    const html = renderItem(makeItem({ comments: [] }));
    expect(html).toBeDefined();
  });

  it("handles item with no content", () => {
    const html = renderItem(makeItem({ content: "" }));
    expect(html).toBeDefined();
  });
});
