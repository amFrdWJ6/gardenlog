import { InferInsertModel } from "drizzle-orm";
import {
  AnySQLiteColumn,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const tblPlant = sqliteTable(
  "plant",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    content: text("content"),
    days_to_harvest: integer("days_to_harvest", { mode: "number" }),
  },
  (tbl) => {
    return {
      nameIdx: index("plant_name_idx").on(tbl.name),
    };
  }
);
export type WPlant = InferInsertModel<typeof tblPlant>;

export const tblLog = sqliteTable(
  "log",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    parent_id: integer("parent_id", { mode: "number" }).references(
      (): AnySQLiteColumn => tblLog.id
    ),
    plant_id: integer("plant_id", { mode: "number" }).references(
      () => tblPlant.id
    ),
    location_id: integer("location_id", { mode: "number" }).references(
      () => tblLocation.id
    ),
    name: text("name"),
    quantity: integer("quantity", { mode: "number" }),
    harvest: text("harvest"),
  },
  (tbl) => {
    return {
      logIdx: index("log_name_idx").on(tbl.name),
    };
  }
);
export type WLog = InferInsertModel<typeof tblLog>;

export const tblLogRecord = sqliteTable(
  "log_record",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    log_id: integer("log_id", { mode: "number" }).references(() => tblLog.id),
    name: text("name"),
    content: text("content"),
    timestamp: integer("timestamp", { mode: "timestamp_ms" }),
  },
  (tbl) => {
    return {
      recordIdx: index("log_record_name_idx").on(tbl.name),
    };
  }
);
export type WLogRecord = InferInsertModel<typeof tblLogRecord>;

export const tblNote = sqliteTable(
  "note",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    log_id: integer("log_id", { mode: "number" }).references(() => tblLog.id),
    plant_id: integer("plant_id", { mode: "number" }).references(
      () => tblPlant.id
    ),
    name: text("name"),
    content: text("content"),
  },
  (tbl) => {
    return {
      noteIdx: index("note_name_idx").on(tbl.name),
    };
  }
);
export type WNote = InferInsertModel<typeof tblNote>;

export const tblLocation = sqliteTable("location", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
export type WLocation = InferInsertModel<typeof tblLocation>;

// map requirements:
// - location can have a several maps (last year, planning for next years, variations)
// - each map can have a several shapes (assign a color to each)
// - each shape can have N vertices
// - TODO: research how to count a possible amount of plants based on their preffered spacing

/* 
export const tblMap = sqliteTable("map", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  location_id: integer("location_id", { mode: "number" }).references(
    () => tblLocation.id
  ),
  name: text("name").notNull(),
  desc: text("description"),
  width: integer("width", { mode: "number" }),
  height: integer("height", { mode: "number" }),
});

export const tblShape = sqliteTable("shape", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  desc: text("description"),
  color: text("color").notNull(),
});

export const tblVertex = sqliteTable("vertex", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  shape_id: integer("shape_id", { mode: "number" }).references(
    () => tblShape.id
  ),
  x: integer("x", { mode: "number" }).notNull(),
  y: integer("y", { mode: "number" }).notNull(),
});

export const tblShapeToMap = sqliteTable(
  "shape_to_map",
  {
    shape_id: integer("shape_id", { mode: "number" }).references(
      () => tblShape.id
    ),
    map_id: integer("map_id", { mode: "number" }).references(() => tblMap.id),
  },
  (tbl) => {
    return {
      pk: primaryKey({
        name: "tag_to_reply_PK",
        columns: [tbl.shape_id, tbl.map_id],
      }),
    };
  }
);

*/
