import type {
  ServicePayload,
  ServiceResponse,
  ServicesListResponse,
} from "@/services/types/services";

async function readResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  const payload = (await response.json().catch(() => null)) as {error?: string} | null;
  throw new Error(payload?.error ?? "Request failed.");
}

export async function getServices() {
  const response = await fetch("/api/services", {
    method: "GET",
    cache: "no-store",
  });

  return readResponse<ServicesListResponse>(response);
}

export async function patchService(serviceId: string, payload: ServicePayload) {
  const response = await fetch(`/api/services/${serviceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readResponse<ServiceResponse>(response);
}

export async function removeService(serviceId: string) {
  const response = await fetch(`/api/services/${serviceId}`, {
    method: "DELETE",
  });

  return readResponse<{success: true}>(response);
}
