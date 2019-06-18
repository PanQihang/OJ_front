package com.oj.mapper.provider.system;

import com.oj.entity.system.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月17日 10点54分
 * @Description 与角色表相关动态sql生成
 */
public class RoleProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    /**
     * 生成角色信息查询的sql语句
     * @param params
     * @return 查询sql
     */
    public String getQuerySql(Map<String, Object> params){
        Role role = (Role)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append(" SELECT ( @i := @i + 1 ) AS num, t1.* ");
        sql.append(" FROM ( SELECT * FROM teach_back_role WHERE id != '32' ");
        if (!StringUtils.isEmpty(role.getRole_code())){
            sql.append(" AND role_code like '%"+role.getRole_code()+"%' ");
        }
        if (!StringUtils.isEmpty(role.getRole_name())){
            sql.append(" AND role_name like '%"+role.getRole_name()+"%' ");
        }
        sql.append(" ) t1, ( SELECT @i := 0 ) t2 ");
        log.info(sql.toString());
        return sql.toString();
    }
}
