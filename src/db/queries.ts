import { eq, like } from "drizzle-orm";
import { DBTableWithID, DBTableWithName, DBTypeHelper } from "./types";
import type { IDB } from "./setup";

export async function CreateDBRecord<
  Table extends DBTableWithID,
  TypeHelper extends DBTypeHelper
>(db: IDB, dbTable: Table, newRecord: TypeHelper) {
  return db
    .insert(dbTable)
    .values(newRecord)
    .returning({ id: dbTable.id })
    .get() as { id: number };
}

export async function UpdateDBRecord<
  Table extends DBTableWithID,
  TypeHelper extends DBTypeHelper
>(db: IDB, dbTable: Table, id: number, values: TypeHelper) {
  return db.update(dbTable).set(values).where(eq(dbTable.id, id)).run();
}

export async function DeleteDBRecord<Table extends DBTableWithID>(
  db: IDB,
  dbTable: Table,
  id: number
) {
  return db.delete(dbTable).where(eq(dbTable.id, id)).run();
}

export async function GetDBRecord<Table extends DBTableWithID>(
  db: IDB,
  dbTable: Table,
  id: number
) {
  return db.select().from(dbTable).where(eq(dbTable.id, id)).get();
}

export async function GetDBRecords<Table extends DBTableWithName>(
  db: IDB,
  dbTable: Table,
  search?: string
) {
  return db
    .select()
    .from(dbTable)
    .where(search ? like(dbTable.name, `%${search}%`) : undefined)
    .all();
}

// TODO: GetDBRecord/s with partial select
