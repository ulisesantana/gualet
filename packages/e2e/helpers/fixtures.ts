import {test as base} from '@playwright/test';
import {DatabaseManager} from "./db/database-manager";

type TestFixtures = {
  db: DatabaseManager;
};

export const test = base.extend<TestFixtures>({
  db: async ({}, use) => {
    const db = await DatabaseManager.create();

    // Provide the database manager to the test
    await use(db);

    // Cleanup: reset database after each test
    await db.reset();
  },
});
