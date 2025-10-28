
INSERT OR REPLACE INTO messages(id, content) VALUES (1, 'Hello');
-- Insert dummy user
INSERT OR REPLACE INTO user (id, name, username, is_banned, is_admin)
VALUES (1, 'Martin', 'Kabuum', 0, 0);

-- Insert dummy theme with a known ID
INSERT OR REPLACE INTO theme (id, name, user_id)
VALUES (1, 'Pirates Night', 1);

-- Associate movies with this theme
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id)
SELECT 1, 1
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 1);

INSERT OR REPLACE INTO theme_movie (theme_id, movie_id)
SELECT 1, 2
WHERE EXISTS (SELECT 1 FROM movie WHERE id = 2);

-- Add drinking rules
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (1, 'Drink when someone says "pirate"');
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (1, 'Take a sip whenever a ship appears on screen');
