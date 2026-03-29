import {NextRequest, NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/auth";
import {deleteProject, updateProject} from "@/lib/projects";
import {createDashboardErrorResponse} from "@/lib/dashboard/api-response";
import {parseProjectPayload} from "@/lib/dashboard/projects";

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{projectId: string}>},
) {
  try {
    await requireAdminSession();
    const {projectId} = await params;
    const project = parseProjectPayload(await request.json());
    const projects = await updateProject(projectId, project);
    return NextResponse.json({
      project: projects.find((item) => item.id === project.id) ?? project,
      projects,
    });
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  {params}: {params: Promise<{projectId: string}>},
) {
  try {
    await requireAdminSession();
    const {projectId} = await params;
    const projects = await deleteProject(projectId);
    return NextResponse.json({ok: true, projects});
  } catch (error) {
    return createDashboardErrorResponse(error);
  }
}
