import {
  ColumnBaseConfig,
  ColumnDataType,
  Placeholder,
  SQL,
  Table,
} from "drizzle-orm";
import {
  SQLiteColumn,
  SQLiteTable,
  TableConfig,
} from "drizzle-orm/sqlite-core";

type DBTable = SQLiteTable<TableConfig>;
type DBExtendColumn = SQLiteColumn<
  ColumnBaseConfig<ColumnDataType, string>,
  object
>;
export type DBTableWithID = DBTable & { id: DBExtendColumn };
export type DBTableWithName = DBTable & { name: DBExtendColumn };

export type DBTypeHelper = {
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
