package com.p3.fkult.presentation.DTOs;

public class MovieRequest {
    private long movieId;
    private String tConst;
    private String title;
    private String moviePosterURL;
    private int runtimeMinutes;
    private int year;
    private boolean isSeries;

    //constructor
    public MovieRequest(long movieId, String title, String moviePosterURL, int runtimeMinutes, int year){
        this.movieId = movieId;
        this.title = title;
        this.moviePosterURL = moviePosterURL;
        this.runtimeMinutes = runtimeMinutes;
        this.year = year;
    }
    public MovieRequest(String tConst, String title, int runtimeMinutes, int year, String moviePosterURL, boolean isSeries){
        this.tConst = tConst;
        this.title = title;
        this.runtimeMinutes = runtimeMinutes;
        this.year = year;
        this.moviePosterURL = moviePosterURL;
        this.isSeries = isSeries;
    }

    //setters
    public void setMovieId(long movieId){
        this.movieId = movieId;
    }
    public void setTitle(String title){
        this.title = title;
    }
    public void setMoviePosterURL(String moviePosterURL){
        this.moviePosterURL = moviePosterURL;
    }
    public void setRuntimeMinutes(int runtimeMinutes){
        this.runtimeMinutes = runtimeMinutes;
    }
    public void setYear(int year){
        this.year = year;
    }
    public void settConst(String tConst){this.tConst = tConst;}
    public void setIsSeries(boolean isSeries){this.isSeries = isSeries;}

    //getters
    public long getMovieId(){
        return movieId;
    }
    public String getTitle(){
        return title;
    }
    public String getMoviePosterURL(){
        return moviePosterURL;
    }
    public int getRuntimeMinutes(){
        return runtimeMinutes;
    }
    public int getYear(){
        return year;
    }
    public String gettConst(){return tConst;}
    public boolean getIsSeries(){return isSeries;}
}