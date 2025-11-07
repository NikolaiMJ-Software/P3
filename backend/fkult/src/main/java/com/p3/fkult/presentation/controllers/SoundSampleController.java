package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.SoundSampleService;
//import com.p3.fkult.persistence.entities.SoundSample;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sound-sample")
public class SoundSampleController {

    // Download copy of soundsampleservice to use its functions
    private final SoundSampleService service;
    public SoundSampleController(SoundSampleService service) {
        this.service = service;
    }

    // Fetch function to upload a sound sample to the database
    @PostMapping("/upload")
    public String upload(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "soundSample", required = true) String soundSampleJson) {
        return service.upload(file, soundSampleJson);
    }

    // Fetch function to delete an existing sound sample by either link or file name
    @DeleteMapping("/delete")
    public String delete(
            @RequestPart(value = "link", required = false) String link,
            @RequestPart(value = "fileName", required = false) String fileName) {
        return service.delete(link, fileName);
    }

    // Fetch function to get all sound samples 
    @GetMapping("/get-all")
    public List<SoundSampleRequest> getSoundSamples(@
        RequestParam(defaultValue = "false") boolean quick, 
        @RequestParam(defaultValue = "false") boolean weighted) {
            return service.getAllSoundSamples(quick, weighted);
    }
}