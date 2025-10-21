INSERT OR REPLACE INTO messages(id, content) VALUES (1, 'Hello');
-- Insert dummy user
INSERT OR REPLACE INTO user (id, name, username, is_banned, is_admin)
VALUES (4900, 'Martin', 'Kabuum', 0, 0);

-- Insert dummy theme with a known ID
INSERT OR REPLACE INTO theme (id, name, user_id)
VALUES (9999, 'Pirates Night', 4900);

INSERT OR REPLACE INTO movie (id, tconst, movie_name, original_movie_name, year, runtime_minutes, is_active)
VALUES 
(999998, NULL, 'Gruppe 6 4 life', 'Gruppe 6 4 life', 2025, 120, 1), 
(999999, NULL, 'Heyo hows it going', 'Heyo hows it going', 2025, 120, 1);

-- Associate movies with this theme
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (9999, 999998);
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (9999, 999999);

-- Add drinking rules
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (9999, 'Drink when someone says "pirate"');
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (9999, 'Take a sip whenever a ship appears on screen');