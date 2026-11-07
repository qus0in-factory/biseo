-- Migration 0013: remove usage history (decision: #189, #232). Irreversible: rows are lost.
DROP INDEX IF EXISTS usage_history_observed;
DROP TABLE IF EXISTS usage_history;
