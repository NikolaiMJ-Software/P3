package com.p3.fkult.presentation.controllers;

public class MovieRequest {
    private long movieId;
    private String title;
    private String moviePosterURL;
    private int runtimeMinutes;
    private int year;
    //constructor
    public MovieRequest(long movieId, String title, String moviePosterURL, int runtimeMinutes, int year){
        this.movieId = movieId;
        this.title = title;
        this.moviePosterURL = moviePosterURL;
        this.runtimeMinutes = runtimeMinutes;
        this.year = year;
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
}