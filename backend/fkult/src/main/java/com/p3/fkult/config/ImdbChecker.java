package com.p3.fkult.config;
import com.p3.fkult.business.services.ImdbMovieImportService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@Order(1) // ensure this runs early
public class ImdbChecker implements ApplicationRunner {
    private static final Path DATA_DIR   = Paths.get("database");
    private static final Path LOCAL_PATH = DATA_DIR.resolve("title.basics.tsv.gz");

    private final ImdbMovieImportService importService;

    public ImdbChecker(ImdbMovieImportService importService) {
        this.importService = importService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (Files.exists(LOCAL_PATH)) {
            System.out.println("[IMDb bootstrap] Dataset already present: " + LOCAL_PATH.toAbsolutePath());
            return;
        }

        System.out.println("[IMDb bootstrap] Dataset missing; downloading & importing…");
        int n = importService.weeklyRefresh();  // downloads + upserts
        System.out.println("[IMDb bootstrap] Import complete. rows_processed=" + n);
    }
}
