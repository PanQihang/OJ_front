package com.oj.service.system;

import com.oj.entity.system.Auth;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年5月13日 14点54分
 * @Description 首页相关业务service接口
 */
public interface IndexService {
    //获取通知信息
    public List<Map> getJxtzList();
    //通过获取通知信息
    public Map getJxtzById(String id);
    //通过classId获取待做列表
    public List<Map> getReToDo(String classId, String studentId);
    //通过当前登陆用户id获取推荐结果
    public List<Map> getRecommandList(String user_id);
}
