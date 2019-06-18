package com.oj.service.system;


import com.oj.entity.system.User;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 系统用户管理相关功能Service接口
 */
public interface UserService {

    //返回Map类型的List
    public List<Map> getUserMapList(Map<String, String> param);

    //获取角色下拉信息
    public List<Map> getRoleSelectInfo();

    //保存或更新用户
    public void saveOrUpdateUser(User user) throws Exception;

    //用户删除
    public void userDelete(String id);

    //获取课程列表
    public List<Map> getCourseList(String user_id);

    //保存用户绑定课程的信息
    public void saveCourseList(Map<String, Object> param);

}
