import type { Statistic } from "@/shared/types";

export function parseStatistic(
  statistic: Statistic
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
