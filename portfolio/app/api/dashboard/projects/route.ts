import {NextRequest, NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/auth";
import {createProject, getAllProjects} from "@/lib/projects";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseProjectPayload} from "@/lib/dashboard/projects";

export async function GET() {
  try {
    await requireAdminSession();
    return NextResponse.json({projects: await getAllProjects()});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const project = parseProjectPayload(await request.json());
    const projects = await createProject(project);

    return NextResponse.json(
      {
        project: projects.find((item) => item.id === project.id) ?? project,
        projects,
      },
      {status: 201},
    );
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
