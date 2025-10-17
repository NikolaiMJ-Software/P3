package com.p3.fkult.persistence.entities;

import java.time.LocalDateTime;
import java.util.List;

public class Theme {

    private long id;
    private String name;
    private long userid;
    private LocalDateTime timestamp;
    private Integer votecount;

    public Theme (long id, String name, Long userid, LocalDateTime timestamp, Integer votecount){
        this.id = id;
        this.name = name;
        this.userid = userid;
        this.timestamp = timestamp;
        this.votecount = votecount;
    }
    public Theme(String name, long userid){
        this.name = name;
        this.userid = userid;
    }
    //getters
    public long getId(){
        return this.id;
    }
    public String getName(){
        return this.name;
    }
    public long getUserid(){
        return this.userid;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }
    public Integer getVotecount(){
        return this.votecount;
    }
    //setters
    public void setId(long id){
        this.id = id;
    }
}
