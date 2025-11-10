package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Theme;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;

import com.p3.fkult.persistence.entities.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.GZIPInputStream;
import java.io.File;

@Repository
public class MovieRepository {

    private final JdbcTemplate jdbcTemplate;

    //Constructor :D
    public MovieRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Movie> rowMapper = (rs, rowNum) ->
            new Movie(
                    rs.getLong("id"),
                    rs.getString("tconst"),
                    rs.getString("movie_name"),
                    rs.getString("original_movie_name"),
                    rs.getInt("year"),
                    rs.getInt("runtime_minutes"),
                    rs.getBoolean("is_active"),
                    rs.getBoolean("is_series"),
                    rs.getString("poster_url"),
                    rs.getString("rating")
            );

    //database operations
    public List<Movie> findAll(){
        return jdbcTemplate.query("SELECT * FROM movie", rowMapper);
    }

    public Movie findById(long id){
        String sql = "SELECT * FROM movie WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, id);
        } catch (EmptyResultDataAccessException e) {
            return null; // or throw new RuntimeException("Movie not found with id: " + id);
        }
    }

    public Movie findByTconst(String tConst){
        String sql = "SELECT * FROM movie WHERE tconst = ?";
        try {
            return jdbcTemplate.queryForObject(sql, rowMapper, tConst);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updatePosterURL(Long movieId, String posterURL){
        String sql = "UPDATE movie SET poster_url = ? WHERE id = ?";
        jdbcTemplate.update(sql, posterURL, movieId);
    }
    public List<Movie> searchMovies(String keyword, int page, int limit) {
        //case insenstive + partial matches
        String sql = """
        SELECT * FROM movie 
        WHERE LOWER(movie_name) LIKE LOWER(?) 
        AND is_active = 1 
        AND year > 0
        AND runtime_minutes > 0 
        LIMIT ? OFFSET ?
        """;
        int offset = (page-1) * limit;
        String likePattern = "%" + keyword + "%";
        return jdbcTemplate.query(sql, rowMapper, likePattern, limit, offset);
    }

    public int countMovies(String keyword){
        String sql = """
        SELECT COUNT(*) FROM movie 
        WHERE LOWER(movie_name) LIKE LOWER(?) 
        AND is_active = 1 
        AND year > 0
        AND runtime_minutes > 0 
        """;
        String likePattern = "%" + keyword + "%";
        return jdbcTemplate.queryForObject(sql, Integer.class, likePattern);
    }

    //upsert function
    public int upsertFromImdbFile(File tsvGz, boolean onlyMovies, boolean markInactiveMissing) throws IOException {
    jdbcTemplate.execute("PRAGMA foreign_keys = ON");
    jdbcTemplate.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_movie_tconst ON movie(tconst)");

    final String upsertSql =
        "INSERT INTO movie (tconst, movie_name, original_movie_name, year, runtime_minutes, is_active, is_series) " +
        "VALUES (?, ?, ?, ?, ?, 1, ?) " +
        "ON CONFLICT(tconst) DO UPDATE SET " +
        "  movie_name=excluded.movie_name, " +
        "  original_movie_name=excluded.original_movie_name, " +
        "  year=excluded.year, " +
        "  runtime_minutes=excluded.runtime_minutes, " +
        "  is_active=1, " +
        "  is_series=excluded.is_series";

    if (markInactiveMissing) {
        jdbcTemplate.execute("CREATE TEMP TABLE IF NOT EXISTS tmp_seen(tconst TEXT PRIMARY KEY) WITHOUT ROWID");
        jdbcTemplate.update("DELETE FROM tmp_seen");
    }

    int processed = 0;
    int currentYear = Year.now(ZoneId.systemDefault()).getValue();

    try (GZIPInputStream gzis = new GZIPInputStream(new FileInputStream(tsvGz));
         BufferedReader br = new BufferedReader(new InputStreamReader(gzis, StandardCharsets.UTF_8))) {

        String header = br.readLine();
        if (header == null) return 0;

        ArrayList<Object[]> upserts = new ArrayList<>(1000);
        ArrayList<Object[]> seen    = new ArrayList<>(1000);
        String line;

        while ((line = br.readLine()) != null) {
            String[] c = line.split("\t", -1);
            if (c.length < 9) continue;

            String tconst = c[0];
            String titleType = c[1];
            if (onlyMovies && !( "movie".equals(titleType) || "tvSeries".equals(titleType) )) {continue;}

            Integer seriesType;
            if ("tvSeries".equals(titleType)){seriesType = 1;}else{seriesType = 0;}

            String primaryTitle  = normalize(c[2]);
            String originalTitle = normalize(c[3]);
            String movieName = (primaryTitle != null) ? primaryTitle
                             : (originalTitle != null) ? originalTitle
                             : tconst;

            Integer startYear = parseIntOrNull(c[5]);
            Integer runtime   = parseIntOrNull(c[7]);
            if (startYear != null && (startYear < 1888 || startYear > currentYear)) continue;

            upserts.add(new Object[]{ tconst, movieName, originalTitle, startYear, runtime, seriesType });
            if (markInactiveMissing) seen.add(new Object[]{ tconst });
            processed++;

            if (upserts.size() >= 1000) {
                jdbcTemplate.batchUpdate(upsertSql, upserts);
                upserts.clear();
                if (markInactiveMissing) {
                    jdbcTemplate.batchUpdate("INSERT OR IGNORE INTO tmp_seen(tconst) VALUES (?)", seen);
                    seen.clear();
                }
            }
        }

        if (!upserts.isEmpty()) {
            jdbcTemplate.batchUpdate(upsertSql, upserts);
            if (markInactiveMissing) {
                jdbcTemplate.batchUpdate("INSERT OR IGNORE INTO tmp_seen(tconst) VALUES (?)", seen);
            }
        }
    }

    if (markInactiveMissing) {
        jdbcTemplate.update("UPDATE movie SET is_active = 0 WHERE tconst NOT IN (SELECT tconst FROM tmp_seen)");
        jdbcTemplate.execute("DROP TABLE IF EXISTS tmp_seen");
    }
    return processed;
    }

    private static String normalize(String s) {
        return (s == null || s.isEmpty() || "\\N".equals(s)) ? null : s;
    }
    private static Integer parseIntOrNull(String s) {
        if (s == null || s.isEmpty() || "\\N".equals(s)) return null;
        try { return Integer.valueOf(s); } catch (NumberFormatException e) { return null; }
    }

    public void mergeRatingsFromImdbFile(File ratingsTsvGz) throws IOException {
        jdbcTemplate.execute("PRAGMA foreign_keys = ON");

        // temp table to stage ratings
        jdbcTemplate.execute("""
            CREATE TEMP TABLE IF NOT EXISTS tmp_ratings(
                tconst TEXT PRIMARY KEY,
                rating TEXT,
                votes  INTEGER
            ) WITHOUT ROWID
        """);
        jdbcTemplate.update("DELETE FROM tmp_ratings");

        try (GZIPInputStream gzis = new GZIPInputStream(new FileInputStream(ratingsTsvGz));
            BufferedReader br = new BufferedReader(new InputStreamReader(gzis, StandardCharsets.UTF_8))) {

            String header = br.readLine(); // tconst\taverageRating\tnumVotes
            if (header == null) return;

            List<Object[]> batch = new ArrayList<>(10_000);
            String line;
            while ((line = br.readLine()) != null) {
                String[] c = line.split("\t", -1);
                if (c.length < 3) continue;
                String tconst = c[0];
                String rating = c[1];     // keep as TEXT per your schema
                Integer votes  = parseIntOrNull(c[2]);
                batch.add(new Object[]{ tconst, rating, votes });
                if (batch.size() >= 10_000) {
                    jdbcTemplate.batchUpdate("INSERT OR REPLACE INTO tmp_ratings(tconst, rating, votes) VALUES (?,?,?)", batch);
                    batch.clear();
                }
            }
            if (!batch.isEmpty()) {
                jdbcTemplate.batchUpdate("INSERT OR REPLACE INTO tmp_ratings(tconst, rating, votes) VALUES (?,?,?)", batch);
            }
        }

        // single set-based update: update only rows that exist in tmp
        jdbcTemplate.update("""
            UPDATE movie
            SET rating = (SELECT rating FROM tmp_ratings r WHERE r.tconst = movie.tconst)
            WHERE EXISTS (SELECT 1 FROM tmp_ratings r WHERE r.tconst = movie.tconst)
        """);

        jdbcTemplate.execute("DROP TABLE IF EXISTS tmp_ratings");
    }



}
