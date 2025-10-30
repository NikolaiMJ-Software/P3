package com.p3.fkult.business.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.p3.fkult.persistence.entities.SoundSample;
import com.p3.fkult.persistence.repository.SoundSampleRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Service
public class SoundSampleService {

    // Download copy of repository to run its code
    private final SoundSampleRepository repository;
    public SoundSampleService(SoundSampleRepository repository) {
        this.repository = repository;
    }

    // Handles sound sample uploads with either link or file
    public String upload(MultipartFile file, String soundSampleJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            SoundSample soundSample = mapper.readValue(soundSampleJson, SoundSample.class);

            // Validate input
            if (file == null && (soundSample.getLink() == null || soundSample.getLink().isEmpty())) {
                return "Upload failed: either link or file must be provided for upload.";
            }

            // If there is a file, upload it to the server
            String path = null;
            if (file != null) {
                File uploadDir = new File("soundSampleUploads");
                if (!uploadDir.exists()) uploadDir.mkdirs();
                path = uploadDir.getAbsolutePath() + File.separator + file.getOriginalFilename();
                file.transferTo(new File(path));
            }

            // Save to the sound sample to the database
            soundSample.setFilePath(path);
            repository.save(soundSample);
            return "Upload complete!";

        } catch (Exception e) {

            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    // Handles deletion of existing sound sample from given link or file name
    public String delete(String link, String fileName) {

        // Input validation
        if (link == null && fileName == null) {
            return "No link or file path provided for deletion.";
        }
        if (link != null && fileName != null) {
            return "Please provide either link or file path for deletion, not both.";
        }

        // If deletion is based on file name, find and delete file
        String filePath = null;
        if (fileName != null) {
            filePath = new File("soundSampleUploads" + File.separator + fileName).getAbsolutePath();
            File file = new File(filePath).getAbsoluteFile();
            if (file.exists()) {
                if (file.delete()) {
                    System.out.println("Deleted file: " + file.getPath());
                } else {
                    return "Failed to delete file at: " + file.getPath() + ". Aborting database deletion.";
                }
            } else {
                return "File not found at " + file.getPath() + ". Aborting database deletion.";
            }
        }

        // Delete sound sample object in the database
        return repository.delete(link, filePath);
    }
}