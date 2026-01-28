
-- Insert dummy user
INSERT OR IGNORE INTO user (id, name, username, is_banned, is_admin)
VALUES
(1, 'John Test', 'tester', 0, 1 ),
(2, 'Mig Nielsen', 'Mig1', 0, 0),
(3, 'Mig Jensen', 'mig2', 0, 0),
(4, 'test Testsen', 'test', 0, 0),
(5, 'mig Larsen', 'mig', 0, 0),
(6, 'Jakob Topholt Jensen', 'Topholt', 0, 1),
(7, 'Kresten Laust', 'root', 0, 1);

-- Insert dummy theme with a known ID
INSERT OR IGNORE INTO theme (id, name, user_id, timestamp, vote_count)
VALUES (1, 'Pirates Night', 1, '2024-09-11 08:25:59', 10);

-- Associate movies with this theme
INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 1, 1
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 1);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 1, 2
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 2);

-- Add drinking rules
INSERT OR IGNORE INTO drinking_rule (id ,theme_id, rule_text)
VALUES
(1,1, 'Drink when someone says "pirate"'),
(2,1, 'Take a sip whenever a ship appears on screen');


-- Real startup day
INSERT OR IGNORE INTO event (id,event_date, theme_id)
VALUES (1,'2025-09-11 16:00:00', NULL);
INSERT OR IGNORE INTO event (id,event_date, theme_id)
VALUES (2,'2026-09-11 16:00:00', NULL);

