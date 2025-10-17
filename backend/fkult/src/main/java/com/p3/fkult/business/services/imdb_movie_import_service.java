package com.p3.fkult.business.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Year;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.zip.GZIPInputStream;


@Service
public class imdb_movie_import_service {

    private static final String IMDB_URL = "https://datasets.imdbws.com/title.basics.tsv.gz";
    private static final Path DATA_DIR   = Paths.get("database");
    private static final Path LOCAL_PATH = DATA_DIR.resolve("title.basics.tsv.gz");

    private final JdbcTemplate jdbc;

    public imdb_movie_import_service(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    //Function that runs the weekly download script, inserts all new data in db, and removes old data in db
    @Transactional
    public int weekly_refresh() throws IOException {
        System.out.println("DB path: " + Paths.get("database/F-Kult.DB").toAbsolutePath());
        Path tmp = download_temp();
        replace_old_with_temp(tmp);
        return upsert_from_imdb_file(LOCAL_PATH.toFile(), true, true);
    }

    private Path download_temp() throws IOException {
        Files.createDirectories(DATA_DIR);
        Path tmp = Files.createTempFile(DATA_DIR, "title.basics-", ".tsv.gz.tmp");
        try (InputStream in = java.net.URI.create(IMDB_URL).toURL().openStream()) {
            Files.copy(in, tmp, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            Files.deleteIfExists(tmp);
            throw e;
        }
        return tmp;
    }

    private void replace_old_with_temp(Path tmp) throws IOException {
        Files.move(tmp, LOCAL_PATH,
                StandardCopyOption.REPLACE_EXISTING,
                StandardCopyOption.ATOMIC_MOVE);
    }

    @Transactional
    public int upsert_from_imdb_file(File tsv_gz, boolean only_movies, boolean mark_inactive_or_missing) throws IOException {
        jdbc.query("PRAGMA database_list", rs -> {
        System.out.println("SQLite attached DB: " + rs.getString("file"));
        });
        Long count = jdbc.queryForObject("SELECT COUNT(*) FROM movie", Long.class);
        System.out.println("movie rows now = " + count);
        jdbc.execute("PRAGMA foreign_keys = ON");
        jdbc.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_movie_tconst ON movie(tconst)");

        final String upsert_sql =
                "INSERT INTO movie (tconst, movie_name, original_movie_name, year, runtime_minutes, is_active) " +
                "VALUES (?, ?, ?, ?, ?, 1) " +
                "ON CONFLICT(tconst) DO UPDATE SET " +
                "  movie_name=excluded.movie_name, " +
                "  original_movie_name=excluded.original_movie_name, " +
                "  year=excluded.year, " +
                "  runtime_minutes=excluded.runtime_minutes, " +
                "  is_active=1";

        if (mark_inactive_or_missing) {
            jdbc.execute("CREATE TEMP TABLE IF NOT EXISTS tmp_seen(tconst TEXT PRIMARY KEY) WITHOUT ROWID");
            jdbc.update("DELETE FROM tmp_seen");
        }

        int processed = 0;
        int current_year = Year.now(ZoneId.systemDefault()).getValue();

        try (GZIPInputStream gzis = new GZIPInputStream(new FileInputStream(tsv_gz));
             BufferedReader br = new BufferedReader(new InputStreamReader(gzis, StandardCharsets.UTF_8))) {

            String header = br.readLine(); // skip header
            if (header == null) return 0;

            ArrayList<Object[]> upserts = new ArrayList<>(1000);
            ArrayList<Object[]> seen    = new ArrayList<>(1000);
            String line;

        while ((line = br.readLine()) != null) {
            String[] c = line.split("\t", -1);
            if (c.length < 9) continue;

            String tconst = c[0];
            String title_type = c[1];
            if (processed < 3) System.out.println("first tconst/type: " + tconst + " / " + title_type);
            if (only_movies && !"movie".equals(title_type)) continue;

            String primary_title  = normalize(c[2]);
            String original_title = normalize(c[3]);

            //ensure NOT NULL movie_name
            String movie_name = (primary_title != null) ? primary_title
                            : (original_title != null) ? original_title
                            : tconst;

            Integer start_year = parse_int_or_null(c[5]);
            Integer runtime   = parse_int_or_null(c[7]);

            //skip rows that would violate the CHECK (1888..current_year)
            if (start_year != null && (start_year < 1888 || start_year > current_year)) {
                continue;
            }

            //single upsert add (remove the old one)
            upserts.add(new Object[]{ tconst, movie_name, original_title, start_year, runtime });

            if (mark_inactive_or_missing) seen.add(new Object[]{ tconst });
            processed++;

            if (upserts.size() >= 1000) {
                jdbc.batchUpdate(upsert_sql, upserts);
                upserts.clear();
                if (mark_inactive_or_missing) {
                    jdbc.batchUpdate("INSERT OR IGNORE INTO tmp_seen(tconst) VALUES (?)", seen);
                    seen.clear();
                }
            }
        }


            if (!upserts.isEmpty()) {
                jdbc.batchUpdate(upsert_sql, upserts);
                if (mark_inactive_or_missing) {
                    jdbc.batchUpdate("INSERT OR IGNORE INTO tmp_seen(tconst) VALUES (?)", seen);
                }
            }
        }

        if (mark_inactive_or_missing) {
            jdbc.update("UPDATE movie SET is_active = 0 WHERE tconst NOT IN (SELECT tconst FROM tmp_seen)");
            jdbc.execute("DROP TABLE IF EXISTS tmp_seen");
        }
        return processed;
    }

    private static String normalize(String s) {
        return (s == null || s.isEmpty() || "\\N".equals(s)) ? null : s;
    }
    private static Integer parse_int_or_null(String s) {
        if (s == null || s.isEmpty() || "\\N".equals(s)) return null;
        try { return Integer.valueOf(s); } catch (NumberFormatException e) { return null; }
    }
}

