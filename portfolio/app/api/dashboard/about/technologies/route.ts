import {NextRequest, NextResponse} from "next/server";
import {createAboutTechnology} from "@/lib/about";
import {requireAdminSession} from "@/lib/auth";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseTechnologyPayload} from "@/lib/dashboard/about-payload";

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const technology = parseTechnologyPayload(await request.json());
    const technologies = await createAboutTechnology(technology);

    return NextResponse.json(
      {
        technology: technologies.find((item) => item.id === technology.id) ?? technology,
        technologies,
      },
      {status: 201},
    );
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
