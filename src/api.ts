import type { Item, Story } from "./types";

const BASE_URL = "https://api.hnpwa.com/v0";

async function fetchData<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`);
  return res.json();
}

export async function fetchStories(
  feed: string,
  page: number = 1,
): Promise<Story[]> {
  return await fetchData(`${feed}/${page}.json`);
}

export async function fetchItem(id: number): Promise<Item> {
  return await fetchData(`item/${id}.json`);
}
