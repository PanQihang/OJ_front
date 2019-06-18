package com.oj.judge;


public interface Constants {
    int DEF = 0 , AC = 1, PRESENTATION_ERROR = 2,
            WRONG_ANSWER = 3 ,COMPILE_ERROR=8,
            TIME_LIMIT_EXCEED = 5 ,RUNTIME_ERROR = 4
            ,MEMORY_LIMIT_EXCEED = 6;
    interface RedisPrefix {
        String PID_DATA = "pid_data:";
        String DATA_ID = "data_id:";
        String IN = "in:";
        String OUT = "out:";
        String SUB_ID = "sub_id:";
        String PROBLEM_ID = "problem_id:";
        String SUBMIT_CODE = "submit_code:";
        String SUBMIT_LANGUAGE = "submit_language:";

    }
}
