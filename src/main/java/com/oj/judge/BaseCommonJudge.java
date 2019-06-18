package com.oj.judge;

import com.oj.configuration.ThreadPoolConfig;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

@Component("judge")
@Scope("prototype")
public class BaseCommonJudge {

    private BaseSubmitMsg submitMsg;
    private Log log = LogFactory.getLog(BaseCommonJudge.class);

    @Autowired
    private ThreadPoolConfig threadPoolConfig;

    public BaseSubmitMsg getSubmitMsg() {
        return submitMsg;
    }

    public void setSubmitMsg(BaseSubmitMsg submitMsg) {
        this.submitMsg = submitMsg;
    }

    public Log getLog() {
        return log;
    }

    public void setLog(Log log) {
        this.log = log;
    }

    /**
     * 核心判题流程
     * @param
     * @return
     */
    public void executeCode() {
        StringBuilder testStates = new StringBuilder();
        submitMsg.setResult(Constants.DEF);
        Process process;
        //编译代码
        String compile = submitMsg.getCompileShell();
        if (compile != null) {
            try {
                process = Runtime.getRuntime().exec(compile);
                boolean res = process.waitFor(5000, TimeUnit.MILLISECONDS);
                if (!res) {
                    process.destroy();
                    submitMsg.setErrorMsg("Compile TimeLimited");
                    submitMsg.setResult(Constants.COMPILE_ERROR);
                    submitMsg.setTestStates("0");
                    return;
                }
                String errorMsg = getErrorMsg(process.getErrorStream());
                //过滤warning
                if(errorMsg.contains("错误")||errorMsg.contains("Error")
                        ||errorMsg.contains("error")||errorMsg.contains("undefined")) {
                    submitMsg.setResult(Constants.COMPILE_ERROR);
                    submitMsg.setTestStates("0");
                    submitMsg.setErrorMsg(errorMsg);
                    return;
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
        //编译成功或者例如python无需编译
        Map<Integer, List<String>> testData = submitMsg.getTestData();
        //有几个测试样例，程序就得跑几次
        if (testData != null && testData.size() > 0) {
            int sum = testData.values().size(), correct = 0;
            MemoryListener memOver = new MemoryListener();
            TtlListener ttl = new TtlListener();
            for (List<String> row : testData.values()) {
                String[] in = row.get(0).split("\r\n");
                String tt = row.get(1);
                String out = "";
                int len = 0;
                if(!"".equals(tt)){
                    len=tt.charAt(tt.length()-1)=='\n'?tt.length()-1:tt.length();
                    out=row.get(1).substring(0, len).replaceAll("\n", " ").replaceAll("\r", "");
                }
                //运行可执行文件
                try {
                    process = Runtime.getRuntime().exec(submitMsg.getExecuteShell());
                    String os = System.getProperty("os.name");
                    memOver.setInfo(process, submitMsg.getProcessName());
                    memOver.setLatch(new CountDownLatch(1));
                    Future<Boolean> isMemOver = threadPoolConfig.taskExecutor().submit(memOver);
                    //当前阻塞，直到获取一次进程的内存
                    memOver.getLatch().await();

                    log.info("Start input!!!");
                    inputData(process.getOutputStream(), in);
                    log.info("Ended input!!!");
                    //开始计算时间, 设置超时的监听
                    ttl.setProcessAndStarttime(process);
                    Future<Boolean> isTtl = threadPoolConfig.taskExecutor().submit(ttl);
                    boolean isTimeLimited = isTtl.get();
                    boolean isMemoryOver = isMemOver.get();
                    if (isTimeLimited) {
                        submitMsg.setResult(Constants.TIME_LIMIT_EXCEED);
                        testStates.append(Constants.TIME_LIMIT_EXCEED);
                    }
                    if (isMemoryOver) {
                        submitMsg.setResult(Constants.MEMORY_LIMIT_EXCEED);
                        testStates.append(Constants.MEMORY_LIMIT_EXCEED);
                    }
                    //等待以上操作完成
                    log.info("wait finished");
                    process.waitFor();
                    log.info("catttttt");
                    log.info(ttl.getDeltatime() +"    "+memOver.getMemory());
                    submitMsg.setDeltaTime(ttl.getDeltatime());
                    submitMsg.setRunMemory(memOver.getMemory());
                    if (!isMemoryOver && !isTimeLimited) {
                        if (process.exitValue() != 0) {
                            submitMsg.setResult(Constants.RUNTIME_ERROR);
                            testStates.append(Constants.RUNTIME_ERROR);
                            submitMsg.setErrorMsg(getRuntimeMsg(process.getErrorStream()));
                        } else {
                            String buffer = getOutputData(process.getInputStream());
                            if(buffer.equals(out)) {
                                correct++;
                                testStates.append(Constants.AC);
                            } else {
                                String tempOut = row.get(1).replaceAll("\\s*", "");
                                buffer = buffer.replaceAll("\\s*", "");
                                //格式错误也算正确
                                if(buffer.equals(tempOut)) {
                                    correct++;
                                    submitMsg.setResult(Constants.PRESENTATION_ERROR);
                                    testStates.append(Constants.PRESENTATION_ERROR);
                                } else {
                                    submitMsg.setResult(Constants.WRONG_ANSWER);
                                    testStates.append(Constants.WRONG_ANSWER);
                                }
                            }
                        }
                    } else {
                        break;
                    }
                } catch (IOException | InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
            submitMsg.setAccuracy((float) correct / sum);
            //当通过所有测试样例时，才是AC
            if (submitMsg.getAccuracy() == 1 && submitMsg.getResult() == Constants.DEF) {
                submitMsg.setResult(Constants.AC);
            }
        }
        if (testStates.length() == 0) {
            testStates.append(0);
        }
        submitMsg.setTestStates(testStates.toString());
    }
    /**
     * 获取输出值
     * @param in
     * @return
     */
    private String getOutputData(InputStream in) {
        // TODO Auto-generated method stub
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        String out;
        StringBuilder outData = new StringBuilder();
        int i=0;
        try {
            while((out=reader.readLine()) != null){
                if(i>0){
                    outData.append(" ").append(out);
                    //outData+=(" "+out);
                }else{
                    outData.append(out);
                    //outData+=out;
                }
                i++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return outData.toString();
    }
    /**
     * 输入测试样例
     * @param out
     * @param data
     */
    private void inputData(OutputStream out,String[] data) {
        // TODO Auto-generated method stub
        PrintWriter writer = new PrintWriter(out);
        //PrintWriter writer = new PrintWriter(new BufferedWriter(new OutputStreamWriter(out), 1024 * 100));
        if(data.length>0){
            for(String in:data){
                writer.println(in);
            }
        }
        writer.flush();
        writer.close();
    }
    private String getRuntimeMsg(InputStream in) {
        BufferedReader reader=new BufferedReader(new InputStreamReader(in));
        StringBuilder content=new StringBuilder();
        String line;
        try {
            while((line=reader.readLine())!=null){
                content.append(line);
            }

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return content.toString();
    }
    /**
     * 获取编译错误的信息
     * @return
     */
    private String getErrorMsg(InputStream in) {
        // TODO Auto-generated method stub
        BufferedReader reader=new BufferedReader(new InputStreamReader(in));
        StringBuilder content=new StringBuilder();
        String line;
        try {
            while((line=reader.readLine())!=null){
                int end=line.lastIndexOf("/");
                if(end!= -1) {
                    line=line.substring(end);
                }
                content.append(line);
            }

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return content.toString();
    }
}