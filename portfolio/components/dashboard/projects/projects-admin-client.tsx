"use client";

import {type ChangeEvent, useEffect, useState} from "react";
import {Control, Controller, useForm} from "react-hook-form";
import {DashboardCheckbox, DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {getErrorMessage} from "@/components/dashboard/shared/error-message";
import {DashboardStatusBadge} from "@/components/dashboard/shared/status-badge";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {createEmptyProject} from "@/lib/dashboard/projects";
import {parseProject, type ProjectRecord} from "@/lib/project-schema";

type ProjectResponse = {
  project: ProjectRecord;
  projects: ProjectRecord[];
};

type DeleteProjectResponse = {
  ok: true;
  projects: ProjectRecord[];
};

type ProjectFormValues = {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  alt: string;
  sortOrder: string;
  published: boolean;
};

type ProjectFieldName = Exclude<keyof ProjectFormValues, "published">;

const projectFields: Array<{
  name: ProjectFieldName;
  label: string;
  type?: string;
  multiline?: boolean;
  wide?: boolean;
}> = [
  {name: "id", label: "Project ID"},
  {name: "title", label: "Title"},
  {name: "description", label: "Description", multiline: true, wide: true},
  {name: "link", label: "Project link"},
  {name: "alt", label: "Image alt text"},
  {name: "sortOrder", label: "Display order", type: "number"},
];

function createFormValues(project: ProjectRecord = createEmptyProject()): ProjectFormValues {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    link: project.link,
    thumbnail: project.thumbnail,
    alt: project.alt,
    sortOrder: String(project.sortOrder),
    published: project.published,
  };
}

function sortProjects(projects: ProjectRecord[]) {
  return [...projects].sort(
    (left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title),
  );
}

async function saveProject(values: ProjectFormValues, projectId?: string) {
  return requestJson<ProjectResponse>(
    projectId ? `/api/dashboard/projects/${projectId}` : "/api/dashboard/projects",
    {
      method: projectId ? "PUT" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(parseProject(values)),
    },
  );
}

async function uploadProjectThumbnail(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/dashboard/projects/thumbnail", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {path?: string; error?: string};

  if (!response.ok || !data.path) {
    throw new Error(data.error ?? "Failed to upload image.");
  }

  return data.path;
}

