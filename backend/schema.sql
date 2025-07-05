/* ---------------------------------------------------------------------------
   Database schema for Job-Search Agent
   Compatible with sqlite-vec ≥ 0.1 (vec0 virtual table)
--------------------------------------------------------------------------- */

/* 1. master catalog of every job scraped */
CREATE TABLE IF NOT EXISTS jobs (
  id             TEXT PRIMARY KEY,            -- stable hash or site UUID
  title          TEXT,
  company        TEXT,
  location       TEXT,
  url            TEXT,
  date_applied   DATE,                        -- renamed from 'posted'
  status         TEXT,                        -- added status field
  jd             TEXT,                        -- full job-description HTML/markdown

  /* agent-generated scoring & commentary */
  match_score    REAL      DEFAULT 0.0,       -- 0-1 fit score
  rationale      TEXT,                        -- short LLM explanation
  recommendation TEXT,                        -- 'apply' | 'skip' | 'stretch'

  scraped_at     DATETIME  DEFAULT CURRENT_TIMESTAMP
);

/* 2. vector index for semantic search / similarity */
CREATE VIRTUAL TABLE IF NOT EXISTS job_vectors
  USING vec0(
    embedding FLOAT[384]
  );

/* 3. pipeline tracking: what *you* did with each job */
CREATE TABLE IF NOT EXISTS applications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id      TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status      TEXT NOT NULL CHECK (status IN (
               'new','shortlisted','applied',
               'interview','offer','rejected','withdrawn')),
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS applications_job_id_idx ON applications(job_id);
