
-- Insert dummy user
INSERT OR IGNORE INTO user (id, name, username, is_banned, is_admin)
VALUES
    (1, 'John Test', 'tester', 0, 1 ),
(2, 'Mig', 'Mig1', 0, 0),
(3, 'Mig', 'mig2', 0, 0),
(4, 'test', 'test', 0, 0),
(5, 'mig', 'mig', 0, 0);

-- Insert dummy theme with a known ID
INSERT OR IGNORE INTO theme (id, name, user_id, timestamp)
VALUES (1, 'Pirates Night', 1, '2024-09-11 08:25:59');

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
(NULL, '/film/starwars', 1),
('https://www.example.com/audio/intro.mp3', Null, 2),
(NULL, '/nature/rain', 3),
('https://cdn.example.com/sound/birds.mp3', Null, 3),
(NULL, '/music/rock_guitar', 2),
(Null, '/studio/drums', 4),
(NULL, '/mix/testtrack', 5),
('https://sound.example.com/mixdown/final', Null, 5),
('https://www.example.com/effects/laser.mp3', NULL, 3),
(NULL, '/ambient/forest', 3),
('https://cdn.example.com/sound/wind.mp3', NULL, 1),
(NULL, '/sfx/explosion', 5),
('https://media.example.com/sample/piano', NULL, 5),
(NULL, '/music/classic', 1),
('https://www.google.dk/tik-tok.com/1', NULL, 1),
(NULL, '/studio/bass', 4),
('https://cdn.example.com/sound/drums_loop.mp3', NULL, 5),
(NULL, '/mix/track1', 5),
('https://media.example.com/sample/guitar', NULL, 2),
(NULL, '/nature/waterfall', 3);

-- Real startup day
INSERT OR IGNORE INTO event (event_date, theme_id)
VALUES ('2025-09-11 16:00:00', NULL);