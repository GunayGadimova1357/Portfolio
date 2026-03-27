"use server";

import {redirect} from "next/navigation";
import {requireAdminSession} from "@/lib/admin";
import {
  createAboutTechnology,
  deleteAboutTechnology,
  getAboutContent,
  type AboutBioRecord,
  type AboutTechnologyRecord,
  updateAboutBio,
  updateAboutTechnology,
} from "@/lib/about";
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

function parseAboutBioFormData(formData: FormData): AboutBioRecord {
  const en = String(formData.get("bio_en") ?? "").trim();
  const ru = String(formData.get("bio_ru") ?? "").trim();
  const az = String(formData.get("bio_az") ?? "").trim();

  if (!en || !ru || !az) {
    throw new Error("Bio is required for all locales.");
  }

  return {en, ru, az};
}

function parseAboutTechnologyFormData(formData: FormData): AboutTechnologyRecord {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const iconKeys = String(formData.get("iconKeys") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const fallback = String(formData.get("fallback") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!id || !name || !href) {
    throw new Error("Technology ID, name and link are required.");
  }

  if (!Number.isFinite(sortOrder)) {
    throw new Error("Sort order must be a number.");
  }

  return {
    id,
    name,
    href,
    iconKeys: iconKeys.length ? iconKeys : undefined,
    fallback: fallback || undefined,
    color: color || undefined,
    sortOrder,
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

export async function updateAboutBioAction(formData: FormData) {
  await requireAdminSession();
  await updateAboutBio(parseAboutBioFormData(formData));
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard/about`);
}

export async function createAboutTechnologyAction(formData: FormData) {
  await requireAdminSession();

  const technology = parseAboutTechnologyFormData(formData);
  const about = await getAboutContent();

  if (about.technologies.some((item) => item.id === technology.id)) {
    throw new Error("A technology with this ID already exists.");
  }

  await createAboutTechnology(technology);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard/about`);
}

export async function updateAboutTechnologyAction(formData: FormData) {
  await requireAdminSession();

  const currentId = String(formData.get("currentId") ?? "").trim();
  const technology = parseAboutTechnologyFormData(formData);
  const about = await getAboutContent();

  if (about.technologies.some((item) => item.id === technology.id && item.id !== currentId)) {
    throw new Error("A technology with this ID already exists.");
  }

  await updateAboutTechnology(currentId, technology);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard/about`);
}

export async function deleteAboutTechnologyAction(formData: FormData) {
  await requireAdminSession();

  const technologyId = String(formData.get("technologyId") ?? "").trim();
  await deleteAboutTechnology(technologyId);
  redirect(`/${String(formData.get("locale") ?? "en")}/dashboard/about`);
}
