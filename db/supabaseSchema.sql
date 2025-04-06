-- Table to store processed log statistics
CREATE TABLE log_stats (
    id SERIAL PRIMARY KEY,
    job_id TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    file_name TEXT NOT NULL,
    error_count INT NOT NULL,
    keyword_count JSONB NOT NULL,
    unique_ips TEXT[] NOT NULL,
    log_entries JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_stats_job_id ON log_stats(job_id);
CREATE INDEX idx_log_stats_user_id ON log_stats(user_id);

-- User authentication (Supabase handles auth internally)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
