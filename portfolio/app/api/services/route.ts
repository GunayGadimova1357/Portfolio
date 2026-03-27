import {NextResponse} from "next/server";
import {requireAdminSession} from "@/lib/admin";
import {getAllServices} from "@/lib/services";

export async function GET() {
  try {
    await requireAdminSession();

    return NextResponse.json({
      services: await getAllServices(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      {status: 401},
    );
  }
}
