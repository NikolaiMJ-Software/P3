package com.p3.fkult.presentation.controllers;

public class SoundSampleRequest {
    private String usersFullName;
    private String username;
    private String soundSample;
    
    public SoundSampleRequest(String soundSample, String username, String usersFullName) {
        this.soundSample = soundSample;
        this.username = username;
        this.usersFullName = usersFullName;
    }

    // Getters
    public String getSoundSample() {
        return soundSample;
    }
    public String getUsername() {
        return username;
    }
    public String getUsersFullName() {
        return usersFullName;
    }

    // Setters
    public void setSoundSample(String soundSample) {
        this.soundSample = soundSample;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
