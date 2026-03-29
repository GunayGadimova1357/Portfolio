"use client";

import {useEffect, useState} from "react";
import {Control, Controller, useForm} from "react-hook-form";
import {DashboardCheckbox, DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {createEmptyProject} from "@/lib/dashboard/projects";
import type {ProjectRecord} from "@/lib/projects";

type ProjectResponse = {project: ProjectRecord};

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
  {name: "thumbnail", label: "Thumbnail path"},
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

function toProject(values: ProjectFormValues): ProjectRecord {
  return {
    ...values,
    sortOrder: Number(values.sortOrder) || 0,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function saveProject(values: ProjectFormValues, projectId?: string) {
  return requestJson<ProjectResponse>(
    projectId ? `/api/dashboard/projects/${projectId}` : "/api/dashboard/projects",
    {
      method: projectId ? "PUT" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(toProject(values)),
    },
  );
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
      const {project} = await saveProject(values);
      setProjects((current) => [...current, project]);
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
      await requestJson<{ok: true}>(`/api/dashboard/projects/${projectId}`, {method: "DELETE"});
      setProjects((current) => current.filter((project) => project.id !== projectId));
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
              <span className="rounded-full border border-white/10 px-3 py-2 text-white/72">
                {status}
              </span>
            ) : null}
            <span className="rounded-full border border-white/10 px-3 py-2">
              {filteredProjects.length} result{filteredProjects.length === 1 ? "" : "s"}
            </span>
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
              onSave={(nextProject) =>
                setProjects((current) =>
                  current.map((item) => (item.id === project.id ? nextProject : item)),
                )
              }
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
  onSave: (project: ProjectRecord) => void;
  onDelete: (projectId: string) => Promise<void>;
  showStatus: (message: string) => void;
}) {
  const form = useForm<ProjectFormValues>({defaultValues: createFormValues(project)});

  useEffect(() => {
    form.reset(createFormValues(project));
  }, [form, project]);

  async function handleSave(values: ProjectFormValues) {
    try {
      const {project: nextProject} = await saveProject(values, project.id);
      onSave(nextProject);
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
