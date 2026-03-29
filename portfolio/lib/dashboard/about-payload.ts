import {
  emptyTechnology,
  parseAboutBio,
  parseTechnology,
  type AboutBioRecord,
  type AboutTechnologyRecord,
} from "@/lib/about-schema";

// The dashboard edits bio locale-by-locale, so keep a single parser for validation.
export function parseAboutBioPayload(payload: unknown): AboutBioRecord {
  return parseAboutBio(payload);
}

export function parseTechnologyPayload(payload: unknown): AboutTechnologyRecord {
  return parseTechnology(payload);
}

export function createEmptyTechnology(): AboutTechnologyRecord {
  return {
    ...emptyTechnology,
    iconKeys: [...(emptyTechnology.iconKeys ?? [])],
  };
}
