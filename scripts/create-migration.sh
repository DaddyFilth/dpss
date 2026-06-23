#!/bin/bash

# Script to create a Prisma migration
# Usage: ./scripts/create-migration.sh <migration-name>

if [ -z "$1" ]; then
  echo "Usage: $0 <migration-name>"
  echo "Example: $0 add_product_categories"
  exit 1
fi

MIGRATION_NAME=$1

echo "Creating migration: $MIGRATION_NAME"
npx prisma migrate dev --name "$MIGRATION_NAME"
