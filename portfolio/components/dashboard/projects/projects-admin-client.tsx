"use client";

import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
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

// Даём единый текст ошибки для операций dashboard.
function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// Преобразуем запись проекта в строковые значения формы.
function toProjectFormValues(project: ProjectRecord): ProjectFormValues {
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

// Преобразуем данные формы обратно в формат API.
function toProjectPayload(values: ProjectFormValues): ProjectRecord {
  return {
    id: values.id,
    title: values.title,
    description: values.description,
    link: values.link,
    thumbnail: values.thumbnail,
    alt: values.alt,
    sortOrder: Number(values.sortOrder) || 0,
    published: values.published,
  };
}

// Фильтрация простая, поэтому отдельная функция читается лучше, чем useMemo.
function filterProjects(projects: ProjectRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) =>
    [project.id, project.title, project.description, project.link]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

// Обновляем один проект в списке по предыдущему id.
function replaceProject(projects: ProjectRecord[], previousId: string, nextProject: ProjectRecord) {
  return projects.map((project) => (project.id === previousId ? nextProject : project));
}

// Один helper закрывает и create, и update запросы.
async function saveProjectRequest(values: ProjectFormValues, projectId?: string) {
  return requestJson<ProjectResponse>(
    projectId ? `/api/dashboard/projects/${projectId}` : "/api/dashboard/projects",
    {
      method: projectId ? "PUT" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(toProjectPayload(values)),
    },
  );
}

export function ProjectsAdminClient({
  initialProjects,
  initialQuery = "",
}: {
  initialProjects: ProjectRecord[];
  initialQuery?: string;
}) {
  // Локальный список нужен для мгновенных обновлений без reload.
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState(initialQuery);
  const [showNewProject, setShowNewProject] = useState(false);
  const {status, showStatus} = useStatusMessage();
  // Эта форма отвечает только за создание нового проекта.
  const newProjectForm = useForm<ProjectFormValues>({
    defaultValues: toProjectFormValues(createEmptyProject()),
  });
  const filteredProjects = filterProjects(projects, query);

  async function createProject(values: ProjectFormValues) {
    try {
      const data = await saveProjectRequest(values);

      setProjects((currentProjects) => [...currentProjects, data.project]);
      newProjectForm.reset(toProjectFormValues(createEmptyProject()));
      setShowNewProject(false);
      showStatus(`Created ${data.project.title}.`);
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to create project."));
    }
  }

  async function removeProject(projectId: string) {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      await requestJson<{ok: true}>(`/api/dashboard/projects/${projectId}`, {
        method: "DELETE",
      });

      setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
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
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowNewProject((current) => !current)}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              {showNewProject ? "Close new project" : "New project"}
            </button>
          </div>
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

      {filteredProjects.length > 0 ? (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSave={(nextProject) =>
                setProjects((currentProjects) =>
                  replaceProject(currentProjects, project.id, nextProject),
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
  // Каждая карточка имеет собственную форму, чтобы правки не влияли на соседние карточки.
  const form = useForm<ProjectFormValues>({
    defaultValues: toProjectFormValues(project),
  });

  useEffect(() => {
    // После успешного save или серверного обновления синхронизируем форму с актуальным проектом.
    form.reset(toProjectFormValues(project));
  }, [form, project]);

  async function saveProject(values: ProjectFormValues) {
    try {
      const data = await saveProjectRequest(values, project.id);

      onSave(data.project);
      form.reset(toProjectFormValues(data.project));
      showStatus(`Saved ${data.project.title}.`);
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

        <form onSubmit={form.handleSubmit(saveProject)} className="mt-5">
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
  control: ReturnType<typeof useForm<ProjectFormValues>>["control"];
  namePrefix: string;
}) {
  return (
    // Один редактор полей переиспользуется и в create-форме, и в карточках редактирования.
    <div className="grid gap-4 md:grid-cols-2">
      <Controller
        name="id"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Project ID"
            name={`${namePrefix}-id`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="title"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Title"
            name={`${namePrefix}-title`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="md:col-span-2">
        <Controller
          name="description"
          control={control}
          render={({field}) => (
            <DashboardField
              label="Description"
              name={`${namePrefix}-description`}
              value={field.value}
              onChange={field.onChange}
              multiline
            />
          )}
        />
      </div>
      <Controller
        name="link"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Project link"
            name={`${namePrefix}-link`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="thumbnail"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Thumbnail path"
            name={`${namePrefix}-thumbnail`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="alt"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Image alt text"
            name={`${namePrefix}-alt`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="sortOrder"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Display order"
            name={`${namePrefix}-sort-order`}
            type="number"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
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
