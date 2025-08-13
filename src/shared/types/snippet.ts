import type { User, Comment } from ".";

export type Snippet = {
  id: number;
  language: Languages;
  code: string;
  user: User;
  marks: Mark[];
  comments: Comment[]
};

type Mark = {
  id: number;
  type: MarkType;
};

enum MarkType {
  LIKE = "like",
  DISLIKE = "dislike",
  NONE = "none",
}

enum Languages {
  "JavaScript",
  "Python",
  "Java",
  "C/C++",
  "C#",
  "Go",
  "Kotlin",
  "Ruby",
}
