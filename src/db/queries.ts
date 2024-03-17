import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import {
  ColumnBaseConfig,
  ColumnDataType,
  Placeholder,
  SQL,
  Table,
  eq,
  like,
} from "drizzle-orm";
import {
  SQLiteColumn,
  SQLiteTable,
  TableConfig,
} from "drizzle-orm/sqlite-core";

const sqlite = new Database("data/gardenlog.db");
const db = drizzle(sqlite, {
  logger: process.env.DBLOGGER === "true" ? true : false,
});

type DBTable = SQLiteTable<TableConfig>;
type DBExtendColumn = SQLiteColumn<
  ColumnBaseConfig<ColumnDataType, string>,
  object
>;
type DBTableWithID = DBTable & { id: DBExtendColumn };
type DBTableWithName = DBTable & { name: DBExtendColumn };

type DBTypeHelper = {
  [K in keyof {
    [Key in keyof Table["$inferInsert"]]:
      | SQL<unknown>
      | Placeholder<string, any>
      | Table["$inferInsert"][Key];
  }]: {
    [Key in keyof Table["$inferInsert"]]:
      | SQL<unknown>
      | Placeholder<string, any>
      | Table["$inferInsert"][Key];
  }[K];
};

export async function CreateDBRecord<
  Table extends SQLiteTable<TableConfig> & {
    id: SQLiteColumn<ColumnBaseConfig<ColumnDataType, string>, object>;
  },
  TypeHelper extends DBTypeHelper
>(dbTable: Table, newRecord: TypeHelper) {
  return db
    .insert(dbTable)
    .values(newRecord)
    .returning({ id: dbTable.id })
    .get() as { id: number };
}

export async function UpdateDBRecord<
  Table extends DBTableWithID,
  TypeHelper extends DBTypeHelper
>(dbTable: Table, id: number, values: TypeHelper) {
  return db.update(dbTable).set(values).where(eq(dbTable.id, id)).run();
}

export async function DeleteDBRecord<Table extends DBTableWithID>(
  dbTable: Table,
  id: number
) {
  return db.delete(dbTable).where(eq(dbTable.id, id)).run();
}

export async function GetDBRecord<Table extends DBTableWithID>(
  dbTable: Table,
  id: number
) {
  return db.select().from(dbTable).where(eq(dbTable.id, id)).get();
}

export async function GetDBRecords<Table extends DBTableWithName>(
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
