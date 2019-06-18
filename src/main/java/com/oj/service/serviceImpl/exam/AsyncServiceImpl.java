package com.oj.service.serviceImpl.exam;

import com.oj.configuration.ThreadPoolConfig;
import com.oj.judge.DispatchTask;
import com.oj.service.exam.AsyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Service
@Scope("prototype")
public class AsyncServiceImpl implements AsyncService {
    @Autowired
    private ThreadPoolConfig threadPoolConfig;
//    @Autowired
//    private DispatchTask task;
    @Override
    public void judgeSubmit(String subId, Map<String, String> subInfo, HttpServletRequest request) {
        //DispatchTask task = new DispatchTask();
        ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(request.getServletContext());
        DispatchTask task = applicationContext.getBean(DispatchTask.class);
        task.setSubId(subId);
        task.setMap(subInfo);
        threadPoolConfig.taskExecutor().execute(task);
    }
}
