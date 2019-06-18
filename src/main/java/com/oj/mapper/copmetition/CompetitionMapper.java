package com.oj.mapper.copmetition;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;
@Mapper
public interface CompetitionMapper {
    //竞赛信息列表
    @Select("SELECT  id,name,FROM_UNIXTIME(start) as start,FROM_UNIXTIME(end) as end,description from teach_test where kind=4 and end<unix_timestamp(now())")
    public List<Map> getCompMaplist();
    //总数
    @Select("SELECT count(*) from teach_test where kind=4 and end<unix_timestamp(now())")
    public int getSum();
    //
    @Select("select id,name, CAST(FROM_UNIXTIME(start) as char) as start, CAST(FROM_UNIXTIME(end) as char) as end,description\n" +
            "from teach_test where kind=4 and end>unix_timestamp(now()) order by start")
    public List<Map> getACompList();

    //获取排行信息
    @Select("SELECT count(distinct problem_id) as ac,user_id  FROM teach_submit_code where accuracy=1 AND hide=0 and test_id in(select id from teach_test where kind=4) group by user_id order by count(distinct problem_id) desc limit 13")
    public List<Map> getrankList();
    @Select("SELECT count(distinct problem_id) as ac,user_id  FROM teach_submit_code where accuracy=1 AND hide=0 and test_id in(select id from teach_test where kind=4) group by user_id order by count(distinct problem_id) desc")
    public List<Map> showmorerank();

    //学生信息
    @Select("select account,a.name as name,b.name as className\n" +
            "from teach_students a,teach_class b\n" +
            "where a.class_id=b.id and a.id=#{id}")
    public Map<String,String> getStudent(String id);

    //
    @Select("select count(distinct test_id)\n" +
            "from teach_submit_code\n" +
            "where test_id in (select id from teach_test where kind=4) and user_id=#{id}")
    public String getcompnum(String id);

    @Select("select id,name, CAST(FROM_UNIXTIME(start) as char) as start, CAST(FROM_UNIXTIME(end) as char) as end,description from teach_test where id=#{id} ")
    public Map<String,Object> showComp(String id);

    @Select("select a.pid,a.score,b.name\n" +
            "from teach_test_problems a ,teach_problems b\n" +
            "where tid=#{id} and a.pid=b.id")
    public List<Map> CompPro(String id);

    @Select("select problem_id,submit_code,FROM_UNIXTIME(submit_date) as time,submit_state from teach_submit_code where test_id=#{tid} and user_id=#{user_id} order by submit_date desc")
    public List<Map> submitStatus(Map<String,Object> param);

    @Select("SELECT count(distinct problem_id) as ac,b.name  \n" +
            "FROM teach_submit_code a,teach_students b ,teach_test c\n" +
            "where accuracy=1 AND hide=0 and test_id =#{id}  and a.user_id=b.id and a.submit_date<c.end group by user_id order by count(distinct problem_id) desc ")
    public List<Map> rankList(String id);

    //查看用户是否已经报名
    @Select("select count(*) from teach_enroll where user_id=#{user_id} and test_id=#{test_id}")
    public int Isenroll(Map<String,String> param);
    //添加一条报名信息
    @Select("insert into teach_enroll values(NULL,#{user_id},#{test_id})")
    public void Insertenroll(Map<String,String> param);
    //取消报名操作
    @Select("delete from teach_enroll where user_id=#{user_id} and test_id=#{test_id}")
    public void deleteenroll(Map<String,String> param);

    //查询所有报名的人
    @Select("select name from teach_enroll a,teach_students b where a.user_id=b.id and a.test_id=#{test_id} order by a.id desc")
    public List<Map> enrollinfo(String test_id);

    //用户未参加过的
    @Select("select id from teach_test where kind=4 and unix_timestamp(now())>end and id not in(select DISTINCT test_id from teach_submit_code where user_id=#{user_id})")
    public List<Map> CompList(String user_id);
    @Select("select id from teach_test where kind=4 and id in(select DISTINCT test_id from teach_submit_code where user_id=#{user_id})")
    public List<Map> CompedeList(String user_id);

    @Select("select id from teach_test where kind=4 and unix_timestamp(now())>end")
    public List<Map> CompAll();

    @Select("select id,name  from teach_test where kind=4 and id in(select DISTINCT test_id from teach_submit_code where user_id=3230)")
    public List<Map> CompedList(String user_id);
}
