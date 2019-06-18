package com.oj.mapper.system;

import com.oj.entity.system.User;
import com.oj.mapper.provider.system.UserProvider;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 用户表数据库操作接口
 */
//注册Mapper
@Mapper
public interface UserMapper {

    //通过UserProvider类中的getQuerySql()方法动态构建查询语句
    @SelectProvider(type=UserProvider.class, method = "getQuerySql")
    //查询用户结果，返回Map类型List
    public List<Map> getUserMapList(@Param("condition")Map<String, String> param);

    //获取角色下拉信息
    @Select("SELECT id, role_name FROM teach_back_role WHERE id != '32' ")
    public List<Map> getRoleSelectInfo();

    //通过登陆名获取用户
    @Select("SELECT id FROM teach_admin where account = #{account}")
    public List<Map> getUserByAccount(@Param("account")String account);

    //保存用户
    @Insert("insert into teach_admin(account, password, name, role) values(#{account}, #{password}, #{name}, #{role})")
    @Options(useGeneratedKeys=true, keyProperty="id",keyColumn="id")
    public int save(User user);

    //更新用户
    @Update("update teach_admin set account=#{account}, name=#{name}, role=#{role} where id = #{id}")
    public int update(User user);

    //删除用户
    @Delete("delete from teach_admin where id = #{id}")
    public void userDelete(String id);

    //获取课程列表
    @Select("SELECT * FROM teach_course a LEFT JOIN (SELECT admin_id, course_id FROM teach_admin_course WHERE admin_id =#{user_id}) b ON a.id = b.course_id ORDER BY a.id DESC")
    public List<Map> getCourseList(@Param("user_id")String user_id);

    //通过用户id删除用户关联课程信息
    @Delete("delete from teach_admin_course where admin_id = #{user_id}")
    public void userCourseDelete(@Param("user_id") String user_id);

    //保存用户关联课程信息
    @Insert("insert into teach_admin_course(admin_id, course_id) values(#{user_id}, #{course_id})")
    public int saveCourseList(@Param("user_id") String user_id, @Param("course_id") String course_id);

}
