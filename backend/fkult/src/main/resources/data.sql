INSERT OR REPLACE INTO messages(id, content) VALUES (1, 'Hello');
-- Insert dummy user
INSERT OR REPLACE INTO user (id, name, username, is_banned, is_admin)
VALUES (1, 'Martin', 'Kabuum', 0, 0);

-- Insert dummy theme with a known ID
INSERT OR REPLACE INTO theme (id, name, user_id)
VALUES (1, 'Pirates Night', 1);

INSERT OR REPLACE INTO movie (id, tconst, movie_name, original_movie_name, year, runtime_minutes, is_active)
VALUES 
(1, NULL, 'Gruppe 6 4 life', 'Gruppe 6 4 life', 2025, 120, 1), 
(2, NULL, 'Heyo hows it going', 'Heyo hows it going', 2025, 120, 1);

-- Associate movies with this theme
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (1, 1);
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (1, 2);

-- Add drinking rules
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (1, 'Drink when someone says "pirate"');
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (1, 'Take a sip whenever a ship appears on screen');