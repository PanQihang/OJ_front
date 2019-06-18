package com.oj.mapper.provider.system;

import com.oj.frameUtil.OJPWD;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class LoginProvider {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * 生成登陆校验数据库的sql语句
     * @param params
     * @return 查询sql
     */
    public String getLoginQuerySql(Map<String, Object> params){
        Map<String, String> loginInfo = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select a.*, b.name as class_name from teach_students a INNER JOIN teach_class b ON a.class_id = b.id where account = '"+loginInfo.get("username")+"' and password = '"+OJPWD.OJPWDTOMD5(loginInfo.get("passwords"))+"'");
        log.info(sql.toString());
        return sql.toString();
    }
}
