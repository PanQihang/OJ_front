package com.oj.judge.LanguageImpl;

import com.oj.judge.BaseSubmitMsg;

import java.io.File;


public class PyLanguageShell extends BaseSubmitMsg {

    @Override
    public String getCompileShell() {
        return null;
    }
    @Override
    public String getExecuteShell() {
        return "python3 "+ FILE_PATH + subId + ".py";
    }
    @Override
    public String getProcessName() {
        if (null == subId || subId.length() == 0) {
            return null;
        }
        return subId + ".py";
    }
    @Override
    public String getFileName() {
        if (isSubIdEmpty()) {
            return null;
        }
        return FILE_PATH + subId + ".py";
    }
    @Override
    public boolean deleteOldFile() {
        String fileName = FILE_PATH + subId + ".py";
        return new File(fileName).delete();
    }
}

