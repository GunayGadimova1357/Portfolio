import {NextResponse} from "next/server";
import {
  deleteAboutTechnology,
  updateAboutTechnology,
} from "@/lib/about";
import {requireAdminSession} from "@/lib/auth";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseTechnologyPayload} from "@/lib/dashboard/about-payload";

export async function PUT(
  request: Request,
  {params}: {params: Promise<{technologyId: string}>},
) {
  try {
    await requireAdminSession();
    const {technologyId} = await params;
    const technology = parseTechnologyPayload(await request.json());

    await updateAboutTechnology(technologyId, technology);

    return NextResponse.json({technology});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  {params}: {params: Promise<{technologyId: string}>},
) {
  try {
    await requireAdminSession();
    const {technologyId} = await params;
    await deleteAboutTechnology(technologyId);

    return NextResponse.json({ok: true});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
