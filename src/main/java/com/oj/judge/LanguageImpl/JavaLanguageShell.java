package com.oj.judge.LanguageImpl;

import com.oj.judge.BaseSubmitMsg;

import java.io.File;


public class JavaLanguageShell extends BaseSubmitMsg {
    /**
     * java文件的类名前缀
     */
    private static final String CLASS_NAME = "Temp";

    @Override
    public String getCompileShell() {

        return "javac "+ FILE_PATH + CLASS_NAME + subId + ".java";
    }
    @Override
    public String getExecuteShell() {
        return "java -classpath "+ FILE_PATH + " " + CLASS_NAME + subId;
    }
    @Override
    public String getProcessName() {
        if (null == subId || subId.length() == 0) {
            return null;
        }
        return CLASS_NAME + subId;
    }
    @Override
    public String getFileName() {
        if (isSubIdEmpty()) {
            return null;
        }
        return FILE_PATH + CLASS_NAME + subId + ".java";
    }
    /**
     * java需要删除源文件和class文件
     * @return
     */
    @Override
    public boolean deleteOldFile() {
        String fileName = FILE_PATH + CLASS_NAME + subId;
        return new File(fileName + ".class").delete()
                && new File(fileName + ".java").delete();
    }

    /**
     * 把类名修改成Temp+subId
     * @param code
     */
    @Override
    public void setCode(String code) {
        this.code = code.replace(CLASS_NAME, CLASS_NAME + subId);
    }
}