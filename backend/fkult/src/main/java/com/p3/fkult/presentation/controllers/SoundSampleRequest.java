package com.p3.fkult.presentation.controllers;

import java.io.File;

public class SoundSampleRequest {
    private String username;
    private File file;
    private String link;
    
    public SoundSampleRequest(File file, String username) {
        this.file = file;
        this.username = username;
    }
    public SoundSampleRequest(String link, String username) {
        this.link = link;
        this.username = username;
    }

    // Getters
    public String getUsername() {
        return this.username;
    }
    public File getFile() {
        return this.file;
    }
    public String getLink() {
        return this.link;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }
    public void setFile(File file) {
        this.file = file;
    }
    public void setLink(String link) {
        this.link = link;
    }

}
