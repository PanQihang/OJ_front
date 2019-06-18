package com.oj.judge.LanguageImpl;

import com.oj.judge.BaseSubmitMsg;

import java.io.File;


public class CppLanguageShell extends BaseSubmitMsg {
    @Override
    public String getCompileShell() {
        return "g++ "+FILE_PATH+subId+".cpp -o "+FILE_PATH+subId + ".exe";
    }
    @Override
    public String getExecuteShell() {
        return FILE_PATH + subId + ".exe";
    }

    @Override
    public boolean deleteOldFile() {
        String fileName = FILE_PATH + subId;
        return new File(fileName + ".cpp").delete()
                && new File(fileName + ".exe").delete();
    }

    @Override
    public String getFileName() {
        if (isSubIdEmpty()) {
            return null;
        }
        return FILE_PATH + subId + ".cpp";
    }

    @Override
    public String getProcessName() {
        if (isSubIdEmpty()) {
            return null;
        }
        return subId;
    }
}

