package com.oj.mapper.system;

import com.oj.entity.system.RankingList;
import com.oj.mapper.provider.system.RankingProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;
import java.util.Map;

/**
 * Created by AC on 2019/5/7 13:52
 */
@Mapper
public interface RankingMapper {
    @SelectProvider(type= RankingProvider.class, method = "getQuerySql")
    public List<RankingList> getRankingMaplist(@Param("condition") Map<String, String> params);
    // 查询总数
    @Select("SELECT COUNT(DISTINCT user_id) FROM teach_submit_code WHERE submit_state = 1 AND hide = 0")
    public int selectTotalCount();

    //根据id查询姓名
    @Select("select name from teach_students where id = #{id}")
    public String selectName(String id);

    //根据id查询提交总数
    @Select("SELECT COUNT(user_id) FROM teach_submit_code WHERE user_id = #{id}")
    public int selectTot(String id);

    //查询三个月排行榜
    @SelectProvider(type= RankingProvider.class, method = "getQuerySql1")
    public List<RankingList> getRankingMaplist1(@Param("condition") Map<String, String> params);
    //根据id查询三个月提交总数
    @Select("SELECT COUNT(user_id) FROM teach_submit_code WHERE user_id = #{id} AND submit_date > #{time}")
    public int selectTot1(@Param("id") String id,@Param("time") String time);
    // 查询三个月总数
    @Select("SELECT COUNT(DISTINCT user_id) FROM teach_submit_code WHERE submit_date > #{time} AND submit_state = 1 AND hide = 0")
    public int selectTotalCount1(String time);

    //查询个人ac数
    @Select("SELECT COUNT(DISTINCT problem_id) FROM teach_submit_code WHERE submit_state = 1 AND hide = 0  AND user_id = #{id}")
    public int selectAc(String id);

    //通过id查询学号
    @Select("select account from teach_students where id = #{id}")
    public String selectAccount(String id);

    //通过AC数得到排名
    @Select("SELECT COUNT(*) FROM(SELECT COUNT(DISTINCT problem_id ) AS ac FROM teach_submit_code " +
            "WHERE submit_state = 1 AND hide = 0 GROUP BY user_id) AS t WHERE ac > #{ac}")
    public int selectRank(int ac);

    //通过id查询班级
    @Select("SELECT NAME FROM teach_class WHERE id = (SELECT class_id FROM teach_students WHERE id = #{id})")
    public String selectClass(String id);

    //通过学号查询id
    @Select("select id from teach_students where account = #{account}")
    public String searchid(String account);

    //通过id查询ac的题号
    @Select("SELECT DISTINCT problem_id FROM teach_submit_code WHERE user_id = #{id} AND submit_state = 1 AND hide = 0 order by problem_id")
    public List<String> acProblem(String id);

    //通过id查询ac的题目数
    @Select("SELECT COUNT(DISTINCT problem_id) FROM teach_submit_code WHERE submit_state = 1 AND hide = 0  AND user_id = #{id}")
    public int acProblemCount(String id);

    //通过id查询总的题目号
    @Select("SELECT DISTINCT problem_id FROM teach_submit_code WHERE user_id = #{id} AND hide = 0 order by problem_id")
    public List<String> AllProblem(String id);

}
