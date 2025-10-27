package com.p3.fkult.business.services;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.p3.fkult.persistence.entities.SoundSample;
import com.p3.fkult.persistence.repository.SoundSampleRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController

// Fetch function that gets called by domain/api
@RequestMapping("/api")
public class SoundSampleService {

    // Downloads a copy of SoundSampleRepository to gets its functions
    private final SoundSampleRepository repository;
    public SoundSampleService(SoundSampleRepository repository) {
        this.repository = repository;
    }
    
    // Soundsample uploading function accepts a soundsample object and optionally a file
    @PostMapping("/upload")
    public String upload(
    @RequestPart(value = "file", required = false) MultipartFile file,
    @RequestPart(value = "soundSample", required = true) String soundSampleJson
    ) throws IOException {

        // If it is a file, add it to the soundSampleUploads folder
        String path = null;
        if (file != null) {
            File uploadDir = new File("../../soundSampleUploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();
            path = "../../soundSampleUploads/" + file.getOriginalFilename();
            file.transferTo(new File(path));
        }

        // Add the soundsample object to the database
        ObjectMapper mapper = new ObjectMapper();
        SoundSample sample = mapper.readValue(soundSampleJson, SoundSample.class);
        sample.setFilePath(path);
        repository.save(sample);

        return "Upload complete!";
    }

    @GetMapping("/download")
    private String download(){
        repository.getAll();
        return "69";
    }
}