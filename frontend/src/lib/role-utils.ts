export type UserRole = "patient" | "doctor" | "admin";

export interface UserLike {
  role?: UserRole | string;
}

export function getDashboardPath(user: UserLike | null | undefined, isAuthenticated: boolean): string {
  if (!isAuthenticated) return "/";
  if (user?.role === "admin") return "/app/admin";
  if (user?.role === "doctor") return "/app";
  return "/app";
}
