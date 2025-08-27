import type { User } from ".";

export type Comment = {
  id: number;
  content: string;
  user: User;
};
