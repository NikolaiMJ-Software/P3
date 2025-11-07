package com.p3.fkult.presentation.controllers;

public class SoundSampleRequest {
    private String usersFullName;
    private String soundSample;
    
    public SoundSampleRequest(String soundSample, String usersFullName) {
        this.soundSample = soundSample;
        this.usersFullName = usersFullName;
    }

    // Getters
    public String getSoundSample() {
        return soundSample;
    }
    public String getUsername() {
        return usersFullName;
    }

    // Setters
    public void setSoundSample(String soundSample) {
        this.soundSample = soundSample;
    }
    public void setUsername(String usersFullName) {
        this.usersFullName = usersFullName;
    }
}
