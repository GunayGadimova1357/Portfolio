"use client";

import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {createEmptyTechnology} from "@/lib/dashboard/about";
import type {AboutTechnologyRecord} from "@/lib/about";

type TechnologyResponse = {technology: AboutTechnologyRecord};

type TechnologyFormValues = {
  id: string;
  name: string;
  href: string;
  sortOrder: string;
  iconKeys: string;
  fallback: string;
  color: string;
};

// Даём единый текст ошибки для всех dashboard-мутаций.
function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// Преобразуем запись в строковые значения формы.
function toTechnologyFormValues(technology: AboutTechnologyRecord): TechnologyFormValues {
  return {
    id: technology.id,
    name: technology.name,
    href: technology.href,
    sortOrder: String(technology.sortOrder),
    iconKeys: technology.iconKeys?.join(",") ?? "",
    fallback: technology.fallback ?? "",
    color: technology.color ?? "",
  };
}

// Преобразуем форму обратно в формат, который ожидает API.
function toTechnologyPayload(values: TechnologyFormValues): AboutTechnologyRecord {
  return {
    id: values.id,
    name: values.name,
    href: values.href,
    sortOrder: Number(values.sortOrder) || 0,
    iconKeys: values.iconKeys
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    fallback: values.fallback.trim() || undefined,
    color: values.color.trim() || undefined,
  };
}

// Обновляем одну технологию в локальном списке по её предыдущему id.
function replaceTechnology(
  technologies: AboutTechnologyRecord[],
  previousId: string,
  nextTechnology: AboutTechnologyRecord,
) {
  return technologies.map((technology) =>
    technology.id === previousId ? nextTechnology : technology,
  );
}

export function TechnologiesAdminClient({
  initialTechnologies,
}: {
  initialTechnologies: AboutTechnologyRecord[];
}) {
  // Локальное состояние нужно, чтобы UI обновлялся сразу после действий пользователя.
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const {status, showStatus} = useStatusMessage();
  // Отдельная форма используется только для создания новой технологии.
  const newTechnologyForm = useForm<TechnologyFormValues>({
    defaultValues: toTechnologyFormValues(createEmptyTechnology()),
  });

  async function createTechnology(values: TechnologyFormValues) {
    try {
      const data = await requestJson<TechnologyResponse>("/api/dashboard/about/technologies", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(toTechnologyPayload(values)),
      });

      setTechnologies((currentTechnologies) => [...currentTechnologies, data.technology]);
      newTechnologyForm.reset(toTechnologyFormValues(createEmptyTechnology()));
      showStatus(`Added ${data.technology.name}.`);
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to add technology."));
    }
  }

  async function removeTechnology(technologyId: string) {
    if (!window.confirm("Delete this technology?")) {
      return;
    }

    try {
      await requestJson<{ok: true}>(`/api/dashboard/about/technologies/${technologyId}`, {
        method: "DELETE",
      });

      setTechnologies((currentTechnologies) =>
        currentTechnologies.filter((technology) => technology.id !== technologyId),
      );
      showStatus("Technology deleted.");
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to delete technology."));
    }
  }

  return (
    <>
      <DashboardPageIntro
        eyebrow="About"
        title="Technologies"
        description="Manage the technology chips shown on the public about page."
        action={
          status ? (
            <span className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/72">
              {status}
            </span>
          ) : null
        }
      />

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm text-white/55">New item</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Add technology</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Use `iconKeys` as comma-separated simple-icons keys like `react`, `python`,
            `html5,css`. If icons are empty, the chip will use `fallback` text.
          </p>
        </div>

        <form onSubmit={newTechnologyForm.handleSubmit(createTechnology)}>
          <TechnologyEditor control={newTechnologyForm.control} namePrefix="new-technology" />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Add technology
          </button>
        </form>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {technologies.map((technology) => (
          <TechnologyCard
            key={technology.id}
            technology={technology}
            onSave={(nextTechnology) =>
              setTechnologies((currentTechnologies) =>
                replaceTechnology(currentTechnologies, technology.id, nextTechnology),
              )
            }
            onDelete={removeTechnology}
            showStatus={showStatus}
          />
        ))}
      </section>
    </>
  );
}

function TechnologyCard({
  technology,
  onSave,
  onDelete,
  showStatus,
}: {
  technology: AboutTechnologyRecord;
  onSave: (technology: AboutTechnologyRecord) => void;
  onDelete: (technologyId: string) => Promise<void>;
  showStatus: (message: string) => void;
}) {
  // Каждая карточка хранит собственное состояние формы для независимого редактирования.
  const form = useForm<TechnologyFormValues>({
    defaultValues: toTechnologyFormValues(technology),
  });

  useEffect(() => {
    // После save подтягиваем свежие значения в форму.
    form.reset(toTechnologyFormValues(technology));
  }, [form, technology]);

  async function saveTechnology(values: TechnologyFormValues) {
    try {
      const data = await requestJson<TechnologyResponse>(
        `/api/dashboard/about/technologies/${technology.id}`,
        {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(toTechnologyPayload(values)),
        },
      );

      onSave(data.technology);
      form.reset(toTechnologyFormValues(data.technology));
      showStatus(`Saved ${data.technology.name}.`);
    } catch (error) {
      showStatus(getErrorMessage(error, "Failed to save technology."));
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-white/10 bg-[#101015] p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{technology.name}</h3>
          <p className="mt-1 text-sm text-white/42">{technology.id}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">
          #{technology.sortOrder}
        </span>
      </div>

      <form onSubmit={form.handleSubmit(saveTechnology)}>
        <TechnologyEditor control={form.control} namePrefix={technology.id} />

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() => void onDelete(technology.id)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
          >
            Delete technology
          </button>
        </div>
      </form>
    </article>
  );
}

function TechnologyEditor({
  control,
  namePrefix,
}: {
  control: ReturnType<typeof useForm<TechnologyFormValues>>["control"];
  namePrefix: string;
}) {
  return (
    // Один редактор полей используется и для create, и для edit.
    <div className="grid gap-4 md:grid-cols-2">
      <Controller
        name="id"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Technology ID"
            name={`${namePrefix}-id`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Name"
            name={`${namePrefix}-name`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="href"
        control={control}
        render={({field}) => (
          <DashboardField
            label="GitHub link"
            name={`${namePrefix}-href`}
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
            label="Sort order"
            name={`${namePrefix}-sort-order`}
            type="number"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="iconKeys"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Icon keys"
            name={`${namePrefix}-icon-keys`}
            value={field.value}
            placeholder="react or html5,css"
            required={false}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="fallback"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Fallback text"
            name={`${namePrefix}-fallback`}
            value={field.value}
            placeholder="TS"
            required={false}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="color"
        control={control}
        render={({field}) => (
          <DashboardField
            label="Fallback color"
            name={`${namePrefix}-color`}
            value={field.value}
            placeholder="#3178C6"
            required={false}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
