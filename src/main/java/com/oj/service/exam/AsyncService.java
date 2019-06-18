package com.oj.service.exam;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface AsyncService {
    /**
     * 判题核心方法
     * @param subId
     * @param subInfo
     */
    void judgeSubmit(String subId, Map<String, String> subInfo, HttpServletRequest request);
}
