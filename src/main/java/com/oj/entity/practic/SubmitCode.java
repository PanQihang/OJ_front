package com.oj.entity.practic;

import java.sql.Timestamp;

public class SubmitCode {
    private int id;
    private int problemId;
    private int userId;
    private int testId;
    private int hide;
    private String submitCode;
    private long submitDate;
    private int submitLanguage;
    private int submitState;
    private int testState;
    private String submitErrorMessage;
    private int submitMemory;
    private int submitTime;
    private int submitCodeLength;
    private float accuracy;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProblemId() {
        return problemId;
    }

    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getTestId() {
        return testId;
    }

    public void setTestId(int testId) {
        this.testId = testId;
    }

    public int getHide() {
        return hide;
    }

    public void setHide(int hide) {
        this.hide = hide;
    }

    public String getSubmitCode() {
        return submitCode;
    }

    public void setSubmitCode(String submitCode) {
        this.submitCode = submitCode;
    }

    public long getSubmitDate() {
        return submitDate;
    }

    public void setSubmitDate(long submitDate) {
        this.submitDate = submitDate;
    }

    public int getSubmitLanguage() {
        return submitLanguage;
    }

    public void setSubmitLanguage(int submitLanguage) {
        this.submitLanguage = submitLanguage;
    }

    public int getSubmitState() {
        return submitState;
    }

    public void setSubmitState(int submitState) {
        this.submitState = submitState;
    }

    public int getTestState() {
        return testState;
    }

    public void setTestState(int testState) {
        this.testState = testState;
    }

    public String getSubmitErrorMessage() {
        return submitErrorMessage;
    }

    public void setSubmitErrorMessage(String submitErrorMessage) {
        this.submitErrorMessage = submitErrorMessage;
    }

    public int getSubmitMemory() {
        return submitMemory;
    }

    public void setSubmitMemory(int submitMemory) {
        this.submitMemory = submitMemory;
    }

    public int getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(int submitTime) {
        this.submitTime = submitTime;
    }

    public int getSubmitCodeLength() {
        return submitCodeLength;
    }

    public void setSubmitCodeLength(int submitCodeLength) {
        this.submitCodeLength = submitCodeLength;
    }

    public float getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }
}
