import {promises as fs} from "node:fs";
import path from "node:path";

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

const projectsFilePath = path.join(process.cwd(), "data", "projects.json");

async function readProjectsFile() {
  const content = await fs.readFile(projectsFilePath, "utf8");
  return JSON.parse(content) as ProjectRecord[];
}

async function writeProjectsFile(projects: ProjectRecord[]) {
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2) + "\n", "utf8");
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
  return sortProjects(await readProjectsFile());
}

export async function getPublishedProjects() {
  return (await getAllProjects()).filter((project) => project.published);
}

export async function createProject(project: ProjectRecord) {
  const projects = await readProjectsFile();
  projects.push(project);
  await writeProjectsFile(sortProjects(projects));
}

export async function updateProject(projectId: string, nextProject: ProjectRecord) {
  const projects = await readProjectsFile();
  const index = projects.findIndex((project) => project.id === projectId);

  if (index === -1) {
    throw new Error("Project not found.");
  }

  projects[index] = nextProject;
  await writeProjectsFile(sortProjects(projects));
}

export async function deleteProject(projectId: string) {
  const projects = await readProjectsFile();
  const nextProjects = projects.filter((project) => project.id !== projectId);

  if (nextProjects.length === projects.length) {
    throw new Error("Project not found.");
  }

  await writeProjectsFile(sortProjects(nextProjects));
}
