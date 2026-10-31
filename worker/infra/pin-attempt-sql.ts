export const BUMP_SQL = `INSERT INTO pin_attempts(scope,failures,window_started_at,locked_until)
VALUES(?1,1,?2,0)
ON CONFLICT(scope) DO UPDATE SET
 failures=CASE WHEN ?2-window_started_at>=?3 THEN 1 ELSE failures+1 END,
 window_started_at=CASE WHEN ?2-window_started_at>=?3 THEN ?2 ELSE window_started_at END,
 locked_until=CASE WHEN (CASE WHEN ?2-window_started_at>=?3 THEN 1 ELSE failures+1 END)>=?4
  THEN ?2+?5 ELSE 0 END
RETURNING locked_until, failures`
