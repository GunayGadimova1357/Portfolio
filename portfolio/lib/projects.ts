import {getDatabase} from "@/lib/mongodb";
import {parseProject, projectSchema, type ProjectRecord} from "@/lib/project-schema";
import type {Filter} from "mongodb";
import {z} from "zod";

export type {ProjectRecord} from "@/lib/project-schema";

const projectListSchema = z.array(projectSchema);

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

function normalizeOrder(projects: ProjectRecord[]) {
  return projects.map((project, index) => ({
    ...project,
    sortOrder: index,
  }));
}

function clampOrder(sortOrder: number, maxIndex: number) {
  return Math.max(0, Math.min(sortOrder, maxIndex));
}

function reorderProjects(
  projects: ProjectRecord[],
  nextProject: ProjectRecord,
  projectId?: string,
) {
  const nextProjects = projectId
    ? sortProjects(projects).filter((project) => project.id !== projectId)
    : sortProjects(projects);

  if (projectId && nextProjects.length === projects.length) {
    throw new Error("Project not found.");
  }

  nextProjects.splice(clampOrder(nextProject.sortOrder, nextProjects.length), 0, nextProject);

  return normalizeOrder(nextProjects);
}

async function persistProjects(
  projects: ProjectRecord[],
  renamedProject?: {previousId: string; nextId: string},
) {
  const collection = await getCollection();

  for (const project of projects) {
    const targetId =
      renamedProject && project.id === renamedProject.nextId
        ? renamedProject.previousId
        : project.id;

    await collection.updateOne({id: targetId}, {$set: project});
  }
}

async function findProjects(filter: Filter<ProjectRecord> = {}) {
  return projectListSchema.parse(await (await getCollection()).find(filter, {projection}).toArray());
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
  return projectSchema.nullable().parse(await (await getCollection()).findOne({id: projectId}, {projection}));
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
  const nextProject = parseProject(project);
  await requireAvailableId(nextProject.id);
  const projects = await getAllProjects();
  const nextProjects = reorderProjects(projects, nextProject);
  await (await getCollection()).insertOne(
    nextProjects.find((project) => project.id === nextProject.id) ?? nextProject,
  );
  await persistProjects(nextProjects.filter((project) => project.id !== nextProject.id));

  return nextProjects;
}

export async function updateProject(projectId: string, nextProject: ProjectRecord) {
  const parsedProject = parseProject(nextProject);
  await requireAvailableId(parsedProject.id, projectId);
  const projects = await getAllProjects();
  const nextProjects = reorderProjects(projects, parsedProject, projectId);
  await persistProjects(nextProjects, {previousId: projectId, nextId: parsedProject.id});

  return nextProjects;
}

export async function deleteProject(projectId: string) {
  const collection = await getCollection();
  const result = await collection.deleteOne({id: projectId});

  if (!result.deletedCount) {
    throw new Error("Project not found.");
  }

  const nextProjects = normalizeOrder(await getAllProjects());
  await persistProjects(nextProjects);

  return nextProjects;
}
