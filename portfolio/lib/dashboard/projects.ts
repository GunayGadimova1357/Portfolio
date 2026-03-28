import type {ProjectRecord} from "@/lib/projects";

// Centralized parser for dashboard project payloads so pages and API stay in sync.
export function parseProjectPayload(payload: unknown): ProjectRecord {
  const source = payload as Partial<Record<keyof ProjectRecord, unknown>>;

  const project: ProjectRecord = {
    id: String(source.id ?? "").trim(),
    title: String(source.title ?? "").trim(),
    description: String(source.description ?? "").trim(),
    link: String(source.link ?? "").trim(),
    thumbnail: String(source.thumbnail ?? "").trim(),
    alt: String(source.alt ?? "").trim(),
    sortOrder: Number(source.sortOrder ?? 0),
    published: Boolean(source.published),
  };

  if (
    !project.id ||
    !project.title ||
    !project.description ||
    !project.link ||
    !project.thumbnail ||
    !project.alt
  ) {
    throw new Error("All project fields are required.");
  }

  if (!Number.isFinite(project.sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return project;
}

export function createEmptyProject(): ProjectRecord {
  return {
    id: "",
    title: "",
    description: "",
    link: "",
    thumbnail: "",
    alt: "",
    sortOrder: 0,
    published: false,
  };
}
