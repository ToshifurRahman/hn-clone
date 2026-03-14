import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock api module before importing router
vi.mock("../api", () => ({
  fetchStories: vi.fn(),
  fetchItem: vi.fn(),
}));

vi.mock("../render", () => ({
  renderStories: vi.fn(() => "<div>stories</div>"),
  renderItem: vi.fn(() => "<div>item</div>"),
}));

import { fetchItem, fetchStories } from "../api";
import { renderItem, renderStories } from "../render";

describe("router integration", () => {
  let app: HTMLDivElement;

  beforeEach(async () => {
    vi.resetModules();
    // Set up DOM
    document.body.innerHTML = '<div id="app"></div>';
    app = document.getElementById("app") as HTMLDivElement;

    // Reset mocks
    vi.mocked(fetchStories).mockResolvedValue([]);
    vi.mocked(fetchItem).mockResolvedValue({
      id: 1,
      title: "Test",
      points: 10,
      user: "u",
      time: 0,
      time_ago: "1h",
      comments_count: 0,
      type: "story",
      url: "https://x.com",
      domain: "x.com",
      content: "",
      comments: [],
    });
    vi.mocked(renderStories).mockReturnValue("<div>stories</div>");
    vi.mocked(renderItem).mockReturnValue("<div>item</div>");
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.location.hash = "";
  });

  it("loads news feed by default on empty hash", async () => {
    window.location.hash = "";
    const { navigate } = await import("../router");
    // Wait for the module-level navigate() to complete
    await new Promise((r) => setTimeout(r, 0));
    vi.clearAllMocks();

    await navigate();

    expect(fetchStories).toHaveBeenCalledWith("news", 1);
    expect(renderStories).toHaveBeenCalled();
  });

  it("loads correct feed from hash", async () => {
    window.location.hash = "#/ask";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));
    vi.clearAllMocks();

    await navigate();

    expect(fetchStories).toHaveBeenCalledWith("ask", 1);
  });

  it("loads correct page from hash", async () => {
    window.location.hash = "#/news/3";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));
    vi.clearAllMocks();

    await navigate();

    expect(fetchStories).toHaveBeenCalledWith("news", 3);
  });

  it("loads item when hash starts with /item/", async () => {
    window.location.hash = "#/item/12345";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));
    vi.clearAllMocks();

    await navigate();

    expect(fetchItem).toHaveBeenCalledWith(12345);
    expect(renderItem).toHaveBeenCalled();
  });

  it("sets app innerHTML to loading state initially", async () => {
    let resolveStories!: (v: unknown) => void;

    window.location.hash = "#/news";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));

    vi.mocked(fetchStories).mockReturnValueOnce(
      new Promise((res) => { resolveStories = res; })
    );

    const navPromise = navigate();

    expect(app.innerHTML).toContain("Loading");

    resolveStories([]);
    await navPromise;
  });

  it("shows error message when fetch fails", async () => {
    window.location.hash = "#/news";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));

    vi.mocked(fetchStories).mockRejectedValueOnce(new Error("Network error"));
    await navigate();

    expect(app.innerHTML).toContain("Error");
  });

  it("renders stories into app element", async () => {
    window.location.hash = "#/news";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));

    vi.mocked(renderStories).mockReturnValueOnce("<div>mocked stories</div>");
    await navigate();

    expect(app.innerHTML).toBe("<div>mocked stories</div>");
  });

  it("renders item into app element", async () => {
    window.location.hash = "#/item/1";
    const { navigate } = await import("../router");
    await new Promise((r) => setTimeout(r, 0));

    vi.mocked(renderItem).mockReturnValueOnce("<div>mocked item</div>");
    await navigate();

    expect(app.innerHTML).toBe("<div>mocked item</div>");
  });
});
