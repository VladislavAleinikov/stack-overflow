import type { User } from ".";

export type Answer = {
  id: number;
  content: string;
  isCorrect: boolean;
  user: User
};