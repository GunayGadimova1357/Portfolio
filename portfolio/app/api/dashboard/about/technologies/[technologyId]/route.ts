import {NextRequest, NextResponse} from "next/server";
import {deleteAboutTechnology, updateAboutTechnology} from "@/lib/about";
import {requireAdminSession} from "@/lib/auth";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseTechnologyPayload} from "@/lib/dashboard/about-payload";

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{technologyId: string}>},
) {
  try {
    await requireAdminSession();
    const {technologyId} = await params;
    const technology = parseTechnologyPayload(await request.json());
    const technologies = await updateAboutTechnology(technologyId, technology);
    return NextResponse.json({
      technology: technologies.find((item) => item.id === technology.id) ?? technology,
      technologies,
    });
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  {params}: {params: Promise<{technologyId: string}>},
) {
  try {
    await requireAdminSession();
    const {technologyId} = await params;
    const technologies = await deleteAboutTechnology(technologyId);
    return NextResponse.json({ok: true, technologies});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
