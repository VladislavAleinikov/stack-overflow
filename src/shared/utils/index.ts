import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserWithStatistic } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStatistic(
  statistic: UserWithStatistic["statistic"]
): [string, number][] {
  const result: [string, number][] = [];

  for (let key in statistic) {
    const val = statistic[key as keyof typeof statistic];
    key = key.replace("Count", "");
    key = key.replace(/([A-Z])/g, " $1");
    result.push([key, val]);
  }

  return result;
}
