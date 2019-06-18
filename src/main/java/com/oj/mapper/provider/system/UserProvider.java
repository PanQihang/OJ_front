package com.oj.mapper.provider.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月11日 18点15分
 * @Description 与User表相关动态sql生成
 */
public class UserProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    public String getQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append(" SELECT ( @i := @i + 1 ) AS num,t1.* ");
        sql.append(" FROM( SELECT a.id, a.account, a.`name`, ");
        sql.append(" ( SELECT count( * ) FROM teach_admin_course WHERE admin_id = a.id ) AS course_num, a.role, b.role_name ");
        sql.append(" FROM teach_admin a LEFT JOIN teach_back_role b ON a.role = b.id ");
        sql.append(" WHERE a.role != '32' ");
        if (!StringUtils.isEmpty(info.get("id"))){
            sql.append(" AND a.id = '"+info.get("id")+"' ");
        }
        if (!StringUtils.isEmpty(info.get("account"))){
            sql.append(" AND a.account like '%"+info.get("account")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND a.name like '%"+info.get("name")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("role"))){
            sql.append(" AND a.role = '"+info.get("role")+"' ");
        }
        sql.append(" ) t1,( SELECT @i := 0 ) t2 ");
        log.info(sql.toString());
        return sql.toString();

    }
}
