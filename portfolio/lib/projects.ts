import {getDatabase} from "@/lib/mongodb";

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

async function getProjectsCollection() {
  return (await getDatabase()).collection<ProjectRecord>(projectsCollectionName);
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
  const collection = await getProjectsCollection();
  return sortProjects(await collection.find({}, {projection: {_id: 0}}).toArray());
}

export async function getPublishedProjects() {
  return (await getAllProjects()).filter((project) => project.published);
}

export async function createProject(project: ProjectRecord) {
  const collection = await getProjectsCollection();
  await collection.insertOne(project);
}

export async function updateProject(projectId: string, nextProject: ProjectRecord) {
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
