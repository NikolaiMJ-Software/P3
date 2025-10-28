package com.p3.fkult.persistence.entities;

public class User {
    private long id;
    private String username;
    private String name;
    private boolean banned;
    private boolean admin;

    //constructor
    public User(long id, String username, String name, boolean banned, boolean admin){
        this.id = id;
        this.username = username;
        this.name = name;
        this.banned = banned;
        this.admin = admin;
    }

    //getters
    public long getId(){
        return this.id;
    }
    public String getUsername(){
        return this.username;
    }
    public String getName(){
        return this.name;
    }
    public boolean getBanned() {
        return this.banned;
    }
    public boolean getAdmin(){
        return this.admin;
    }

    //setters
    public void setId(long value){
        this.id = value;
    }
    public void setUsername(String value){
        this.username = value;
    }
    public void setName(String value){
        this.name = value;
    }
    public void setBanned(boolean value) {
        this.banned = value;
    }
    public void setAdmin(boolean value){
        this.admin = value;
    }

}
