-- Users
INSERT INTO user (name, username, is_banned, is_admin) VALUES
('Tester1', 'test1', 0, 1),
('Tester2', 'test2',   0, 0);

-- Movies
INSERT INTO movie (tconst, movie_name, original_movie_name, year, runtime_minutes, is_active, is_series, poster_url, rating) VALUES
('tt0133093', 'The Matrix', 'The Matrix', 1999, 136, 1, 0, NULL, '8.7'),
('tt0083658', 'Blade Runner', 'Blade Runner', 1982, 117, 1, 0, NULL, '8.1');

-- Theme
INSERT INTO theme (name, user_id) VALUES
('Cyber Night', 1);

-- Theme Movies
INSERT INTO theme_movie (theme_id, movie_id) VALUES
(1, 1),
(1, 2);

-- Drinking rules
INSERT INTO drinking_rule (theme_id, rule_text) VALUES
(1, 'Drink when someone says “matrix”.'),
(1, 'Sip when there’s neon lighting.');

-- Sound samples
INSERT INTO sound_samples (link, file_path, user_id) VALUES
('https://example.com/sample.mp3', NULL, 2);

-- Event
INSERT INTO event (event_date, theme_id) VALUES
('2025-11-15', 1);

-- AuthController test
INSERT INTO user (name, username, is_banned, is_admin) VALUES
('Allowed User', 'allowed_user', 0, 0),
('Banned User',  'banned_user',  1, 0);

