import {NextResponse} from "next/server";
import {createAboutTechnology} from "@/lib/about";
import {requireAdminSession} from "@/lib/auth";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseTechnologyPayload} from "@/lib/dashboard/about-payload";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const technology = parseTechnologyPayload(await request.json());
    await createAboutTechnology(technology);

    return NextResponse.json({technology}, {status: 201});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
