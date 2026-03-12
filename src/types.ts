// /news/1.json
export interface Story {
  id: number;
  title: string;
  points: number | null;
  user: string | null;
  time: number;
  time_ago: string;
  comments_count: number;
  type: string;
  url: string;
  domain: string;
}

// /item/{id}.json
export interface Comment {
  id: number;
  points: number | null;
  user: string | null;
  time: number;
  time_ago: string;
  type: string;
  content: string;
  comments: Comment[];
}

export interface Item extends Story {
  content: string;
  comments: Comment[];
}
