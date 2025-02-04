#!/usr/bin/env bash
# build.sh
npm install
npm run build

# Run database migrations
psql $DATABASE_URL < backend/db/schema.sql

chmod +x build.sh