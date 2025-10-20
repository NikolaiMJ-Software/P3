 package com.p3.fkult.business.services;

import com.p3.fkult.persistence.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.file.*;


@Service
public class ImdbMovieImportService {

    private static final String IMDB_URL = "https://datasets.imdbws.com/title.basics.tsv.gz";
    private static final Path DATA_DIR   = Paths.get("database");
    private static final Path LOCAL_PATH = DATA_DIR.resolve("title.basics.tsv.gz");

    private final MovieRepository movieRepository;

    public ImdbMovieImportService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    //Function that runs the weekly download script, inserts all new data in db, and removes old data in db
    @Transactional
    public int weekly_refresh() throws IOException {
        System.out.println("DB path: " + Paths.get("database/F-Kult.DB").toAbsolutePath());
        Path tmp = download_temp();
        replace_old_with_temp(tmp);
        // Call the repository’s upsert method
        return movieRepository.upsertFromImdbFile(LOCAL_PATH.toFile(), true, true);
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
}
