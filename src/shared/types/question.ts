import type { Answer, User } from ".";

export type Question = {
  id: number;
  title: string;
  description: string;
  attachedCode: string;
  user: User;
  answers: Answer[];
  isResolved: false;
};
