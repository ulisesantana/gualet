#!/bin/sh
set -e

echo "▶️  Running database migrations..."
node node_modules/typeorm/cli.js migration:run \
  -d packages/backend/dist/db/data-source.js
echo "✅ Migrations complete"

echo "🚀 Starting application..."
exec node packages/backend/dist/main
