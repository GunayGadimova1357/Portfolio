import {getDatabase} from "@/lib/mongodb";
import type {Filter} from "mongodb";

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  alt: string;
  sortOrder: number;
  published: boolean;
};

const projectsCollectionName = "projects";
const projectsProjection = {_id: 0} as const;

async function getProjectsCollection() {
  return (await getDatabase()).collection<ProjectRecord>(projectsCollectionName);
}

async function findProjects(filter: Filter<ProjectRecord> = {}) {
  const collection = await getProjectsCollection();
  return collection.find(filter, {projection: projectsProjection}).toArray();
}

function sortProjects(projects: ProjectRecord[]) {
  return [...projects].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getAllProjects() {
  return sortProjects(await findProjects());
}

export async function getPublishedProjects() {
  return sortProjects(await findProjects({published: true}));
}

export async function getProjectById(projectId: string) {
  const collection = await getProjectsCollection();
  return collection.findOne({id: projectId}, {projection: projectsProjection});
}

export async function assertProjectIdAvailable(projectId: string, excludeProjectId?: string) {
  const existingProject = await getProjectById(projectId);

  if (existingProject && existingProject.id !== excludeProjectId) {
    throw new Error("A project with this ID already exists.");
  }
}

export async function getProjectStats() {
  const projects = await getAllProjects();
  const publishedCount = projects.filter((project) => project.published).length;

  return {
    totalCount: projects.length,
    publishedCount,
    draftCount: projects.length - publishedCount,
  };
}

export async function createProject(project: ProjectRecord) {
  await assertProjectIdAvailable(project.id);
  const collection = await getProjectsCollection();
  await collection.insertOne(project);
}

export async function updateProject(projectId: string, nextProject: ProjectRecord) {
  await assertProjectIdAvailable(nextProject.id, projectId);
  const collection = await getProjectsCollection();
  const result = await collection.updateOne({id: projectId}, {$set: nextProject});

  if (result.matchedCount === 0) {
    throw new Error("Project not found.");
  }
}

export async function deleteProject(projectId: string) {
  const collection = await getProjectsCollection();
  const result = await collection.deleteOne({id: projectId});

  if (result.deletedCount === 0) {
    throw new Error("Project not found.");
  }
}
