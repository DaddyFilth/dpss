# Prisma Migration Workflow

## Development Environment

In an interactive terminal (local development), use these commands:

### Create a new migration
```bash
npm run db:migrate:dev -- --name <migration-name>
# or
npx prisma migrate dev --name <migration-name>
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate the Prisma Client

### Reset database (destructive)
```bash
npm run db:reset
# or
npx prisma migrate reset
```

This will:
1. Drop the database
2. Re-create it
3. Apply all migrations
4. Re-run the seed script

## Production/CI Environment

For non-interactive environments (CI/CD, production):

### Apply migrations
```bash
npm run db:migrate
# or
npx prisma migrate deploy
```

This applies all pending migrations without prompting.

## Quick Development (No Migrations)

For rapid prototyping, you can use `db push`:

```bash
npm run db:push
# or
npx prisma db push
```

**Note:** This bypasses the migration history and is not recommended for production.

## Migration Best Practices

1. **Always create migrations for schema changes** in development
2. **Review migration files** before committing
3. **Test migrations** in a staging environment
4. **Keep migrations atomic** - one logical change per migration
5. **Never edit existing migration files** - create new ones instead

## Current Status

- ✅ Migration directory created: `prisma/migrations/`
- ✅ Migration scripts configured in package.json
- ⚠️ Initial migration needs to be created in interactive environment

## Next Steps

To create the initial migration, run in an interactive terminal:
```bash
npx prisma migrate dev --name init
```

This will create the first migration file capturing your current schema.
