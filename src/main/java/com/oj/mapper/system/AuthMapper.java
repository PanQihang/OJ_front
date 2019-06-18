package com.oj.mapper.system;

import com.oj.entity.system.Auth;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 权限表数据库操作接口
 */
@Mapper
public interface AuthMapper {

    //获取当前用户对应权限的方法
    @Select("SELECT b.* FROM teach_back_role_auth a LEFT JOIN teach_back_auth b ON a.authId  = b.id WHERE a.roleId = #{roleId}")
    public List<Map<String, String>> getAuthListByRole(String roleId);

    //获取全部权限列表
    @Select("SELECT * FROM teach_back_auth")
    public List<Map> getAuthMaplist();

    //插入一条新权限
    @Insert("insert into teach_back_auth(auth_code, auth_name, auth_url, auth_ico, auth_parent) values(#{auth_code}, #{auth_name}, #{auth_url}, #{auth_ico}, #{auth_parent})")
    @Options(useGeneratedKeys=true, keyProperty="id",keyColumn="id")
    public void authSave(Auth auth);

    //通过id更新权限
    @Update("update teach_back_auth set auth_name=#{auth_name}, auth_url=#{auth_url}, auth_ico=#{auth_ico} where id=#{id}")
    public void authUpdate(Auth auth);

    //通过id获取对应的权限信息
    @Select("select * from teach_back_auth where id = #{id}")
    public List<Map> getAuthById(@Param("id") String id);

    //获取子权限
    @Select("select id from teach_back_auth where auth_parent=#{id}")
    public List<String> getChildAuthIds(@Param("id")String id);

    //通过权限ID删除角色权限关联表中对应的信息
    @Delete("delete from teach_back_role_auth where authId=#{id}")
    public void authRoleDelete(@Param("id")String id);

    //权限通过id删除
    @Delete("delete from teach_back_auth where id=#{id}")
    public void authDelete(@Param("id")String id);

    //保存权限与超级管理员的权限关联（超管具有全权限）
    @Insert("insert teach_back_role_auth(roleId, authId) values('32', #{auth_id})")
    public int roleAuthSave(@Param("auth_id")String auth_id);

    //通过角色id获取当前角色的全部权限ID
    @Select("select authId from teach_back_role_auth where roleId = #{id}")
    public List<String> getAuthIds(String id);

}
