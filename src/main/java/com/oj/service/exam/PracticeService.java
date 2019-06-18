package com.oj.service.exam;

import com.oj.entity.practic.SubmitCode;

import java.util.List;
import java.util.Map;

public interface PracticeService {

    //获取题目类型的二级列表数据
    public List<Map> getProblemTypeList();
    //获取对应指定用户的题目集 ---不分页
    public List<Map> getTargetProblemList(String stuId);
    //获取对应指定用户的题目集 ---- 分页
    public Map getPagingTargetProblemList(Map param);
    //获取指定用户在系统中的简要信息
    public Map getSystemSimpleInf(String stuId);
    //获取指定题目的详细信息
    public Map getTargetProblemInf(String proId);
    //验证代码提交以及查阅请求是否为有效请求（既非考试阶段无法查看题目以及提交代码、非公开题目无法查看以及提交代码）
    public List<Map<String, Object>> checkRequestCondition(Map params);
    //获取指定提交编号的处理结果
    public Map getTargetResult(String submitId);
    //获取最新创建的10个题目信息
    public List<Map> getNewestProList();

    /**
     * 插入一行提交信息
     * @param code
     * @return
     */
    Integer insertSubmit(SubmitCode code);

    /**
     * 更新状态
     * @param pojo
     * @return
     */
    Integer updateState(SubmitCode pojo);
    /**
     * 得到测试样例
     * @param problemId
     * @return
     */
    Map<Integer, List<String>> selectTestData(Integer problemId);

    public void addReply(Map<String,String> param);

    public List<Map> getReply(String proId);
    public List<Map> OpenReply(Map<String,String> param);
    public void Reply(Map<String,String> param);
}
