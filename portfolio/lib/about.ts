import {promises as fs} from "node:fs";
import path from "node:path";

export type AboutBioRecord = {
  en: string;
  ru: string;
  az: string;
};

export type AboutTechnologyRecord = {
  id: string;
  name: string;
  href: string;
  iconKeys?: string[];
  fallback?: string;
  color?: string;
  sortOrder: number;
};

export type AboutContentRecord = {
  bio: AboutBioRecord;
  technologies: AboutTechnologyRecord[];
};

const aboutFilePath = path.join(process.cwd(), "data", "about.json");

async function readAboutFile() {
  const content = await fs.readFile(aboutFilePath, "utf8");
  return JSON.parse(content) as AboutContentRecord;
}

async function writeAboutFile(content: AboutContentRecord) {
  await fs.writeFile(aboutFilePath, JSON.stringify(content, null, 2) + "\n", "utf8");
}

function sortTechnologies(technologies: AboutTechnologyRecord[]) {
  return [...technologies].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

export async function getAboutContent() {
  const content = await readAboutFile();

  return {
    ...content,
    technologies: sortTechnologies(content.technologies),
  };
}

export async function updateAboutBio(nextBio: AboutBioRecord) {
  const content = await readAboutFile();
  await writeAboutFile({
    ...content,
    bio: nextBio,
  });
}

export async function createAboutTechnology(technology: AboutTechnologyRecord) {
  const content = await readAboutFile();
  content.technologies.push(technology);

  await writeAboutFile({
    ...content,
    technologies: sortTechnologies(content.technologies),
  });
}

export async function updateAboutTechnology(
  technologyId: string,
  nextTechnology: AboutTechnologyRecord,
) {
  const content = await readAboutFile();
  const index = content.technologies.findIndex((technology) => technology.id === technologyId);

  if (index === -1) {
    throw new Error("Technology not found.");
  }

  content.technologies[index] = nextTechnology;

  await writeAboutFile({
    ...content,
    technologies: sortTechnologies(content.technologies),
  });
}

export async function deleteAboutTechnology(technologyId: string) {
  const content = await readAboutFile();
  const nextTechnologies = content.technologies.filter((technology) => technology.id !== technologyId);

  if (nextTechnologies.length === content.technologies.length) {
    throw new Error("Technology not found.");
  }

  await writeAboutFile({
    ...content,
    technologies: sortTechnologies(nextTechnologies),
  });
}
