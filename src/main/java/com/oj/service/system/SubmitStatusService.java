package com.oj.service.system;

import com.oj.frameUtil.JqueryDataTableDto;

/**
 * Created by AC on 2019/5/6 15:48
 */
public interface SubmitStatusService {
    public JqueryDataTableDto getSubmitStatusMaplist(String start, String count, String problem_id, String account, String submit_state, String user_id ,String submit_language);
}
