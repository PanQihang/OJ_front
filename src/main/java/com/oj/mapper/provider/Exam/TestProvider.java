package com.oj.mapper.provider.Exam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * @author zhouli
 * @Description 与Test表相关动态sql生成
 */
public class TestProvider  {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    public String getQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        String sid = (String)params.get("sid");
        String tid = info.get("tid");
        StringBuffer sql = new StringBuffer();
        sql.append(" SELECT ( @i := @i + 1 ) AS num,t1.* ");
        sql.append(" FROM( SELECT problems.id id,name,score,submit_code,submit_date,CASE  submit_language WHEN 1 THEN 'C++' \n" +
                " WHEN 2 THEN 'C' \n" +
                " WHEN 3 THEN 'Java' \n" +
                " WHEN 4 THEN 'Python' \n" +
                " END AS  submit_language," +
                "CASE submit_state\n" +
                " WHEN 1 THEN 'Accepted' \n" +
                " WHEN 2 THEN 'PresentationError' \n" +
                " WHEN 3 THEN 'WrongAnswer' \n" +
                " WHEN 4 THEN 'RuntimeError' \n" +
                " WHEN 5 THEN 'TimeLimitExceed' \n" +
                " WHEN 6 THEN 'MemoryLimitExceed' \n" +
                " WHEN 7 THEN 'SystemCallError' \n" +
                " WHEN 8 THEN 'CompileError' \n" +
                " WHEN 9 THEN 'SystemError' \n" +
                " WHEN 10 THEN 'ValidateError' \n" +
                " WHEN 11 THEN '含违规字符' \n" +
                " END AS  submit_state,submit_memory,submit_time,submit_code_length");

        sql.append(" FROM (SELECT p.id id,p.name name,tp.score score FROM teach_problems p,");
        sql.append(" (SELECT pid,score FROM teach_test_problems WHERE tid = "+ tid+") AS tp");
        sql.append(" WHERE p.id = tp.pid");
        if (!StringUtils.isEmpty(info.get("id"))){
            sql.append(" AND p.id = '"+info.get("id")+"' ");
        }
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND p.name like '%"+info.get("name")+"%' ");
        }
        sql.append(" )AS problems");
        sql.append(" LEFT JOIN teach_submit_code tc");
        sql.append(" ON tc.problem_id = problems.id AND test_id = "+tid+" AND tc.`user_id` = " + sid);
        sql.append(" LEFT JOIN teach_submit_language l ON l.id = submit_language");
        sql.append(" LEFT JOIN teach_submit_state ss ON ss.id = submit_state");

        if (!StringUtils.isEmpty(info.get("submit"))){
            sql.append(" AND ss.id = "+info.get("submit"));
        }
        sql.append(" order by submit_date desc");

        sql.append(" ) t1,( SELECT @i := 0 ) t2 ");
        log.info(sql.toString());
        return sql.toString();
    }
}
