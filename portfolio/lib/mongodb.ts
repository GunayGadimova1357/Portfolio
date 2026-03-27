import {MongoClient, type Db} from "mongodb";

const mongoUri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim() || "portfolio";

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function createClientPromise() {
  const promise = new MongoClient(mongoUri as string, {
    appName: "portfolio-dashboard",
  })
    .connect()
    .catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        global.__mongoClientPromise__ = undefined;
      }

      throw error;
    });

  if (process.env.NODE_ENV !== "production") {
    global.__mongoClientPromise__ = promise;
  }

  return promise;
}

export async function getDatabase(): Promise<Db> {
  const client = await (global.__mongoClientPromise__ ?? createClientPromise());
  return client.db(databaseName);
}
