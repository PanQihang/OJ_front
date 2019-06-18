package com.oj.judge;

import com.oj.judge.LanguageImpl.CLanguageShell;
import com.oj.judge.LanguageImpl.CppLanguageShell;
import com.oj.judge.LanguageImpl.JavaLanguageShell;
import com.oj.judge.LanguageImpl.PyLanguageShell;

public class SubmitTaskFactory {
    /**
     * 工厂方法，根据语言id，生成对应的对象
     * @param language
     * @return
     */

    public static BaseSubmitMsg produce(int language) {
        switch (language) {
            case 1:
                return new CppLanguageShell();
            case 2:
                return new CLanguageShell();
            case 3:
                return new JavaLanguageShell();
            case 4:
                return new PyLanguageShell();
            default:
                return null;
        }

    }
}
