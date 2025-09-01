import type { Languages } from "@/shared/types";

export type SnippetRequest = {
  code: string;
  language: Languages
}