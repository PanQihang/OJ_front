package com.oj.service.serviceImpl.system;

import com.oj.frameUtil.OJPWD;
import com.oj.mapper.system.LoginMapper;
import com.oj.service.system.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月17日 11点16分
 * @Description 登陆验证相关功能Service接口实现类
 */
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired(required = false)
    private LoginMapper mapper;

    /**
     * 通过登陆名和密码查询用户的接口功能实现
     * @param loginInfo
     * @return 返回用户列
     */
    @Override
    public List<Map<String, String>> getUserByLoginInfo(Map<String, String> loginInfo) {
        return mapper.getUserByLoginInfo(loginInfo);
    }

    /**
     * 通过用户ID更新密码的接口功能实现
     * @param user_id
     * @param newPassword
     */
    @Override
    public void resetPassword(String user_id, String newPassword) {
        //对新密码进行MD5加密
        newPassword = OJPWD.OJPWDTOMD5(newPassword);
        mapper.resetPassword(newPassword, user_id);
    }
}
