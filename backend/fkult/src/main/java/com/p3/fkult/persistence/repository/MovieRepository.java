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
                    rs.getBoolean("is_active")
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

    public List<Movie> searchMovies(String keyword) {
        //case insenstive + partial matches
        String sql = "SELECT * FROM movie WHERE LOWER(movie_name) LIKE LOWER(?) AND is_active = 1";
        String likePattern = "%" + keyword + "%";
        return jdbcTemplate.query(sql, rowMapper, likePattern);
    } 

    //upsert function
    public int upsertFromImdbFile(File tsvGz, boolean onlyMovies, boolean markInactiveMissing) throws IOException {
    jdbcTemplate.execute("PRAGMA foreign_keys = ON");
    jdbcTemplate.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_movie_tconst ON movie(tconst)");

    final String upsertSql =
        "INSERT INTO movie (tconst, movie_name, original_movie_name, year, runtime_minutes, is_active) " +
        "VALUES (?, ?, ?, ?, ?, 1) " +
        "ON CONFLICT(tconst) DO UPDATE SET " +
        "  movie_name=excluded.movie_name, " +
        "  original_movie_name=excluded.original_movie_name, " +
        "  year=excluded.year, " +
        "  runtime_minutes=excluded.runtime_minutes, " +
        "  is_active=1";

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
            if (onlyMovies && !"movie".equals(titleType)) continue;

            String primaryTitle  = normalize(c[2]);
            String originalTitle = normalize(c[3]);
            String movieName = (primaryTitle != null) ? primaryTitle
                             : (originalTitle != null) ? originalTitle
                             : tconst;

            Integer startYear = parseIntOrNull(c[5]);
            Integer runtime   = parseIntOrNull(c[7]);
            if (startYear != null && (startYear < 1888 || startYear > currentYear)) continue;

            upserts.add(new Object[]{ tconst, movieName, originalTitle, startYear, runtime });
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

}
