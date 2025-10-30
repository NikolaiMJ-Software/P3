package com.p3.fkult.persistence.entities;

public class Movie {
    private long id;
    private String tconst;
    private String movieName;
    private String originalMovieName;
    private Integer year;
    private Integer runtimeMinutes;
    private Boolean isActive;
    private String posterURL;

    public Movie(long id, String tconst, String movieName, String originalMovieName, Integer year, Integer runtimeMinutes, Boolean isActive, String posterURL){
        this.id = id;
        this.tconst = tconst;
        this.movieName = movieName;
        this.originalMovieName = originalMovieName;
        this.year = year;
        this.runtimeMinutes = runtimeMinutes;
        this.isActive = isActive;
        this.posterURL = posterURL;
    }
    public Movie(int id, String tconst, String movieName, String originalMovieName, int year, int runtimeMinutes, boolean isActive, String posterURL) {
        //overloaded constructor that accepts primitives for year runtimeMinutes and isActive
        this((long)id, tconst, movieName, originalMovieName, Integer.valueOf(year), Integer.valueOf(runtimeMinutes), Boolean.valueOf(isActive), posterURL);
    }


    //getters
    public long getId(){
        return this.id;
    }
    public String getTconst(){
        return this.tconst;
    }
    public String getMovieName(){
        return this.movieName;
    }
    public String getOriginalMovieName(){
        return this.originalMovieName;
    }
    public Integer getYear(){
        return this.year;
    }
    public Integer getRuntimeMinutes(){
        return this.runtimeMinutes;
    }
    public Boolean getIsActive(){
        return this.isActive;
    }
    public String getPosterURL(){
        return this.posterURL;
    }

    //setters
    public void setId(long id){
        this.id = id;
    }
    public void setTconst(String tconst){
        this.tconst = tconst;
    }
    public void setMovieName(String movieName){
        this.movieName = movieName;
    }
    public void setOriginalMovieName(String originalMovieName){
        this.originalMovieName = originalMovieName;
    }
    public void setYear(Integer year){
        this.year = year;
    }
    public void setRuntimeMinutes(Integer runtimeMinutes){
        this.runtimeMinutes = runtimeMinutes;
    }
    public void setIsActive(Boolean isActive){
        this.isActive = isActive;
    }
    public void setPosterURL(String posterURL){
        this.posterURL = posterURL;
    }
}
