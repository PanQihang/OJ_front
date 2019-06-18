package com.oj.service.serviceImpl.system;

import com.oj.entity.system.User;
import com.oj.frameUtil.OJPWD;
import com.oj.mapper.system.UserMapper;
import com.oj.service.system.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 系统用户管理相关功能Service接口实现类
 */

//向框架中注册Service
@Service
public class UserServiceImpl implements UserService {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    //注入UserMapper
    @Autowired(required = false)
    private UserMapper mapper;

    /**
     * 返回Map类型的List接口方法实现
     * @param param
     * @author lixu
     * @return List<Map>
     */
    @Override
    public List<Map> getUserMapList(Map<String, String> param) {
        return mapper.getUserMapList(param);
    }

    @Override
    public List<Map> getRoleSelectInfo(){
        return mapper.getRoleSelectInfo();
    }

    /**
     * 保存或更新用户
     * @param user
     * @throws Exception
     */
    @Transactional
    @Override
    public void saveOrUpdateUser(User user) throws Exception {
        //若用户id为空，为保存
        if (StringUtils.isEmpty(user.getId())){
            //若当前登录名已经存在，则抛出用户已存在的异常
            if(mapper.getUserByAccount(user.getAccount()).size()>0){
                throw new Exception("当前登录名已存在!");
            }else{
                //将新增的用户密码设为123456
                user.setPassword(OJPWD.OJPWDTOMD5("123456"));
                mapper.save(user);
            }
        }else{
            //不是新用户，进行用户更新
            mapper.update(user);
        }
    }

    /**
     * 用户删除接口功能实现
     * @param id
     */
    @Transactional
    @Override
    public void userDelete(String id) {
        //在删除用户之前应该先对其关联的课程信息进行解绑
        mapper.userCourseDelete(id);
        //解绑成功之后，再进行用户删除操作
        mapper.userDelete(id);
    }

    /**
     * 获取课程列表接口功能实现
     * @param user_id
     * @return
     */
    @Override
    public List<Map> getCourseList(String user_id) {
        return mapper.getCourseList(user_id);
    }

    /**
     * 保存用户绑定课程的信息功能接口实现
     * @param param
     */
    @Transactional
    @Override
    public void saveCourseList(Map<String, Object> param) {
        String user_id = param.get("user_id").toString();
        List<String> course_list = (List<String>)param.get("course_list");
        //现解除用户的全部课程绑定
        mapper.userCourseDelete(user_id);
        //重新对用户的课程进行绑定
        for (String course_id : course_list){
            mapper.saveCourseList(user_id, course_id);
        }
    }
}
