import { RPlant, WPlant, tblPlant } from "./schema";
import { CreateDBRecord, GetDBRecord } from "./queries";
import { db } from "./__mocks__/setup";
import { mockData } from "./__mocks__/data";

const plantRecord: WPlant = mockData.plant;
const plantResult: RPlant = mockData.plant;

test("CreateDBRecord", async () => {
  const plant = await CreateDBRecord(db, tblPlant, plantRecord);
  expect(plant).toStrictEqual({ id: 1 });
});

test("GetDBRecord", async () => {
  const plant = await GetDBRecord(db, tblPlant, plantResult.id);
  expect(plant).toStrictEqual(plantRecord);
});
