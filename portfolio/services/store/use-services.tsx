"use client";

import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {patchService, removeService} from "@/services/service/api.services";
import type {ServiceDraft, ServiceRecord} from "@/services/types/services";

type ServicesStoreValue = {
  services: ServiceRecord[];
  editingServiceId: string | null;
  editingDraft: ServiceDraft | null;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  startEdit: (service: ServiceRecord) => void;
  cancelEdit: () => void;
  updateDraft: (field: keyof ServiceDraft, value: string | boolean) => void;
  updateService: () => Promise<boolean>;
  deleteService: (service: ServiceRecord) => Promise<boolean>;
};

const ServicesStoreContext = createContext<ServicesStoreValue | null>(null);

function toDraft(service: ServiceRecord): ServiceDraft {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    sortOrder: String(service.sortOrder),
    published: service.published,
  };
}

export function ServicesStoreProvider({
  children,
  initialServices,
  onMutate,
}: {
  children: React.ReactNode;
  initialServices: ServiceRecord[];
  onMutate: () => void;
}) {
  const [services, setServices] = useState(initialServices);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ServiceDraft | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setServices(initialServices);

    if (!editingServiceId) {
      return;
    }

    const currentService = initialServices.find((service) => service.id === editingServiceId);

    if (!currentService) {
      setEditingServiceId(null);
      setEditingDraft(null);
      return;
    }

    setEditingDraft(toDraft(currentService));
  }, [editingServiceId, initialServices]);

  const value = useMemo<ServicesStoreValue>(
    () => ({
      services,
      editingServiceId,
      editingDraft,
      isUpdating,
      isDeleting,
      error,
      startEdit(service) {
        setError(null);
        setEditingServiceId(service.id);
        setEditingDraft(toDraft(service));
      },
      cancelEdit() {
        setError(null);
        setEditingServiceId(null);
        setEditingDraft(null);
      },
      updateDraft(field, value) {
        setEditingDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            [field]: value,
          };
        });
      },
      async updateService() {
        if (!editingServiceId || !editingDraft) {
          return false;
        }

        const id = editingDraft.id.trim();
        const title = editingDraft.title.trim();
        const description = editingDraft.description.trim();
        const sortOrder = Number(editingDraft.sortOrder);

        if (!id || !title || !description) {
          setError("All service fields are required.");
          return false;
        }

        if (!Number.isFinite(sortOrder)) {
          setError("Sort order must be a number.");
          return false;
        }

        setIsUpdating(true);
        setError(null);

        try {
          const {service} = await patchService(editingServiceId, {
            id,
            title,
            description,
            sortOrder,
            published: editingDraft.published,
          });

          setServices((current) =>
            [...current]
              .map((item) => (item.id === editingServiceId ? service : item))
              .sort((left, right) => {
                if (left.sortOrder !== right.sortOrder) {
                  return left.sortOrder - right.sortOrder;
                }

                return left.title.localeCompare(right.title);
              }),
          );
          setEditingServiceId(null);
          setEditingDraft(null);
          onMutate();
          return true;
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : "Failed to update service.");
          return false;
        } finally {
          setIsUpdating(false);
        }
      },
      async deleteService(service) {
        setIsDeleting(true);
        setError(null);

        try {
          await removeService(service.id);
          setServices((current) => current.filter((item) => item.id !== service.id));

          if (editingServiceId === service.id) {
            setEditingServiceId(null);
            setEditingDraft(null);
          }

          onMutate();
          return true;
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : "Failed to delete service.");
          return false;
        } finally {
          setIsDeleting(false);
        }
      },
    }),
    [editingDraft, editingServiceId, error, isDeleting, isUpdating, onMutate, services],
  );

  return <ServicesStoreContext value={value}>{children}</ServicesStoreContext>;
}

export function useServicesStore() {
  const store = useContext(ServicesStoreContext);

  if (!store) {
    throw new Error("useServicesStore must be used within ServicesStoreProvider.");
  }

  return store;
}
