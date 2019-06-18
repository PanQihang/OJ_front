package com.oj.mapper.exam;


import com.oj.mapper.provider.Exam.TestProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年4月30日 17点58分
 * @Description teach_test操作接口
 */
@Mapper
public interface TestMapper {

    //通过学号获取全部实验列表
    @Select("SELECT t.id id,name,start,end FROM teach_test t,teach_test_class c WHERE  c.`class_id` = #{account} AND c.`test_id` = t.id\n" +
            "and t.kind = 2 ORDER BY end DESC;")
    public List<Map> getExperMaplist(@Param("account")String account);

    //通过学生id获取全部考试列表
    @Select(" SELECT DISTINCT test.id id,name,start,end,is_ip,only_ip,s.sid sid,first_ip FROM\n" +
            "(SELECT t.id id,name,start,end,is_ip,only_ip FROM teach_test t,teach_test_class c WHERE  c.`class_id` = #{cid} AND c.`test_id` = t.id  AND t.kind = 1 ) AS test\n" +
            "LEFT JOIN teach_test_students s \n" +
            "ON s.sid = #{sid} AND s.tid = test.`id`  \n" +
            "  ORDER BY END DESC;")
    public List<Map> getExamMaplist(@Param("cid")String cid,@Param("sid") String sid);

    //通过tid与学生id获取提交状态信息
    //通过TestProvider类中的getQuerySql()方法动态构建查询语句
    @SelectProvider(type= TestProvider.class, method = "getQuerySql")
    List<Map> getSubmitState(@Param("condition") Map<String, String> param, @Param("sid") String sid);

    //获取一条实验或考试的详细信息
    @Select("SELECT t.name name,start,end,description,is_ip,only_ip,a.name admin " +
            "FROM teach_test t,teach_admin a " +
            "WHERE t.`id` = #{tid} AND t.admin_id = a.`id`;")
    public List<Map> getTestDetail(@Param("tid")String tid);

    //通过id获取题目详细信息
    @Select("SELECT  p.*,COUNT(sc.submit_state = 1 OR NULL) AC_number,COUNT(sc.id) submit_number,s.name subject\n" +
            "FROM teach_problems p LEFT JOIN teach_subject s ON s.id = p.`subjectid`\n" +
            "left join teach_submit_code sc on  p.id = sc.`problem_id`  WHERE p.id =  #{id}\n" +
            "GROUP BY p.id")
    List<Map> getProblemById(@Param("id") String id);

    //获取提交状态分类
    @Select("SELECT id,state_name from teach_submit_state")
    List<Map> getSubmitType();

    //将初次登陆考试的ip进行记录
    @Insert("INSERT INTO teach_test_students (tid,sid ,first_ip) VALUES(#{tid},#{sid},#{first_ip});")
    public void saveIP(@Param("tid") String tid,@Param("sid") String sid,@Param("first_ip") String first_ip);

    //获取可参与考试的ip段
    @Select("SELECT teach_ip.ip FROM teach_test_ip,teach_ip WHERE teach_test_ip.tid = #{tid} AND teach_ip.id = teach_test_ip.iid;")
    List<Map> getTestIp(@Param("tid") String tid);


    //查询正在进行的考试的班级
    @Select("SELECT DISTINCT class_id FROM teach_test, teach_test_class WHERE  teach_test_class.`test_id` = teach_test.`id` AND teach_test.`end` > UNIX_TIMESTAMP() AND UNIX_TIMESTAMP() > teach_test.`start`;")
    List<Map> getTestClass();

    //获取正在进行考试的ip
    @Select("SELECT teach_test_students.sid,teach_test_students.`first_ip` FROM teach_test, teach_test_students WHERE  teach_test_students.`tid` = teach_test.`id` AND teach_test.`end` > UNIX_TIMESTAMP() AND UNIX_TIMESTAMP() > teach_test.`start`;")
    List<Map> getTestIps();

    //获取此时正在进行的考试的截至时间
    @Select("SELECT max(teach_test.end) end FROM teach_test WHERE kind=1 and teach_test.`end` > UNIX_TIMESTAMP() AND UNIX_TIMESTAMP() > teach_test.`start`;")
    List<Map> getTestEndTime();

}
