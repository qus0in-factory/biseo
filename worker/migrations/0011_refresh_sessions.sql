CREATE TABLE refresh_sessions (
 id TEXT PRIMARY KEY,
 subject TEXT NOT NULL,
 host TEXT NOT NULL,
 auth TEXT NOT NULL CHECK(auth IN ('password','pin')),
 current_hash TEXT NOT NULL UNIQUE,
 generation INTEGER NOT NULL DEFAULT 0,
 expires INTEGER NOT NULL,
 idle INTEGER NOT NULL,
 revoked INTEGER
);
CREATE TABLE refresh_tokens (
 hash TEXT PRIMARY KEY,
 family TEXT NOT NULL REFERENCES refresh_sessions(id) ON DELETE CASCADE,
 generation INTEGER NOT NULL
);
CREATE INDEX refresh_subject ON refresh_sessions(subject,host,expires);
CREATE INDEX refresh_family ON refresh_tokens(family);
