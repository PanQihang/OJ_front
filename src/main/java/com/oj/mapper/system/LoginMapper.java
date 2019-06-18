package com.oj.mapper.system;

import com.oj.mapper.provider.system.LoginProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 登陆功能对应数据库操作的功能接口
 */
@Mapper
public interface LoginMapper {
    //通过登录名和密码检索数据库
    @SelectProvider(type=LoginProvider.class, method = "getLoginQuerySql")
    public List<Map<String, String>> getUserByLoginInfo(@Param("condition")Map<String, String> loginInfo);

    //通过用户ID更新用户密码
    @Update("update teach_students set password = #{newPassword} where id = #{user_id}")
    public void resetPassword(@Param(value = "newPassword") String newPassword,@Param(value = "user_id") String user_id);
}
