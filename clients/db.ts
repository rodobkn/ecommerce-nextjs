import "server-only";
import { Firestore } from "@google-cloud/firestore";

const firestoreClientSingleton = () => {
  return new Firestore({
    projectId: process.env.PROJECT_ID,
    databaseId: process.env.DATABASE_ID
  })
}

declare const globalThis: {
  firestoreGlobal: Firestore | undefined;
} & typeof global;

const db = globalThis.firestoreGlobal ?? firestoreClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.firestoreGlobal = db;
