import {getDatabase} from "@/lib/mongodb";

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

const aboutCollectionName = "about";
const aboutDocumentId = "about-content";

async function getAboutCollection() {
  return (await getDatabase()).collection<AboutContentRecord & {_id: string}>(aboutCollectionName);
}

function createEmptyAboutContent(): AboutContentRecord {
  return {
    bio: {
      en: "",
      ru: "",
      az: "",
    },
    technologies: [],
  };
}

async function ensureAboutSeeded() {
  const collection = await getAboutCollection();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {
      $setOnInsert: {
        bio: createEmptyAboutContent().bio,
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
    return createEmptyAboutContent();
  }

  return {
    bio: document.bio,
    technologies: document.technologies,
  };
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
  await collection.updateOne({_id: aboutDocumentId}, {$set: {bio: nextBio}});
}

export async function createAboutTechnology(technology: AboutTechnologyRecord) {
  await assertTechnologyIdAvailable(technology.id);
  const content = await readAboutContent();
  content.technologies.push(technology);

  const collection = await ensureAboutSeeded();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {$set: {technologies: sortTechnologies(content.technologies)}},
  );
}

export async function updateAboutTechnology(
  technologyId: string,
  nextTechnology: AboutTechnologyRecord,
) {
  await assertTechnologyIdAvailable(nextTechnology.id, technologyId);
  const content = await readAboutContent();
  const index = content.technologies.findIndex((technology) => technology.id === technologyId);

  if (index === -1) {
    throw new Error("Technology not found.");
  }

  content.technologies[index] = nextTechnology;

  const collection = await ensureAboutSeeded();
  await collection.updateOne(
    {_id: aboutDocumentId},
    {$set: {technologies: sortTechnologies(content.technologies)}},
  );
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
    {$set: {technologies: sortTechnologies(nextTechnologies)}},
  );
}
