package com.oj.service.serviceImpl.exam;

import com.oj.mapper.exam.TestMapper;
import com.oj.service.exam.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年4月30日 18点28分
 * @Description 考试实验相关功能Service接口
 */
@Service
public class TestServiceImpl implements TestService {
    @Autowired(required = false)
    private TestMapper testMapper;

    /**
     * 通过实验id与学生id获取提交状态信息
     * @return 全部考试实验
     */
    @Override
    public List<Map> getExperMaplist(String account) {
        return testMapper.getExperMaplist(account);
    }

    @Override
    public List<Map> getSubmitState(String sid,Map<String, String> param) {

        return testMapper.getSubmitState(param,sid);
    }

    @Override
    public List<Map> getTestDetail(String tid) {
        return testMapper.getTestDetail(tid);
    }

    //获取单个问题的详细信息
    public List<Map> getProblemDetails(String id){
        return testMapper.getProblemById(id);
    }

    //获取提交状态分类

    @Override
    public List<Map> getSubmitType() {
        return testMapper.getSubmitType();
    }

    @Override
    public List<Map> getExamMaplist(String sid,String cid) {
        return testMapper.getExamMaplist(sid,cid);
    }

    //将初次登陆考试的ip进行记录
    public void saveIP(String tid,String sid,String first_ip){
        testMapper.saveIP(tid,sid,first_ip);
    }

    @Override
    public List<Map> getTestIp(String tid) {
        return testMapper.getTestIp(tid);
    }

    @Override
    public List<Map> getTestClass() {
        return testMapper.getTestClass();
    }

    //获取正在进行考试的ip

    @Override
    public List<Map> getTestIps() {
        return testMapper.getTestIps();
    }

    @Override
    public List<Map> getTestEndTime() {
        return testMapper.getTestEndTime();
    }
}
