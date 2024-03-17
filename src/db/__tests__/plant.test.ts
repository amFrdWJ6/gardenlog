import {
  CreateDBRecord,
  DeleteDBRecord,
  GetDBRecord,
  GetDBRecords,
  UpdateDBRecord,
} from "../queries";
import { tblPlant } from "../schema";
import { db } from "../__mocks__/setup";
import { DataValidationError } from "../errors";

describe("Table: plant", () => {
  describe("Queries", () => {
    const mockData = {
      insert: {
        id: 1,
        name: "CarolinaReaper",
        content: "",
        days_to_harvest: 90,
      },
      update: {
        id: 1,
        name: "Carolina Reaper",
        content: "Capsicum chinense",
        days_to_harvest: 95,
      },
    };

    test("CreateDBRecord", async () => {
      const expected = { id: 1 };
      const result = await CreateDBRecord(db, tblPlant, mockData.insert);
      expect(result).toEqual(expected);
    });

    test("GetDBRecords", async () => {
      const expected = [mockData.insert];
      const result = await GetDBRecords(db, tblPlant, "reaper");
      expect(result).toEqual(expected);
    });

    test("UpdateDBRecord", async () => {
      const expected = { changes: 1, lastInsertRowid: 1 };
      const result = await UpdateDBRecord(
        db,
        tblPlant,
        mockData.insert.id,
        mockData.update
      );
      expect(result).toEqual(expected);
    });

    test("GetDBRecord after update", async () => {
      const expected = mockData.update;
      const result = await GetDBRecord(db, tblPlant, mockData.insert.id);
      expect(result).toEqual(mockData.update);
    });

    test("DeleteDBRecord", async () => {
      const expected = { changes: 1, lastInsertRowid: 1 };
      const result = await DeleteDBRecord(db, tblPlant, 1);
      expect(result).toEqual(expected);
    });

    test("GetDBRecord after delete", async () => {
      const result = await GetDBRecord(db, tblPlant, mockData.insert.id);
      expect(result).toBeUndefined();
    });
  });

  describe("Wrong data", () => {
    const mockData = {
      doesNotExists: undefined,
    };

    test("CreateDBRecord", async () => {
      expect(
        async () => await CreateDBRecord(db, tblPlant, mockData)
      ).rejects.toThrow(DataValidationError);
    });
  });
});
