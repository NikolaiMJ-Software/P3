package com.p3.fkult.persistence.entities;

public class DrinkingRule {
    private long id;
    private long themeId;
    private String ruleText;

    public DrinkingRule(long id, long themeId, String ruleText){
        this.id = id;
        this.themeId = themeId;
        this.ruleText = ruleText;
    }
}
