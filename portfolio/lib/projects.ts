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

const projection = {_id: 0} as const;

async function getCollection() {
  return (await getDatabase()).collection<ProjectRecord>("projects");
}

function sortProjects(projects: ProjectRecord[]) {
  return [...projects].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.title.localeCompare(right.title),
  );
}

async function findProjects(filter: Filter<ProjectRecord> = {}) {
  return (await getCollection()).find(filter, {projection}).toArray();
}

async function requireAvailableId(projectId: string, excludeProjectId?: string) {
  const existingProject = await getProjectById(projectId);

  if (existingProject && existingProject.id !== excludeProjectId) {
    throw new Error("A project with this ID already exists.");
  }
}

export async function getAllProjects() {
  return sortProjects(await findProjects());
}

export async function getPublishedProjects() {
  return sortProjects(await findProjects({published: true}));
}

export async function getProjectById(projectId: string) {
  return (await getCollection()).findOne({id: projectId}, {projection});
}

export async function assertProjectIdAvailable(projectId: string, excludeProjectId?: string) {
  await requireAvailableId(projectId, excludeProjectId);
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
  await requireAvailableId(project.id);
  await (await getCollection()).insertOne(project);
}

export async function updateProject(projectId: string, nextProject: ProjectRecord) {
  await requireAvailableId(nextProject.id, projectId);
  const result = await (await getCollection()).updateOne({id: projectId}, {$set: nextProject});

  if (!result.matchedCount) {
    throw new Error("Project not found.");
  }
}

export async function deleteProject(projectId: string) {
  const result = await (await getCollection()).deleteOne({id: projectId});

  if (!result.deletedCount) {
    throw new Error("Project not found.");
  }
}
