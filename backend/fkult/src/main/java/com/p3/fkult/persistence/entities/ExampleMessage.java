package com.p3.fkult.persistence.entities;

public class ExampleMessage {

    private Long id;
    private String content;

    public ExampleMessage() {}

    public ExampleMessage(Long id, String content) {
        this.id = id;
        this.content = content;
    }

    public ExampleMessage(String content) {
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
