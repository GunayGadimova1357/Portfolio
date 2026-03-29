import {emptyProject, parseProject, type ProjectRecord} from "@/lib/project-schema";

// Centralized parser for dashboard project payloads so pages and API stay in sync.
export function parseProjectPayload(payload: unknown): ProjectRecord {
  return parseProject(payload);
}

export function createEmptyProject(): ProjectRecord {
  return {...emptyProject};
}