function filterProjects(projects: ProjectRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) =>
    `${project.id} ${project.title} ${project.description} ${project.link}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function ProjectsAdminClient({
  initialProjects,
  initialQuery = "",
}: {
  initialProjects: ProjectRecord[];
  initialQuery?: string;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState(initialQuery);
  const [showNewProject, setShowNewProject] = useState(false);
  const {status, showStatus} = useStatusMessage();
  const newProjectForm = useForm<ProjectFormValues>({defaultValues: createFormValues()});
  const filteredProjects = filterProjects(projects, query);

  async function createProject(values: ProjectFormValues) {
    try {
      const {project, projects: nextProjects} = await saveProject(values);
      setProjects(sortProjects(nextProjects));
      newProjectForm.reset(createFormValues());
      setShowNewProject(false);
      showStatus(`Created ${project.title}.`);
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to create project."));
    }
  }

  async function removeProject(projectId: string) {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      const {projects: nextProjects} = await requestJson<DeleteProjectResponse>(
        `/api/dashboard/projects/${projectId}`,
        {method: "DELETE"},
      );
      setProjects(sortProjects(nextProjects));
      showStatus("Project deleted.");
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to delete project."));
    }
  }

  return (
    <>
      <DashboardPageIntro
        title="Projects"
        description="Manage your portfolio projects from one place with inline editing, quick saves and no page reloads."
        action={
          <button
            type="button"
            onClick={() => setShowNewProject((current) => !current)}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            {showNewProject ? "Close new project" : "New project"}
          </button>
        }
      />

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects..."
            className="w-full max-w-xl rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/18"
          />

          <div className="flex items-center gap-3 text-sm text-white/45">
            {status ? (
              <DashboardStatusBadge className="text-white/72">{status}</DashboardStatusBadge>
            ) : null}
            <DashboardStatusBadge className="text-inherit">
              {filteredProjects.length} result{filteredProjects.length === 1 ? "" : "s"}
            </DashboardStatusBadge>
          </div>
        </div>
      </section>

      {showNewProject ? (
        <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm text-white/55">New item</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Add project</h2>
          </div>

          <form onSubmit={newProjectForm.handleSubmit(createProject)}>
            <ProjectEditor control={newProjectForm.control} namePrefix="new-project" />

            <button
              type="submit"
              className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Create project
            </button>
          </form>
        </section>
      ) : null}

      {filteredProjects.length ? (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSave={(nextProjects) => setProjects(nextProjects)}
              onDelete={removeProject}
              showStatus={showStatus}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">No projects found</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Try another search or create a new project from this page.
          </p>
        </section>
      )}
    </>
  );
}

function ProjectCard({
  project,
  onSave,
  onDelete,
  showStatus,
}: {
  project: ProjectRecord;
  onSave: (projects: ProjectRecord[]) => void;
  onDelete: (projectId: string) => Promise<void>;
  showStatus: (message: string) => void;
}) {
  const form = useForm<ProjectFormValues>({defaultValues: createFormValues(project)});

  useEffect(() => {
    form.reset(createFormValues(project));
  }, [form, project]);

  async function handleSave(values: ProjectFormValues) {
    try {
      const {project: nextProject, projects: nextProjects} = await saveProject(values, project.id);
      onSave(sortProjects(nextProjects));
      form.reset(createFormValues(nextProject));
      showStatus(`Saved ${nextProject.title}.`);
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to save project."));
    }
  }

  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#101015]">
      <div
        className="relative h-52 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.55)), url(${project.thumbnail})`,
        }}
      >
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span
            className={[
              "rounded-full border px-3 py-1.5 text-xs",
              project.published
                ? "border-white/18 bg-black/55 text-white"
                : "border-white/10 bg-black/45 text-white/65",
            ].join(" ")}
          >
            {project.published ? "Published" : "Draft"}
          </span>
          <span className="rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-xs text-white/65">
            #{project.sortOrder}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
          <p className="mt-2 text-sm text-white/42">{project.id}</p>
        </div>

        <form onSubmit={form.handleSubmit(handleSave)} className="mt-5">
          <ProjectEditor control={form.control} namePrefix={project.id} />

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => void onDelete(project.id)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
            >
              Delete project
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}

function ProjectEditor({
  control,
  namePrefix,
}: {
  control: Control<ProjectFormValues>;
  namePrefix: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projectFields.map(({name, label, type, multiline, wide}) => (
        <div key={name} className={wide ? "md:col-span-2" : undefined}>
          <Controller
            name={name}
            control={control}
            render={({field}) => (
              <DashboardField
                label={label}
                name={`${namePrefix}-${name}`}
                type={type}
                multiline={multiline}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      ))}

      <div className="md:col-span-2">
        <Controller
          name="thumbnail"
          control={control}
          render={({field}) => (
            <ThumbnailUploadField
              name={`${namePrefix}-thumbnail`}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="md:col-span-2">
        <Controller
          name="published"
          control={control}
          render={({field}) => (
            <DashboardCheckbox
              label="Published"
              name={`${namePrefix}-published`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}

function ThumbnailUploadField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const path = await uploadProjectThumbnail(file);
      onChange(path);
    } catch (error) {
      setUploadError(getErrorMessage(error, "Failed to upload image."));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <label className="block space-y-2 md:col-span-2">
      <span className="text-sm font-medium text-white/72">Project thumbnail</span>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          {value ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{backgroundImage: `url(${value})`}}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] text-white/35">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            name={name}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={(event) => void handleFileChange(event)}
            className="block w-full rounded-xl border border-white/12 bg-black/20 px-3 py-2.5 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
          />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
            <span>PNG, JPG, WebP, AVIF</span>
            <span>max 5 MB</span>
            {isUploading ? <span className="text-white/65">Uploading...</span> : null}
          </div>

          {value ? <p className="truncate text-xs text-white/55">{value}</p> : null}
          {uploadError ? <p className="text-sm text-red-300">{uploadError}</p> : null}
        </div>
      </div>
    </label>
  );
}
