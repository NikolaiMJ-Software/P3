package com.p3.fkult.persistence.entities;

public class SoundSample {
    private String link;
    private String filePath;
    private Long userId;


    public SoundSample() {}

    public SoundSample(String link, String filePath, Long userId){
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
    public Long getUserId(){
        return this.userId;
    }

    // Set functions
    public void setLink(String link){
        this.link = link;
    }
    public void setFilePath(String filePath){
        this.filePath = filePath;
    }
    public void setUserId(Long userId){
        this.userId = userId;
    }
}