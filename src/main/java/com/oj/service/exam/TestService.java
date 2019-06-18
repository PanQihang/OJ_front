package com.oj.service.exam;

import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年4月30日 18点15分
 * @Description 考试实验功能Service接口
 */
public interface TestService {

    //通过学生所在班级获取全部实验列表
    public List<Map> getExperMaplist(String account);

    public List<Map> getExamMaplist(String sid, String cid);

    //通过实验id与学生id获取提交状态信息
    public List<Map> getSubmitState(String sid, Map<String, String> param);

    //获取一条实验或考试的详细信息
    public List<Map> getTestDetail(String tid);

    //获取单个问题的详细信息
    List<Map> getProblemDetails(String id);

    //获取提交状态分类
    List<Map> getSubmitType();

    //将初次登陆考试的ip进行记录
    void saveIP(String tid, String sid, String first_ip);

    //获取可参与考试的ip段
    List<Map> getTestIp(String tid);

    //查询正在进行的考试的班级
     List<Map> getTestClass();

    //获取正在进行考试的ip
    List<Map> getTestIps();

    //获取正在进行的考试的截至时间
    List<Map> getTestEndTime();
}
