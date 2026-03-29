"use client";

import {useEffect, useState} from "react";
import {Control, Controller, useForm} from "react-hook-form";
import {DashboardField} from "@/components/dashboard/shared/form-fields";
import {DashboardPageIntro} from "@/components/dashboard/shared/page-intro";
import {useStatusMessage} from "@/components/dashboard/shared/use-status-message";
import {requestJson} from "@/lib/dashboard/client";
import {createEmptyTechnology} from "@/lib/dashboard/about-payload";
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

type TechnologyFieldName = keyof TechnologyFormValues;

const technologyFields: Array<{
  name: TechnologyFieldName;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}> = [
  {name: "id", label: "Technology ID"},
  {name: "name", label: "Name"},
  {name: "href", label: "GitHub link"},
  {name: "sortOrder", label: "Sort order", type: "number"},
  {name: "iconKeys", label: "Icon keys", placeholder: "react or html5,css", required: false},
  {name: "fallback", label: "Fallback text", placeholder: "TS", required: false},
  {name: "color", label: "Fallback color", placeholder: "#3178C6", required: false},
];

function createFormValues(
  technology: AboutTechnologyRecord = createEmptyTechnology(),
): TechnologyFormValues {
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

function toTechnology(values: TechnologyFormValues): AboutTechnologyRecord {
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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function saveTechnology(values: TechnologyFormValues, technologyId?: string) {
  return requestJson<TechnologyResponse>(
    technologyId
      ? `/api/dashboard/about/technologies/${technologyId}`
      : "/api/dashboard/about/technologies",
    {
      method: technologyId ? "PUT" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(toTechnology(values)),
    },
  );
}

export function TechnologiesAdminClient({
  initialTechnologies,
}: {
  initialTechnologies: AboutTechnologyRecord[];
}) {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const {status, showStatus} = useStatusMessage();
  const newTechnologyForm = useForm<TechnologyFormValues>({
    defaultValues: createFormValues(),
  });

  async function createTechnology(values: TechnologyFormValues) {
    try {
      const {technology} = await saveTechnology(values);
      setTechnologies((current) => [...current, technology]);
      newTechnologyForm.reset(createFormValues());
      showStatus(`Added ${technology.name}.`);
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
      setTechnologies((current) => current.filter((technology) => technology.id !== technologyId));
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
              setTechnologies((current) =>
                current.map((item) => (item.id === technology.id ? nextTechnology : item)),
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
  const form = useForm<TechnologyFormValues>({defaultValues: createFormValues(technology)});

  useEffect(() => {
    form.reset(createFormValues(technology));
  }, [form, technology]);

  async function handleSave(values: TechnologyFormValues) {
    try {
      const {technology: nextTechnology} = await saveTechnology(values, technology.id);
      onSave(nextTechnology);
      form.reset(createFormValues(nextTechnology));
      showStatus(`Saved ${nextTechnology.name}.`);
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

      <form onSubmit={form.handleSubmit(handleSave)}>
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
  control: Control<TechnologyFormValues>;
  namePrefix: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {technologyFields.map(({name, label, type, placeholder, required}) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({field}) => (
            <DashboardField
              label={label}
              name={`${namePrefix}-${name}`}
              type={type}
              value={field.value}
              placeholder={placeholder}
              required={required}
              onChange={field.onChange}
            />
          )}
        />
      ))}
    </div>
  );
}
