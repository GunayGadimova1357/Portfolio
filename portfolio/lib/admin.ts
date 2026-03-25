import {getServerSession} from "next-auth/next";
import {authOptions} from "@/auth";

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export async function isAdminSession() {
  const session = await getServerSession(authOptions);

  return session?.user?.email?.toLowerCase() === getAdminEmail();
}

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";

  if (!session || sessionEmail !== getAdminEmail()) {
    throw new Error("Unauthorized");
  }

  return session;
}
