import {NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/auth";
import {getAboutContent, updateAboutBio} from "@/lib/about";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseAboutBioPayload} from "@/lib/dashboard/about-payload";

export async function GET() {
  try {
    await requireAdminSession();
    const about = await getAboutContent();

    return NextResponse.json({bio: about.bio, technologies: about.technologies});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const bio = parseAboutBioPayload(await request.json());
    await updateAboutBio(bio);

    return NextResponse.json({bio});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
