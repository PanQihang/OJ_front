package com.oj.judge;

import com.oj.entity.practic.SubmitCode;
import com.oj.service.exam.PracticeService;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

/**
 * 负责调用所有判题流程
 */
@Component("dispatchTask")
@Scope("prototype")
public class DispatchTask implements Runnable {

    private String subId;

    private Map<String, String> map;
    @Autowired
    private PracticeService practiceService;

    @Autowired
    private BaseCommonJudge judge;

    private BaseSubmitMsg baseSubmitMsg;

    private Log log = LogFactory.getLog(DispatchTask.class);

    private CountDownLatch countDownLatch;

    public String getSubId() {
        return subId;
    }

    public void setSubId(String subId) {
        this.subId = subId;
    }

    public Map<String, String> getMap() {
        return map;
    }

    public void setMap(Map<String, String> map) {
        this.map = map;
    }


    public BaseCommonJudge getJudge() {
        return judge;
    }

    public void setJudge(BaseCommonJudge judge) {
        this.judge = judge;
    }

    public BaseSubmitMsg getBaseSubmitMsg() {
        return baseSubmitMsg;
    }

    public void setBaseSubmitMsg(BaseSubmitMsg baseSubmitMsg) {
        this.baseSubmitMsg = baseSubmitMsg;
    }

    public Log getLog() {
        return log;
    }

    public void setLog(Log log) {
        this.log = log;
    }

    public CountDownLatch getCountDownLatch() {
        return countDownLatch;
    }

    public void setCountDownLatch(CountDownLatch countDownLatch) {
        this.countDownLatch = countDownLatch;
    }

    @Override
    public void run() {
        baseSubmitMsg = SubmitTaskFactory.produce(Integer.valueOf(map.get(Constants.RedisPrefix.SUBMIT_LANGUAGE)));
        if (baseSubmitMsg != null) {
            baseSubmitMsg.setSubId(subId);
            baseSubmitMsg.setTestData(
                    practiceService.selectTestData(
                            Integer.valueOf(map.get(Constants.RedisPrefix.PROBLEM_ID))));
            //把代码存储到文件中
            String code = map.get(Constants.RedisPrefix.SUBMIT_CODE);
            baseSubmitMsg.setCode(code);
            convertCodeToFile(baseSubmitMsg.getCode(), baseSubmitMsg.getFileName());
            judge.setSubmitMsg(baseSubmitMsg);
            judge.executeCode();
            SubmitCode submitCode = new SubmitCode();
            submitCode.setAccuracy(baseSubmitMsg.getAccuracy());
            submitCode.setSubmitErrorMessage(baseSubmitMsg.getErrorMsg());
            submitCode.setId(Integer.valueOf(subId));
            submitCode.setSubmitMemory(baseSubmitMsg.getRunMemory());
            submitCode.setSubmitTime((int)baseSubmitMsg.getDeltaTime());
            submitCode.setSubmitState(baseSubmitMsg.getResult());
            submitCode.setTestState(Integer.valueOf(baseSubmitMsg.getTestStates()));
            //将结果更新回数据库
            log.info("updating to mysql");
            Integer val = practiceService.updateState(submitCode);
            log.info(val == 1 ? "sucess" : "fail");
            //删用户代码文件
            baseSubmitMsg.deleteOldFile();
        }
    }
    /**
     * 将代码写入文件中
     * @param code
     * @param file
     */
    private void convertCodeToFile(String code,String file) {
        // TODO Auto-generated method stub
        if (StringUtils.isEmpty(code) || StringUtils.isEmpty(file)) {
            return;
        }
        FileWriter writer = null;
        try {
            //默认不追加文字
            writer=new FileWriter(file);
            writer.write(code);
            writer.flush();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
