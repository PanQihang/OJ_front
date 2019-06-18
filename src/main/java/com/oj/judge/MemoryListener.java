package com.oj.judge;

import org.apache.commons.lang.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;

public class MemoryListener implements Callable<Boolean>{
    /**
     * kb
     */
    private final int limitMemory = 50240;
	private volatile Process process;
	private String processName;
	private int memory;
	private CountDownLatch latch = null;
	public void setInfo(Process process, String processName) {
		this.process = process;
		this.processName=processName;
	}
	private int getProcessMem(String processName) throws IOException {
	    if (StringUtils.isEmpty(processName)) {
	        return 0;
        }
        //$6 RSS
        String[] cmds = {"/bin/sh","-c","ps aux | grep "+ processName + " | grep -v \"grep\" | awk '{print $6}'"};
		int memory = 0;
        Process process;
        BufferedReader reader = null;
        try {
            process = Runtime.getRuntime().exec(cmds);
            process.waitFor();
            reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String rss = reader.readLine();
            if (!StringUtils.isEmpty(rss)) {
                memory = Integer.valueOf(rss);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                reader.close();
            }
        }
        return memory;
	}
	@Override
	public Boolean call() throws Exception {
		String os = System.getProperty("os.name");
		if (os.toLowerCase().startsWith("win")) {
			if(latch.getCount() != 0){
				latch.countDown();
			}
			return false;
		}
		boolean memLimit = false;
		int tempMemory = 0;
		memory = 0;
		while (process.isAlive()) {
			tempMemory = getProcessMem(processName);
			if (tempMemory > memory) {
				memory = tempMemory;
			}
			if(tempMemory > limitMemory){
				process.destroy();
				memLimit = true;
				break;
			}
			if(latch.getCount() != 0){
				latch.countDown();
			}
		}
		if(latch.getCount() != 0){
			 latch.countDown();
		}
		return memLimit;
	}
	public int getMemory(){
		return memory;
	}
	public CountDownLatch getLatch(){
		return latch;
	}
	public void setLatch(CountDownLatch latch){
		this.latch=latch;
	}
	// javac -encoding gbk Main.java -classpath /home/user/JAVAProject/QOJ/bin/
}
