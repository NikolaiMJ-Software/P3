-- Insert dummy user
INSERT OR REPLACE INTO user (id, name, username, is_banned, is_admin)
VALUES (4900, 'Martin', 'Kabuum', 0, 0);

-- Insert dummy theme with a known ID
INSERT OR REPLACE INTO theme (id, name, user_id)
VALUES (9999, 'Pirates Night', 4900);


-- Associate movies with this theme
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (9999, 170478);
INSERT OR REPLACE INTO theme_movie (theme_id, movie_id) VALUES (9999, 188867);

-- Add drinking rules
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (9999, 'Drink when someone says "pirate"');
INSERT OR REPLACE INTO drinking_rule (theme_id, rule_text)
VALUES (9999, 'Take a sip whenever a ship appears on screen');
