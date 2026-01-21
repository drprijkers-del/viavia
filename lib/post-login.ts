import { prisma } from "@/lib/prisma";

/**
 * Determines the canonical post-login route for a user.
 * - If user has groups -> /dashboard
 * - If user has no groups -> /dashboard/groups/new
 */
export async function getPostLoginRoute(userId: string): Promise<string> {
  const groupCount = await prisma.groupMember.count({
    where: { userId },
  });

  return groupCount > 0 ? "/dashboard" : "/dashboard/groups/new";
}

/**
 * Client-side version that accepts pre-fetched group count
 */
export function getPostLoginRouteSync(hasGroups: boolean): string {
  return hasGroups ? "/dashboard" : "/dashboard/groups/new";
}
