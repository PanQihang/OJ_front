package com.oj.mapper.provider.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Calendar;
import java.util.Map;

/**
 * Created by AC on 2019/5/7 13:54
 */
public class RankingProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    //查询数据列表
    public String getQuerySql(Map<String,Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append(" 	SELECT			 ");
        sql.append(" 			COUNT( DISTINCT problem_id ) AS ac,	 ");
        sql.append(" 			user_id	 ");
        sql.append(" 		FROM		 ");
        sql.append(" 			teach_submit_code	 ");
        sql.append(" 		WHERE		 ");
        sql.append(" 			submit_state = 1 	 ");
        sql.append(" 			AND hide = 0  	 ");
        sql.append(" 			GROUP BY 	 ");
        sql.append(" 			user_id  	 ");
        sql.append(" 		ORDER BY		 ");
        sql.append(" 			ac DESC 	 ");
        sql.append(" 			LIMIT "+info.get("start")+","+info.get("count")+"	 ");
        log.info(sql.toString());
        return sql.toString();
    }

    //查询三个月数据列表
    public String getQuerySql1(Map<String,Object> params){
        long nowtime = Calendar.getInstance().getTimeInMillis()/1000;
        nowtime -= 7776000;
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append(" 	SELECT			 ");
        sql.append(" 			COUNT( DISTINCT problem_id ) AS ac,	 ");
        sql.append(" 			user_id	 ");
        sql.append(" 		FROM		 ");
        sql.append(" 			teach_submit_code	 ");
        sql.append(" 		WHERE		 ");
        sql.append(" 			submit_state = 1 	 ");
        sql.append(" 			AND hide = 0  	AND submit_date > '"+nowtime+"'");
        sql.append(" 			GROUP BY 	 ");
        sql.append(" 			user_id  	 ");
        sql.append(" 		ORDER BY		 ");
        sql.append(" 			ac DESC 	 ");
        sql.append(" 			LIMIT "+info.get("start")+","+info.get("count")+"	 ");
        log.info(sql.toString());
        return sql.toString();
    }
}
