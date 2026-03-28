import {NextResponse} from "next/server";

// Route handlers use the same error mapping so the client can show consistent messages.
export function createDashboardErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  const status = message === "Unauthorized" ? 401 : 400;

  return NextResponse.json({error: message}, {status});
}
