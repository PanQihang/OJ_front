package com.oj.judge;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * 获取编译，运行命令通用接口
 */

public abstract class BaseSubmitMsg {
    public final static String FILE_PATH = System.getProperty("user.dir") + "/code/";
    protected String code;
    protected Map<Integer, List<String>> testData;
    protected String subId;
    protected int result;
    protected long deltaTime;
    protected float accuracy;
    protected String errorMsg;

    public static String getFilePath() {
        return FILE_PATH;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Map<Integer, List<String>> getTestData() {
        return testData;
    }

    public void setTestData(Map<Integer, List<String>> testData) {
        this.testData = testData;
    }

    public String getSubId() {
        return subId;
    }

    public void setSubId(String subId) {
        this.subId = subId;
    }

    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    public long getDeltaTime() {
        return deltaTime;
    }

    public void setDeltaTime(long deltaTime) {
        this.deltaTime = deltaTime;
    }

    public float getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public int getRunMemory() {
        return runMemory;
    }

    public void setRunMemory(int runMemory) {
        this.runMemory = runMemory;
    }

    public String getTestStates() {
        return testStates;
    }

    public void setTestStates(String testStates) {
        this.testStates = testStates;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }

    public static Log getLog() {
        return log;
    }

    public static void setLog(Log log) {
        BaseSubmitMsg.log = log;
    }

    protected int runMemory;
    protected String testStates;
    protected String processName;
    protected static Log log = LogFactory.getLog(BaseSubmitMsg.class);
    static {
        log.info(FILE_PATH);
        File file = new File(FILE_PATH);
        if (!file.exists() && file.mkdir()) {
            log.info("created /code successfully");
        }
    }
    /**
     * 获取编译Shell
     * @return
     */
    public abstract String getCompileShell();

    /**
     * 获取执行Shell
     * @return
     */
    public abstract String getExecuteShell();

    /**
     * 删除过期文件（代码文件）
     * @return
     */
    public abstract boolean deleteOldFile();

    /**
     * 返回文件名
     * @return
     */
    public abstract String getFileName();

    /**
     * 判断subid是否为空
     * @return
     */
    protected boolean isSubIdEmpty() {
        return subId == null || subId.length() == 0;
    }
}