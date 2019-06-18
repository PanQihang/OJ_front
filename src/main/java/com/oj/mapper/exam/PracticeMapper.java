package com.oj.mapper.exam;


import com.oj.entity.practic.SubmitCode;
import com.oj.entity.practic.TestData;
import com.oj.mapper.provider.Exam.PracticeProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface PracticeMapper {

    //获取题目类型集
    @Select("select t.id, t.name, t.description father from teach_subject t order by t.id")
    public List<Map<String, Object>> getProblemTypeList();
    //获取指定用户的系统排名（依据为已解决题的数量）   !!!!不推举，时长过久
    @Select("select count(t.userId) from (select id userId from teach_students) t where (select count(distinct problem_id) FinishAmount from teach_submit_code where user_id=t.userId and accuracy=1 and problem_id in (select t.id proId from teach_problems t where t.public = 'on') ) > (select count(distinct problem_id) FinishAmount from teach_submit_code where user_id=#{stuId} and accuracy=1 and problem_id in (select t.id proId from teach_problems t where t.public = 'on') )")
    public Object getTargetRank(String stuId); //没尝试，不知道可不可以指定返回对象未object
    //获取指定题目的详细信息
    @Select("select t.name proName, t.description problemDescription, t.intype inputDescription, t.outtype outputDescription, t.insample inputSample, t.outsample outputSample, t.maxtime TimeLimit, t.maxmemory MemoryLimit, t.public public from teach_problems t where t.id = #{proId}")
    public Map getTargetProblemInf(String proId);
    //查询指定提交id的处理结果
    @Select("SELECT t.id submitId, t.problem_id, t.accuracy accuracy, t.submit_state submitState, t.test_state testState FROM teach_submit_code t WHERE t.id=#{submitId}")
    public Map getTargetResult(String submitId);
    //验证代码提交以及查阅请求是否为有效请求（既非考试阶段无法查看题目以及提交代码、非公开题目无法查看以及提交代码）
    @SelectProvider(type= PracticeProvider.class, method="getCheckRequestConditionSQL")
    public List<Map<String, Object>> checkRequestCondition(@Param("condition")Map params);
    //获取所有公开题目的总数
    @Select("select count(*) from teach_problems where public='on' ")
    public Object getPublicProblemAmount();
    /*********************************************************************************************************
     * 题目集的   非分页  操作调用

     */
    //获取公开题目集
    @Select("select t.id proId, t.name proName, t.rank proRank, t.subjectid proTypeId from teach_problems t where t.public = 'on'")
    public List<Map<String, Object>> getPublicProblemList();
    //获取公开题目的所有提交记录数据（题目id、题目提交总数）318/0.096s
    @Select("select t.problem_id proId, count(t.problem_id) submitAmount from teach_submit_code t where t.problem_id in (select k.id proId from teach_problems k where k.public = 'on' ) group by t.problem_id")
    public List<Map<String, Object>> getPublicProblemStateList();
    //获取公开题目的已AC的提交数据（题目id、题目Ac次数）296/1.466s
    @Select("select t.problem_id proId, count(t.problem_id) AcAmount from teach_submit_code t where t.accuracy=1 and t.problem_id in (select k.id proId from teach_problems k where k.public = 'on' ) group by t.problem_id ")
    public List<Map<String, Object>> getPublicProblemACStateList();
    //在公开题目集中，获取指定用户已尝试的题目集（已解决和未解决的都有/未包含实验与考试的记录）[题目编号、题目状态], [proId, proState]
    @Select("SELECT DISTINCT t.problem_id proId, MIN(t.submit_state) proState FROM teach_submit_code t  WHERE t.user_id = #{stuId} AND t.submit_state!=0 AND t.problem_id IN (SELECT k.id proId FROM teach_problems k WHERE k.public = 'on') GROUP BY proId ORDER BY proId, proState DESC ")
    public List<Map<String, Object>> getTargetProblemStateList(String stuId);
    //在公开题目集中，获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）[题目编号], [proId]
    @Select("select t.problem_id proId from teach_submit_code t where t.user_id = #{stuId} and t.submit_state=1 and t.problem_id in (select id proId from teach_problems where public = 'on') group by t.problem_id")
    public List<Object> getFinishProblemList(String stuId);
    //在公开题目集中，获取指定用户未解决的题目集（只含未解决的/未包含实验与考试的记录）[题目编号], [proId]
    @Select("select t.problem_id proId from teach_submit_code t where t.user_id = #{stuId} and t.submit_state!=1 and t.problem_id in (select id proId from teach_problems where public = 'on') group by t.problem_id")
    public List<Object> getUnfinishProblemList(String stuId);
    //在公开题目集中，获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）

    /*********************************************************************************************************
     * 题目集的   分页     操作调用

     */
    // 分页---获取指定的公开题目（题目id)
    @SelectProvider(type= PracticeProvider.class, method="getPagingPublicProblemListSQL")
    public List<Map> getPagingPublicProblemList(@Param("condition")Map params);
    //分页---获取指定题集的所有提交记录数据（题目id、题目提交总数）
    @SelectProvider(type= PracticeProvider.class, method="getPagingPublicProblemStateListSQL")
    public List<Map<String, Object>> getPagingPublicProblemStateList(@Param("condition")List<Map> params);
    //分页---获取指定题集的已AC的提交数据（题目id、题目Ac次数）
    @SelectProvider(type= PracticeProvider.class, method="getPagingPublicProblemACStateListSQL")
    public List<Map<String, Object>> getPagingPublicProblemACStateList(@Param("condition")List<Map> params);
    //在指定题目集中，获取指定用户已尝试的题目集（已解决和未解决的都有/未包含实验与考试的记录）
    @SelectProvider(type= PracticeProvider.class, method="getPagingTargetProblemStateListSQL")
    public List<Map<String, Object>> getPagingTargetProblemStateList(@Param("condition")List<Map> params, @Param("stuId")String stuId);
    //在指定题目集中，获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）
    @SelectProvider(type= PracticeProvider.class, method="getPagingFinishProblemListSQL")
    public List<Object> getPagingFinishProblemList(@Param("condition")List<Map> params, @Param("condition")String stuId);

    //获取全部公开题目的总数
    @Select("select count(*) from teach_problems where public='on'")
    public Integer getAmountOfProblemList();
    //
    @SelectProvider(type= PracticeProvider.class, method="getAmountPublicProblemListSQL")
    public Integer getAmountPublicProblemList(@Param("condition")Map params);


    //获取最新创建的10个题目信息[{proID, proName}, ...]            -------------------------------- 作用于OJ_front首页
    @Select("select a.id proId, a.name proName, a.rank proRank from teach_problems a where a.public = 'on' order by a.time  desc limit 0, 10")
    public List<Map> getNewestProList();










    //保存用户提交代码
    @Options(useGeneratedKeys = true,keyProperty = "id",keyColumn = "id")
    @Insert("insert into teach_submit_code(problem_id, user_id, test_id, " +
            "hide, submit_code, submit_date, submit_language, submit_state, test_state, submit_memory, submit_time, submit_code_length, accuracy) " +
            "values(#{problemId}, #{userId}, #{testId}, #{hide}, #{submitCode}, #{submitDate}, #{submitLanguage}, 0, 0, 0, 0, #{submitCodeLength}, 0.0)")
    Integer insertSubmit(SubmitCode code);
    /**
     * 将结果更新回数据库
     * @param pojo
     * @return
     */
    @Update("update teach_submit_code\n" +
            "        set submit_state = #{submitState},\n" +
            "        submit_error_message = #{submitErrorMessage},\n" +
            "        test_state = #{testState},\n" +
            "        submit_time = #{submitTime},\n" +
            "        accuracy = #{accuracy},\n" +
            "        submit_memory = #{submitMemory}\n" +
            "        where id = #{id}")
    Integer updateState(SubmitCode pojo);
    /**
     * 得到测试样例
     * @param problemId
     * @return
     */
    @Results({
            @Result(id=true,column="id",property="id"),
            @Result(column="problem_id",property="problemId"),
            @Result(column="in_put",property="input"),
            @Result(column="out_put",property="output")
    })
    @Select("select id,in_put,out_put from teach_test_data where problem_id = #{problemId}")
    List<TestData> selectTestData(Integer problemId);
    //@InsertProvider()
   // @Options(useGeneratedKeys = true,keyProperty = "id",keyColumn = "id")//加入该注解可以保持对象后，查看对象插入id


    //添加一条评论
    @Select("insert into teach_problem_reply values(NULL,#{user_id},#{proId},#{content},UNIX_TIMESTAMP(now()),0)")
    void InsertReply(Map<String,String> param);

    //获取题目下的评论
    @Select("select a.id,a.content,CAST(FROM_UNIXTIME(a.time) as char) as time,b.name,(select count(*) from teach_problem_reply where rid=a.id) as sum\n" +
            "from teach_problem_reply a,teach_students b\n" +
            "where a.pid=#{proId} and a.uid=b.id and a.rid=0 order by a.time desc")
    List<Map> getReply(String proId);

    //获取某一级别下的评论回复
    @Select("select a.id,a.content,CAST(FROM_UNIXTIME(a.time) as char) as time,b.name\n" +
            "from teach_problem_reply a,teach_students b\n" +
            "where a.pid=#{proId} and a.uid=b.id and a.rid=#{id}")
    List<Map> OpenReply(Map<String,String> param);

    @Select("insert into teach_problem_reply values(NULL,#{user_id},#{proId},#{content},UNIX_TIMESTAMP(now()),#{id})")
    void Reply(Map<String,String> param);
}
