
-- Insert dummy user
INSERT OR IGNORE INTO user (id, name, username, is_banned, is_admin)
VALUES
    (1, 'John Test', 'tester', 0, 1 ),
(2, 'Mig Nielsen', 'Mig1', 0, 0),
(3, 'Mig Jensen', 'mig2', 0, 0),
(4, 'test Testsen', 'test', 0, 0),
(5, 'mig Larsen', 'mig', 0, 0);

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

-- Dummy sound samples
INSERT OR IGNORE INTO sound_samples (link, file_path, user_id)
VALUES 
('https://www.youtube.com/watch?v=lrb7ZLmvzQQ', Null, 2),
('https://www.youtube.com/watch?v=wS0Q__itaoQ', Null, 3),
(NULL, 'rock.mp3', 2),
('https://www.youtube.com/watch?v=U7m_twP45c4', Null, 5),
('https://www.youtube.com/watch?v=jNQXAC9IVRw', NULL, 3),
('https://www.youtube.com/watch?v=jqw7B8RtxRk', NULL, 1),
(NULL, 'explosion.mp4', 5),
('https://www.youtube.com/watch?v=HZ8VF0EdITk', NULL, 5),
('https://www.youtube.com/watch?v=n_y2rayU_y8', NULL, 1),
('https://www.youtube.com/watch?v=lrb7ZLmvzQQ', NULL, 5);

-- Real startup day
INSERT OR IGNORE INTO event (id,event_date, theme_id)
VALUES (1,'2025-09-11 16:00:00', NULL);
INSERT OR IGNORE INTO event (id,event_date, theme_id)
VALUES (2,'2026-09-11 16:00:00', NULL);




-- test theme/events
INSERT OR IGNORE INTO theme (id, name, user_id, vote_count)
VALUES (2, 'Bad Superhero Movies', 1, 5);
INSERT OR IGNORE INTO theme (id, name, user_id, vote_count)
VALUES (3, '9/11', 1, 3);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 1, 1426
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 1426);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 1, 65319
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 65319);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 2, 236549
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 236549);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 2, 173791
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 173791);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 3, 305809
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 305809);

INSERT OR IGNORE INTO theme_movie (theme_id, movie_id)
SELECT 3, 380580
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 380580);

INSERT OR IGNORE INTO drinking_rule (id ,theme_id, rule_text)
VALUES
(1,1, 'Drink when someone says "pirate"'),
(2,1, 'Take a sip whenever a ship appears on screen');
INSERT OR IGNORE INTO drinking_rule (id ,theme_id, rule_text)
VALUES
(3,2, 'Drink when someone says "pirate"'),
(4,2, 'Take a sip whenever a ship appears on screen');
INSERT OR IGNORE INTO drinking_rule (id ,theme_id, rule_text)
VALUES
(5,3, 'Drink when someone says "pirate"'),
(6,3, 'Take a sip whenever a ship appears on screen');

INSERT INTO event (event_date, theme_id)
SELECT '2026-02-05 16:45:00', 1
WHERE NOT EXISTS (
  SELECT 1 FROM event
  WHERE event_date = '2026-02-05 16:45:00'
    AND theme_id   = 1
);

INSERT INTO event (event_date, theme_id)
SELECT '2026-02-12 16:45:00', 2
WHERE NOT EXISTS (
  SELECT 1 FROM event
  WHERE event_date = '2026-02-12 16:45:00'
    AND theme_id   = 2
);

INSERT INTO event (event_date, theme_id)
SELECT '2026-02-19 16:45:00', 3
WHERE NOT EXISTS (
  SELECT 1 FROM event
  WHERE event_date = '2026-02-19 16:45:00'
    AND theme_id   = 3
);
