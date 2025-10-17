import {test as base} from '@playwright/test';
import {DatabaseManager} from "./db/database-manager";

type TestFixtures = {
  db: DatabaseManager;
};

export const test = base.extend<TestFixtures>({
  db: async ({}, use) => {
    const db = await DatabaseManager.create();

    await use(db);
  },
});
