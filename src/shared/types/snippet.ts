import type { User, Comment } from ".";

export type Snippet = {
  id: number;
  language: Languages;
  code: string;
  user: User;
  marks: Mark[];
  comments: Comment[];
};

type Mark = {
  id: number;
  type: MarkType;
  user: User;
};

export enum MarkType {
  LIKE = "like",
  DISLIKE = "dislike",
  NONE = "none",
}

export enum Languages {
  "JavaScript" = "JavaScript",
  "Python" = "Python",
  "Java" = "Java",
  "C/C++" = "C/C++",
  "C#" = "C#",
  "Go" = "Go",
  "Kotlin" = "Kotlin",
  "Ruby" = "Ruby",
}
