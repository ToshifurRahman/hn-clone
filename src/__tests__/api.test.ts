import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchItem, fetchStories } from "../api";

const BASE_URL = "https://api.hnpwa.com/v0";

describe("api", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchStories", () => {
    it("fetches from correct URL with default page", async () => {
      const mockStories = [{ id: 1, title: "Test Story" }];
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockStories),
      } as Response);

      const result = await fetchStories("news");

      expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/news/1.json`);
      expect(result).toEqual(mockStories);
    });

    it("fetches from correct URL with specified page", async () => {
      const mockStories = [{ id: 2, title: "Page 2 Story" }];
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockStories),
      } as Response);

      const result = await fetchStories("newest", 3);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/newest/3.json`);
      expect(result).toEqual(mockStories);
    });

    it("supports different feed types", async () => {
      const feeds = ["news", "newest", "ask", "show", "jobs"];
      for (const feed of feeds) {
        vi.mocked(globalThis.fetch).mockResolvedValueOnce({
          json: () => Promise.resolve([]),
        } as Response);
        await fetchStories(feed, 1);
        expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/${feed}/1.json`);
      }
    });

    it("returns empty array when API returns empty", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      } as Response);

      const result = await fetchStories("ask");
      expect(result).toEqual([]);
    });
  });

  describe("fetchItem", () => {
    it("fetches item by id", async () => {
      const mockItem = { id: 42, title: "HN Post", comments: [] };
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockItem),
      } as Response);

      const result = await fetchItem(42);

      expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/item/42.json`);
      expect(result).toEqual(mockItem);
    });

    it("propagates fetch errors", async () => {
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchItem(99)).rejects.toThrow("Network error");
    });
  });
});
