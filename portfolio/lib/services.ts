import {getDatabase} from "@/lib/mongodb";
import type {ServiceRecord} from "@/services/types/services";

const servicesCollectionName = "services";

async function getServicesCollection() {
  return (await getDatabase()).collection<ServiceRecord>(servicesCollectionName);
}

function sortServices(services: ServiceRecord[]) {
  return [...services].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getAllServices() {
  const collection = await getServicesCollection();
  return sortServices(await collection.find({}, {projection: {_id: 0}}).toArray());
}

export async function updateService(serviceId: string, nextService: ServiceRecord) {
  const collection = await getServicesCollection();
  const result = await collection.updateOne({id: serviceId}, {$set: nextService});

  if (result.matchedCount === 0) {
    throw new Error("Service not found.");
  }
}

export async function deleteService(serviceId: string) {
  const collection = await getServicesCollection();
  const result = await collection.deleteOne({id: serviceId});

  if (result.deletedCount === 0) {
    throw new Error("Service not found.");
  }
}
