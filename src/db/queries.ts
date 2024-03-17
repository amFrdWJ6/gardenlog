import { eq, like } from "drizzle-orm";
import { DBTableWithID, DBTableWithName, DBTypeHelper } from "./types";
import type { IDB } from "./setup";
import { DataValidationError } from "./errors";

function isSQLiteConstraintNull(error: unknown): error is { code: string } {
  if (error && typeof error === "object" && "code" in error) {
    return error.code === "SQLITE_CONSTRAINT_NOTNULL";
  }
  return false;
}

export async function CreateDBRecord<
  Table extends DBTableWithID,
  TypeHelper extends DBTypeHelper
>(db: IDB, dbTable: Table, newRecord: TypeHelper) {
  try {
    return db
      .insert(dbTable)
      .values(newRecord)
      .returning({ id: dbTable.id })
      .get() as { id: number };
  } catch (error) {
    if (isSQLiteConstraintNull(error)) {
      // FIX: Element implicitly has an 'any' type because expression of type 'symbol' can't be used to index type 'SQLiteTable<TableConfig> & { id: DBExtendColumn; }'.ts(7053)
      const table = dbTable[Symbol.for("drizzle:Name")];
      const data = JSON.stringify(newRecord, (_, v) =>
        v === undefined ? null : v
      );
      // TODO: better msg + cleanup
      console.log(`Invalid data: ${data} for table: ${table}`);
      throw new DataValidationError(
        `Invalid data: ${newRecord} for table: ${table}`
      );
    } else {
      throw error;
    }
  }
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
