package com.oj.mapper.system;

import com.oj.entity.system.Auth;
import org.apache.ibatis.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年5月13日 14点54分
 * @Description 首页相关业务数据库操作接口类
 */
@Mapper
public interface IndexMapper {
    //获取通知信息
    @Select("SELECT id,title, CAST(FROM_UNIXTIME(time) as char) time,author FROM teach_notice ORDER BY time desc LIMIT 0,5")
    public List<Map> getJxtzList();

    //通过ID获取通知信息
    @Select("SELECT id,title, CAST(FROM_UNIXTIME(time) as char) time,author,content FROM teach_notice where id=#{id}")
    public Map getJxtzById(String id);

    @Select("SELECT a.id,a.NAME as name,CAST( FROM_UNIXTIME( a.START ) AS CHAR ) start, CAST( FROM_UNIXTIME( a.END ) AS CHAR ) end ,a. " +
            "kind,a.is_ip, a.only_ip, c.first_ip FROM teach_test a INNER JOIN ( SELECT * FROM teach_test_class WHERE class_id = " +
            "#{classId} ) b ON a.id = b.test_id LEFT JOIN (SELECT id,tid,sid,first_ip FROM teach_test_students WHERE sid = "+
            "#{studentId}) c on a.id = c.tid  WHERE a. END > UNIX_TIMESTAMP( SYSDATE( ) )")
    public List<Map> getReToDo(@Param("classId")String classId, @Param("studentId")String studentId);

    @Select("SELECT * from teach_recommand_result where uid = #{user_id} ORDER BY score DESC")
    public List<Map> getRecommandList(@Param("user_id")String user_id);
}
