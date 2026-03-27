import {NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/admin";
import {deleteService, getAllServices, updateService} from "@/lib/services";
import type {ServiceRecord} from "@/services/types/services";

function parseServicePayload(payload: unknown): ServiceRecord {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid service payload.");
  }

  const record = payload as Record<string, unknown>;
  const id = String(record.id ?? "").trim();
  const title = String(record.title ?? "").trim();
  const description = String(record.description ?? "").trim();
  const sortOrder = Number(record.sortOrder ?? 0);
  const published = Boolean(record.published);

  if (!id || !title || !description) {
    throw new Error("All service fields are required.");
  }

  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return {
    id,
    title,
    description,
    sortOrder,
    published,
  };
}

export async function PATCH(
  request: Request,
  {params}: {params: Promise<{serviceId: string}>},
) {
  try {
    await requireAdminSession();

    const {serviceId} = await params;
    const nextService = parseServicePayload(await request.json());
    const services = await getAllServices();

    if (services.some((service) => service.id === nextService.id && service.id !== serviceId)) {
      return NextResponse.json(
        {error: "A service with this ID already exists."},
        {status: 409},
      );
    }

    await updateService(serviceId, nextService);

    return NextResponse.json({service: nextService});
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update service.",
      },
      {status: 400},
    );
  }
}

export async function DELETE(
  _request: Request,
  {params}: {params: Promise<{serviceId: string}>},
) {
  try {
    await requireAdminSession();

    const {serviceId} = await params;
    await deleteService(serviceId);

    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete service.",
      },
      {status: 400},
    );
  }
}
