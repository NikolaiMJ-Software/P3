package com.p3.fkult.persistence.entities;

import java.time.LocalDateTime;

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
}
