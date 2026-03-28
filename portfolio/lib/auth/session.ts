import {getServerSession} from "next-auth/next";
import {authOptions} from "./config";

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";

  if (!session || sessionEmail !== getAdminEmail()) {
    return null;
  }

  return session;
}

export async function isAdminSession() {
  return (await getAdminSession()) !== null;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
