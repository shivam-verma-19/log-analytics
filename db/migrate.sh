#!/bin/bash

# Load environment variables
source .env

echo "Running database migrations on Supabase..."

# Apply schema changes
psql "$SUPABASE_DB_URL" -f db/supabaseSchema.sql

echo "Migration complete!"
