import {z} from "zod";

const requiredText = (field: string) => z.string().trim().min(1, `${field} is required.`);
const text = z.string().trim();

const optionalText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value?.trim() || undefined);

const iconKeysSchema = z
  .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    const iconKeys = Array.isArray(value)
      ? value.map((item) => item.trim()).filter(Boolean)
      : (value ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    return iconKeys.length ? iconKeys : undefined;
  });

export const aboutBioSchema = z.object({
  en: text,
  ru: text,
  az: text,
});

const aboutBioInputSchema = z.object({
  en: requiredText("English bio"),
  ru: requiredText("Russian bio"),
  az: requiredText("Azerbaijani bio"),
});

export const aboutTechnologySchema = z.object({
  id: requiredText("Technology ID"),
  name: requiredText("Technology name"),
  href: requiredText("Technology link"),
  iconKeys: iconKeysSchema,
  fallback: optionalText,
  color: optionalText,
  sortOrder: z.coerce.number().refine(Number.isFinite, {
    message: "Sort order must be a number.",
  }),
});

export const aboutContentSchema = z.object({
  bio: aboutBioSchema,
  technologies: z.array(aboutTechnologySchema),
});

export type AboutBioRecord = z.infer<typeof aboutBioSchema>;
export type AboutTechnologyRecord = z.infer<typeof aboutTechnologySchema>;
export type AboutContentRecord = z.infer<typeof aboutContentSchema>;

export const emptyAboutBio: AboutBioRecord = {
  en: "",
  ru: "",
  az: "",
};

export const emptyTechnology: AboutTechnologyRecord = {
  id: "",
  name: "",
  href: "",
  iconKeys: [],
  fallback: undefined,
  color: undefined,
  sortOrder: 0,
};

export const emptyAboutContent: AboutContentRecord = {
  bio: emptyAboutBio,
  technologies: [],
};

export function parseAboutBio(payload: unknown): AboutBioRecord {
  return aboutBioInputSchema.parse(payload);
}

export function parseTechnology(payload: unknown): AboutTechnologyRecord {
  return aboutTechnologySchema.parse(payload);
}
