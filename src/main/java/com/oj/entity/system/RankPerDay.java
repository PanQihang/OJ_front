package com.oj.entity.system;

import java.util.HashSet;
import java.util.Set;

public class RankPerDay {
    //用户ID
    private String userId;

    //用户名称
    private String userName;

    //用户学号
    private String userAccount;

    //用户班级Id
    private String userClassId;

    //用户班级名称
    private String userClassName;

    //用户已经AC的题目去重集合
    private Set<String> userACProblems;

    public RankPerDay(){
        if (this.userACProblems == null){
            this.userACProblems = new HashSet<String>();
        }
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public String getUserClassId() {
        return userClassId;
    }

    public void setUserClassId(String userClassId) {
        this.userClassId = userClassId;
    }

    public String getUserClassName() {
        return userClassName;
    }

    public void setUserClassName(String userClassName) {
        this.userClassName = userClassName;
    }

    public Set<String> getUserACProblems() {
        return userACProblems;
    }

    public void setUserACProblems(Set<String> userACProblems) {
        this.userACProblems = userACProblems;
    }

    public int setUserACProblems(String problemId){
        this.userACProblems.add(problemId);
        return this.userACProblems.size();
    }
}
