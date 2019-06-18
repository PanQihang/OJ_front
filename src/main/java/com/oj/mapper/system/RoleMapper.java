package com.oj.mapper.system;

import com.oj.entity.system.Role;
import com.oj.mapper.provider.system.RoleProvider;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 角色表数据库操作接口
 */
@Mapper
public interface RoleMapper {

    //获取符合查询条件下的角色列表
    @SelectProvider(type=RoleProvider.class, method = "getQuerySql")
    public List<Map> getRoleMapList(@Param("condition")Role role);

    //通过id删除角色
    @Delete("delete from teach_back_role where id=#{id}")
    public void roleDelete(String id);

    //通过id查询角色信息
    @Select("select * from teach_back_role where id=#{id}")
    public List<Map> getRoleById(String id);

    //获取角色表中最大的码值
    @Select("SELECT max(role_code )+1 as max_code FROM teach_back_role")
    public List<String> getcode();

    //保存角色信息
    @Insert("insert into teach_back_role(role_name, role_code, role_desc) values(#{role_name}, #{role_code}, #{role_desc}) ")
    public int save(Role role);

    //更新角色信息
    @Update("update teach_back_role set role_name=#{role_name}, role_desc=#{role_desc} where id=#{id}")
    public int update(Role role);

    //通过角色ID删除角色对应权限表中的关联数据
    @Delete("delete from teach_back_role_auth where roleId=#{role_id}")
    public void roleAuthDelete(String role_id);

    //向角色权限关联表中保存角色关联权限的信息
    @Insert("insert into teach_back_role_auth(roleId, authId) values(#{role_id}, #{authId})")
    public int roleAuthSave(@Param("authId") String authId, @Param("role_id") String role_id);

    //通过角色ID将用户表中的角色字段置空
    @Update("update teach_admin set role = null where role=#{id} ")
    public void resetUserRole(String id);
}
