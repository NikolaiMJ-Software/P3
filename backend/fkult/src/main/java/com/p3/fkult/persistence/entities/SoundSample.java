package com.p3.fkult.persistence.entities;

public class SoundSample {
    private String link;
    private String filePath;
    private String userId;


    public SoundSample() {}

    public SoundSample(String link, String filePath, String userId){
        this.link = link;
        this.filePath = filePath;
        this.userId = userId;
    }

    // Get functions
    public String getLink(){
        return this.link;
    }
    public String getFilePath(){
        return this.filePath;
    }
    public String getUserId(){
        return this.userId;
    }

    // Set functions
    public void setLink(String link){
        this.link = link;
    }
    public void setFilePath(String filePath){
        this.filePath = filePath;
    }
    public void setUserId(String userId){
        this.userId = userId;
    }
}