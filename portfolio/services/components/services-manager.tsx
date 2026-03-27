"use client";

import {useRouter} from "next/navigation";
import {DashboardCheckbox, DashboardField} from "@/components/dashboard/project-form-fields";
import {ServicesStoreProvider, useServicesStore} from "@/services/store/use-services";
import type {ServiceRecord} from "@/services/types/services";

export function ServicesManager({initialServices}: {initialServices: ServiceRecord[]}) {
  const router = useRouter();

  return (
    <ServicesStoreProvider initialServices={initialServices} onMutate={() => router.refresh()}>
      <ServicesManagerContent />
    </ServicesStoreProvider>
  );
}

function ServicesManagerContent() {
  const {
    services,
    editingServiceId,
    editingDraft,
    isUpdating,
    isDeleting,
    error,
    startEdit,
    cancelEdit,
    updateDraft,
    updateService,
    deleteService,
  } = useServicesStore();

  async function handleDelete(service: ServiceRecord) {
    const confirmed = window.confirm(`Delete service "${service.title}"?`);

    if (!confirmed) {
      return;
    }

    await deleteService(service);
  }

  return services.length > 0 ? (
    <section className="grid gap-5 xl:grid-cols-2">
      {services.map((service) => {
        const isEditing = editingServiceId === service.id && Boolean(editingDraft);

        return (
          <article
            key={service.id}
            className="rounded-[1.8rem] border border-white/10 bg-[#101015] p-5"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-1 text-sm text-white/42">{service.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs",
                    service.published
                      ? "border-white/18 bg-black/55 text-white"
                      : "border-white/10 bg-black/45 text-white/65",
                  ].join(" ")}
                >
                  {service.published ? "Published" : "Draft"}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">
                  #{service.sortOrder}
                </span>
              </div>
            </div>

            <p className="text-sm leading-6 text-white/58">{service.description}</p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => startEdit(service)}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service)}
                disabled={isDeleting}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>

            {isEditing ? (
              <form
                className="mt-5 grid gap-4 md:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await updateService();
                }}
              >
                <DashboardField
                  label="Service ID"
                  name="id"
                  value={editingDraft?.id ?? ""}
                  onChange={(value) => updateDraft("id", value)}
                />
                <DashboardField
                  label="Title"
                  name="title"
                  value={editingDraft?.title ?? ""}
                  onChange={(value) => updateDraft("title", value)}
                />
                <div className="md:col-span-2">
                  <DashboardField
                    label="Description"
                    name="description"
                    value={editingDraft?.description ?? ""}
                    onChange={(value) => updateDraft("description", value)}
                    multiline
                  />
                </div>
                <DashboardField
                  label="Display order"
                  name="sortOrder"
                  type="number"
                  value={editingDraft?.sortOrder ?? ""}
                  onChange={(value) => updateDraft("sortOrder", value)}
                />
                <div className="md:col-span-2">
                  <DashboardCheckbox
                    label="Published"
                    name="published"
                    checked={editingDraft?.published ?? false}
                    onCheckedChange={(value) => updateDraft("published", value)}
                  />
                </div>

                {error ? (
                  <p className="md:col-span-2 text-sm text-[#ff8b8b]">{error}</p>
                ) : null}

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </article>
        );
      })}
    </section>
  ) : (
    <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-8 text-center">
      <h2 className="text-2xl font-semibold text-white">No services found</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">
        Add service records in the dashboard and they will appear here for editing.
      </p>
    </section>
  );
}
