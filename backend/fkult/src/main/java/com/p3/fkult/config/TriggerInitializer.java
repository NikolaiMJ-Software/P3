package com.p3.fkult.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
@Order(1)
public class TriggerInitializer implements ApplicationRunner {

    private final DataSource dataSource;

    public TriggerInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // Avoid SQLITE_BUSY by giving SQLite time to lock/unlock
            stmt.execute("PRAGMA busy_timeout = 4000;");

            // Create triggers
            stmt.execute("""
                CREATE TRIGGER IF NOT EXISTS movie_ai
                AFTER INSERT ON movie
                BEGIN
                    INSERT INTO movie_fts(movie_name, original_movie_name)
                    VALUES (NEW.movie_name, NEW.original_movie_name);
                END;
            """);

            stmt.execute("""
                CREATE TRIGGER IF NOT EXISTS movie_ad
                AFTER DELETE ON movie
                BEGIN
                    DELETE FROM movie_fts WHERE rowid = OLD.id;
                END;
            """);

            stmt.execute("""
                CREATE TRIGGER IF NOT EXISTS movie_au
                AFTER UPDATE ON movie
                BEGIN
                    UPDATE movie_fts
                    SET movie_name = NEW.movie_name,
                        original_movie_name = NEW.original_movie_name
                    WHERE rowid = OLD.id;
                END;
            """);

            System.out.println("SQLite triggers created successfully.");
        }
    }
}

