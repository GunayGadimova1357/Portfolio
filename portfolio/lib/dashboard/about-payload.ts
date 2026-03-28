import type {AboutBioRecord, AboutTechnologyRecord} from "@/lib/about";

// The dashboard edits bio locale-by-locale, so keep a single parser for validation.
export function parseAboutBioPayload(payload: unknown): AboutBioRecord {
  const source = payload as Partial<Record<keyof AboutBioRecord, unknown>>;

  const bio: AboutBioRecord = {
    en: String(source.en ?? "").trim(),
    ru: String(source.ru ?? "").trim(),
    az: String(source.az ?? "").trim(),
  };

  if (!bio.en || !bio.ru || !bio.az) {
    throw new Error("Bio is required for all locales.");
  }

  return bio;
}

export function parseTechnologyPayload(payload: unknown): AboutTechnologyRecord {
  const source = payload as Partial<Record<keyof AboutTechnologyRecord, unknown>>;
  const iconKeys = Array.isArray(source.iconKeys)
    ? source.iconKeys.map((item) => String(item).trim()).filter(Boolean)
    : String(source.iconKeys ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const technology: AboutTechnologyRecord = {
    id: String(source.id ?? "").trim(),
    name: String(source.name ?? "").trim(),
    href: String(source.href ?? "").trim(),
    iconKeys: iconKeys.length ? iconKeys : undefined,
    fallback: String(source.fallback ?? "").trim() || undefined,
    color: String(source.color ?? "").trim() || undefined,
    sortOrder: Number(source.sortOrder ?? 0),
  };

  if (!technology.id || !technology.name || !technology.href) {
    throw new Error("Technology ID, name and link are required.");
  }

  if (!Number.isFinite(technology.sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return technology;
}

export function createEmptyTechnology(): AboutTechnologyRecord {
  return {
    id: "",
    name: "",
    href: "",
    iconKeys: [],
    fallback: "",
    color: "",
    sortOrder: 0,
  };
}
