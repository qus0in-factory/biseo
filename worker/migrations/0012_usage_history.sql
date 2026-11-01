CREATE TABLE usage_history (
  provider TEXT NOT NULL,
  observed INTEGER NOT NULL,
  five REAL NOT NULL,
  week REAL NOT NULL,
  fiveReset TEXT NOT NULL,
  weekReset TEXT NOT NULL,
  PRIMARY KEY (provider, observed)
);
CREATE INDEX usage_history_observed ON usage_history(observed);
