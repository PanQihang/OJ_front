package com.oj.judge;

import java.util.concurrent.Callable;

public class TtlListener implements Callable<Boolean>{
	private volatile Process process;
	private final long timeout = 2000;
	private long deltatime = 0;

	public void setProcessAndStarttime(Process process) {
		this.process = process;
	}
	@Override
	public Boolean call() {
		// TODO Auto-generated method stub
		boolean timeLimited=false;
		long startTime = System.currentTimeMillis();
		while(process.isAlive()){
			deltatime = System.currentTimeMillis() - startTime;
			//Ttl
			if(deltatime > timeout){
				process.destroy();
				timeLimited = true;
			}
		}    		
		return timeLimited;

	}
	public long getDeltatime(){
		return deltatime;
	}

}
