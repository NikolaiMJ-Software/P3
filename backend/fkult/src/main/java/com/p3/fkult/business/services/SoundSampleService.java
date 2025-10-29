package com.p3.fkult.business.services;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
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
    @RequestPart(value = "soundSample", required = true) String soundSampleJson) { 
        try{
            // If it is a file, add it to the soundSampleUploads folder
            String path = null;
            if (file != null) {
                File uploadDir = new File("soundSampleUploads");
                if (!uploadDir.exists()) uploadDir.mkdirs();
                path = uploadDir.getAbsolutePath() + File.separator + file.getOriginalFilename();
                file.transferTo(new File(path));
            }

            // Add the soundsample object to the database
            ObjectMapper mapper = new ObjectMapper();
            SoundSample soundSample = mapper.readValue(soundSampleJson, SoundSample.class);
            soundSample.setFilePath(path);
            repository.save(soundSample);

            return "Upload complete!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }


    @DeleteMapping("/delete")
    public String delete(
    @RequestPart(value = "link", required = false) String link,
    @RequestPart(value = "fileName", required = false) String fileName){
        if (link == null && fileName == null) {
            return "No link or file path provided for deletion.";
        }
        if (link != null && fileName != null) {
            return "Please provide either link or file path for deletion, not both.";
        }

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
                return "File not found at" + file.getPath() + ". Aborting database deletion.";
            }
        }
        return repository.delete(link, filePath);
    }

    @GetMapping("/download")
    private String download(){
        repository.getAll();
        return "69";
    }
}