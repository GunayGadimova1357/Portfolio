"use server";

import {redirect} from "next/navigation";
import {requireAdminSession} from "@/lib/admin";
import {createProject, deleteProject, getAllProjects, updateProject, type ProjectRecord} from "@/lib/projects";

function parseProjectFormData(formData: FormData): ProjectRecord {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const published = formData.get("published") === "on";

  if (!id || !title || !description || !link || !thumbnail || !alt) {
    throw new Error("All project fields are required.");
  }

  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return {
    id,
    title,
    description,
    link,
    thumbnail,
    alt,
    sortOrder,
    published,
  };
}

export async function logout(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");

  await requireAdminSession();
  redirect(`/${locale}/dashboard/login`);
}

export async function createProjectAction(formData: FormData) {
  await requireAdminSession();

  const project = parseProjectFormData(formData);
  const projects = await getAllProjects();

  if (projects.some((item) => item.id === project.id)) {
    throw new Error("A project with this ID already exists.");
  }

  await createProject(project);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard`);
}

export async function updateProjectAction(formData: FormData) {
  await requireAdminSession();

  const currentId = String(formData.get("currentId") ?? "").trim();
  const project = parseProjectFormData(formData);
  const projects = await getAllProjects();

  if (projects.some((item) => item.id === project.id && item.id !== currentId)) {
    throw new Error("A project with this ID already exists.");
  }

  await updateProject(currentId, project);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard`);
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession();

  const projectId = String(formData.get("projectId") ?? "").trim();
  await deleteProject(projectId);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard`);
}
