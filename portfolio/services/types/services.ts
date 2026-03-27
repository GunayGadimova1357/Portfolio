export type ServiceRecord = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

export type ServiceDraft = {
  id: string;
  title: string;
  description: string;
  sortOrder: string;
  published: boolean;
};

export type ServicePayload = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

export type ServicesListResponse = {
  services: ServiceRecord[];
};

export type ServiceResponse = {
  service: ServiceRecord;
};
