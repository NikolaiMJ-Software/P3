package com.p3.fkult.config;

import com.p3.fkult.business.services.imdb_movie_import_service;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@EnableScheduling
@Component
public class import_schedular {

    private final imdb_movie_import_service svc;

    public import_schedular(imdb_movie_import_service svc) {
        this.svc = svc;
    }

    //"0 0 4 ? * MON", zone = "Europe/Copenhagen" (every monday at 4)
    //"0 */10 * * * *" (every 10 minutes)
    // Runs the download script every Monday at 04:00 am
    @Scheduled(cron = "0 0 4 ? * MON", zone = "Europe/Copenhagen")
    public void weekly_imdb_update() {
        try {
            int n = svc.weekly_refresh();
            System.out.println("IMDb weekly refresh complete. rows_processed = " + n);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}


