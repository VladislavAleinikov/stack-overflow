export type User = {
  id: number;
  username: string;
  role: UserRole;
};

export type UserWithStatistic = User & { statistic: Statistic };

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export type Statistic = {
  snippetsCount: number;
  rating: number;
  commentsCount: number;
  likesCount: number;
  dislikesCount: number;
  questionsCount: number;
  correctAnswersCount: number;
  regularAnswersCount: number;
};
