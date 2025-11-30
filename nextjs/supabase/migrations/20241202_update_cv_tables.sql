-- Migration to add missing columns and convert to JSONB
-- This migration adds content, llm_metadata columns and converts job_context to JSONB

-- Add content column (JSONB for storing tagline, profile, slogan)
ALTER TABLE cv_versions
ADD COLUMN IF NOT EXISTS content JSONB;

-- Add llm_metadata column (JSONB for storing model, promptVersion, generatedAt)
ALTER TABLE cv_versions
ADD COLUMN IF NOT EXISTS llm_metadata JSONB;

-- Convert job_context from TEXT to JSONB if it exists as TEXT
-- First, check if job_context is TEXT and convert existing data
DO $$
BEGIN
  -- Check if the column is TEXT type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_versions'
    AND column_name = 'job_context'
    AND data_type = 'text'
  ) THEN
    -- Create a temporary column
    ALTER TABLE cv_versions ADD COLUMN job_context_jsonb JSONB;

    -- Copy and convert data (handle empty/null values)
    UPDATE cv_versions
    SET job_context_jsonb =
      CASE
        WHEN job_context IS NOT NULL AND job_context != '' THEN job_context::jsonb
        ELSE NULL
      END;

    -- Drop old column and rename new one
    ALTER TABLE cv_versions DROP COLUMN job_context;
    ALTER TABLE cv_versions RENAME COLUMN job_context_jsonb TO job_context;
  END IF;
END $$;

-- Ensure content has a default for existing rows (set to empty object)
UPDATE cv_versions
SET content = '{}'::jsonb
WHERE content IS NULL;
