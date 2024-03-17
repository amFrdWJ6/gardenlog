import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { readFileSync } from "node:fs";

const schema = readFileSync("./drizzle/schema.sql", "utf-8");
const mockDatabase = new Database(":memory:");
mockDatabase.exec(schema);
export const db = drizzle(mockDatabase);
