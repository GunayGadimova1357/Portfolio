import {
  aboutContentSchema,
  emptyAboutContent,
  parseAboutBio,
  parseTechnology,
  type AboutBioRecord,
  type AboutContentRecord,
  type AboutTechnologyRecord,
} from "@/lib/about-schema";
import {getDatabase} from "@/lib/mongodb";

export type {AboutBioRecord, AboutContentRecord, AboutTechnologyRecord} from "@/lib/about-schema";

const aboutCollectionName = "about";
const aboutDocumentId = "about-content";

async function getAboutCollection() {
  return (await getDatabase()).collection<AboutContentRecord & {_id: string}>(aboutCollectionName);
}

async function ensureAboutSeeded() {
  const collection = await getAboutCollection();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {
      $setOnInsert: {
        bio: emptyAboutContent.bio,
        technologies: [],
      },
    },
    {upsert: true},
  );

  return collection;
}

async function readAboutContent() {
  const collection = await ensureAboutSeeded();
  const document = await collection.findOne({_id: aboutDocumentId}, {projection: {_id: 0}});

  if (!document) {
    return {
      bio: {...emptyAboutContent.bio},
      technologies: [],
    };
  }

  return aboutContentSchema.parse({
    bio: document.bio,
    technologies: document.technologies,
  });
}

function sortTechnologies(technologies: AboutTechnologyRecord[]) {
  return [...technologies].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

function normalizeOrder(technologies: AboutTechnologyRecord[]) {
  return technologies.map((technology, index) => ({
    ...technology,
    sortOrder: index,
  }));
}

function clampOrder(sortOrder: number, maxIndex: number) {
  return Math.max(0, Math.min(sortOrder, maxIndex));
}

function reorderTechnologies(
  technologies: AboutTechnologyRecord[],
  nextTechnology: AboutTechnologyRecord,
  technologyId?: string,
) {
  const nextTechnologies = technologyId
    ? sortTechnologies(technologies).filter((technology) => technology.id !== technologyId)
    : sortTechnologies(technologies);

  if (technologyId && nextTechnologies.length === technologies.length) {
    throw new Error("Technology not found.");
  }

  nextTechnologies.splice(
    clampOrder(nextTechnology.sortOrder, nextTechnologies.length),
    0,
    nextTechnology,
  );

  return normalizeOrder(nextTechnologies);
}

export async function getAboutContent() {
  const content = await readAboutContent();

  return {
    ...content,
    technologies: sortTechnologies(content.technologies),
  };
}

export async function assertTechnologyIdAvailable(technologyId: string, excludeTechnologyId?: string) {
  const content = await readAboutContent();
  const existingTechnology = content.technologies.find((technology) => technology.id === technologyId);

  if (existingTechnology && existingTechnology.id !== excludeTechnologyId) {
    throw new Error("A technology with this ID already exists.");
  }
}

export async function updateAboutBio(nextBio: AboutBioRecord) {
  const collection = await ensureAboutSeeded();
  await collection.updateOne({_id: aboutDocumentId}, {$set: {bio: parseAboutBio(nextBio)}});
}

export async function createAboutTechnology(technology: AboutTechnologyRecord) {
  const nextTechnology = parseTechnology(technology);
  await assertTechnologyIdAvailable(nextTechnology.id);
  const content = await readAboutContent();
  const nextTechnologies = reorderTechnologies(content.technologies, nextTechnology);

  const collection = await ensureAboutSeeded();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {$set: {technologies: nextTechnologies}},
  );

  return nextTechnologies;
}

export async function updateAboutTechnology(
  technologyId: string,
  nextTechnology: AboutTechnologyRecord,
) {
  const parsedTechnology = parseTechnology(nextTechnology);
  await assertTechnologyIdAvailable(parsedTechnology.id, technologyId);
  const content = await readAboutContent();
  const nextTechnologies = reorderTechnologies(
    content.technologies,
    parsedTechnology,
    technologyId,
  );

  const collection = await ensureAboutSeeded();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {$set: {technologies: nextTechnologies}},
  );

  return nextTechnologies;
}

export async function deleteAboutTechnology(technologyId: string) {
  const content = await readAboutContent();
  const nextTechnologies = content.technologies.filter((technology) => technology.id !== technologyId);

  if (nextTechnologies.length === content.technologies.length) {
    throw new Error("Technology not found.");
  }

  const collection = await ensureAboutSeeded();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {$set: {technologies: normalizeOrder(sortTechnologies(nextTechnologies))}},
  );

  return normalizeOrder(sortTechnologies(nextTechnologies));
}
