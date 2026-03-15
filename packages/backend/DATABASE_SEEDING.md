# Database Seeding

This project includes a database seeding system to automatically create test data in development.

## Test User

A test user is automatically created when you start the backend in development mode:

- **Email:** `test@gualet.app`
- **Password:** `test1234`

This user includes:
- Default income and expense categories
- Default payment methods
- Default user preferences

## How it works

The seeding system runs automatically when:
- You start the backend in development mode: `npm run dev`
- The backend detects `NODE_ENV=development`

The seeder is **idempotent** - it checks if the test user already exists before creating it, so it's safe to run multiple times.

## Manual Seeding

You can also run the seeding manually:

```bash
# From the backend directory
npm run db:seed

# From the root directory
npm run db:seed -w packages/backend
```

## Files

- `src/db/seeders/user.seeder.ts` - Creates the test user
- `src/db/seed.ts` - Entry point for manual seeding
- `src/main.ts` - Runs seeders automatically in development

## Adding More Seeders

To add more seeders:

1. Create a new seeder in `src/db/seeders/`
2. Export it from `src/db/seeders/index.ts`
3. Add it to the `runSeeders()` function in `src/main.ts`

Example:

```typescript
// src/db/seeders/transaction.seeder.ts
export class TransactionSeeder {
  constructor(private readonly dataSource: DataSource) {}
  
  async run(): Promise<void> {
    // Your seeding logic here
  }
}
```

## Notes

- Seeders only run in **development mode** (when `NODE_ENV=development`)
- The test user's categories and payment methods are created automatically by the `UserService` during registration
- The system uses a separate database connection to avoid conflicts with the main application

