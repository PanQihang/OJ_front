package com.oj.entity.system;

/**
 * Created by panqiahng on 2019/5/6 16:00
 */
public class SubmitCodeList {
    private String problem_id;
    private String name;
    private String submit_state;
    private String submit_language;
    private String submit_time;
    private String submit_memory;
    private String submit_code_length;
    private String submit_date;

    public String getSubmit_code() {
        return submit_code;
    }

    public void setSubmit_code(String submit_code) {
        this.submit_code = submit_code;
    }

    private String submit_code;

    public String getProblem_id() {
        return problem_id;
    }

    public void setProblem_id(String problem_id) {
        this.problem_id = problem_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubmit_state() {
        return submit_state;
    }

    public void setSubmit_state(String submit_state) {
        this.submit_state = submit_state;
    }

    public String getSubmit_language() {
        return submit_language;
    }

    public void setSubmit_language(String submit_language) {
        this.submit_language = submit_language;
    }

    public String getSubmit_time() {
        return submit_time;
    }

    public void setSubmit_time(String submit_time) {
        this.submit_time = submit_time;
    }

    public String getSubmit_memory() {
        return submit_memory;
    }

    public void setSubmit_memory(String submit_memory) {
        this.submit_memory = submit_memory;
    }

    public String getSubmit_code_length() {
        return submit_code_length;
    }

    public void setSubmit_code_length(String submit_code_length) {
        this.submit_code_length = submit_code_length;
    }

    public String getSubmit_date() {
        return submit_date;
    }

    public void setSubmit_date(String submit_date) {
        this.submit_date = submit_date;
    }
}
