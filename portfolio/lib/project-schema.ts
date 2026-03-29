import {z} from "zod";

const requiredText = (field: string) => z.string().trim().min(1, `${field} is required.`);

const publishedSchema = z
  .union([z.boolean(), z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (normalized === "true") {
        return true;
      }

      if (normalized === "false" || normalized === "") {
        return false;
      }
    }

    return Boolean(value);
  });

export const projectSchema = z.object({
  id: requiredText("Project ID"),
  title: requiredText("Project title"),
  description: requiredText("Project description"),
  link: requiredText("Project link"),
  thumbnail: requiredText("Project thumbnail"),
  alt: requiredText("Project alt text"),
  sortOrder: z.coerce.number().refine(Number.isFinite, {
    message: "Sort order must be a number.",
  }),
  published: publishedSchema,
});

export type ProjectRecord = z.infer<typeof projectSchema>;

export const emptyProject: ProjectRecord = {
  id: "",
  title: "",
  description: "",
  link: "",
  thumbnail: "",
  alt: "",
  sortOrder: 0,
  published: false,
};

export function parseProject(payload: unknown): ProjectRecord {
  return projectSchema.parse(payload);
}
