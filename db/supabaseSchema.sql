-- Table to store processed log statistics
CREATE TABLE log_stats (
    id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL,
    error_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User authentication (Supabase handles auth internally)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
