package com.oj.mapper.provider.resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;
/**
 * @author zt
 * @Description 与myfile表相关动态sql生成
 */
public class MyFileProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    public String getAllQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        String id = info.get("user_id");
        sql.append("select * from ( ");
        sql.append(" SELECT myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag FROM teach_myfile myfile, teach_admin admin ");
        sql.append(" WHERE myfile.flag = 0 ");
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND myfile.name like '%"+info.get("name")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("uploader_id"))){
            sql.append(" AND myfile.uploader_id = "+info.get("uploader_id")+" ");
        }
        if (!StringUtils.isEmpty(info.get("time"))){
            int t = Integer.parseInt(info.get("time"))+86400;
            sql.append(" AND myfile.upload_time > '"+info.get("time")+"' and myfile.upload_time < '"+t+"'");
        }
        //System.out.println("id : "+id);
        sql.append(" AND myfile.uploader_id in (select admin_id from teach_admin_course where course_id in (select course_id from teach_course_class where class_id in (select class_id from teach_students where account = "+id+")))");
        sql.append(" AND myfile.uploader_id = admin.id ");
        sql.append(" UNION ALL ");
        sql.append("select myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag from teach_myfile myfile, teach_admin admin where flag = 1 and myfile.uploader_id = admin.id ");
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND myfile.name like '%"+info.get("name")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("uploader_id"))){
            sql.append(" AND myfile.uploader_id = "+info.get("uploader_id")+" ");
        }
        if (!StringUtils.isEmpty(info.get("time"))){
            int t = Integer.parseInt(info.get("time"))+86400;
            sql.append(" AND myfile.upload_time > '"+info.get("time")+"' and myfile.upload_time < '"+t+"'");
        }
        sql.append(" ) a order by a.upload_time desc;");
        System.out.println(sql);
        System.out.println("params : " + params.toString());
        log.info(sql.toString());
        return sql.toString();
    }
    public String getQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();

        sql.append(" SELECT myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag FROM teach_myfile myfile, teach_admin admin ");
        sql.append(" WHERE myfile.flag = '0' ");
        String id = info.get("user_id");
        //System.out.println("id : "+id);
        sql.append(" AND myfile.uploader_id in (select admin_id from teach_admin_course where course_id in (select course_id from teach_course_class where class_id in (select class_id from teach_students where account = "+id+")))");
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND myfile.name like '%"+info.get("name")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("uploader_id"))){
            sql.append(" AND myfile.uploader_id = "+info.get("uploader_id")+" ");
        }
        if (!StringUtils.isEmpty(info.get("time"))){
            int t = Integer.parseInt(info.get("time"))+86400;
            sql.append(" AND myfile.upload_time > '"+info.get("time")+"' and myfile.upload_time < '"+t+"'");
        }
        sql.append(" AND myfile.uploader_id = admin.id order by myfile.upload_time desc");
        System.out.println(sql);
        System.out.println("params : " + params.toString());
        log.info(sql.toString());
        return sql.toString();
    }
    public String getOpenQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag from teach_myfile myfile, teach_admin admin where flag = 1 ");

        String id = info.get("user_id");
        //System.out.println("id : "+id);
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND myfile.name like '%"+info.get("name")+"%' ");
        }
        if (!StringUtils.isEmpty(info.get("uploader_id"))){
            sql.append(" AND myfile.uploader_id = "+info.get("uploader_id")+" ");
        }
        if (!StringUtils.isEmpty(info.get("time"))){
            int t = Integer.parseInt(info.get("time"))+86400;
            sql.append(" AND myfile.upload_time > '"+info.get("time")+"' and myfile.upload_time < '"+t+"'");
        }
        sql.append(" AND myfile.uploader_id = admin.id order by myfile.upload_time desc");
        System.out.println(sql);
        System.out.println("params : " + params.toString());
        log.info(sql.toString());
        return sql.toString();
    }
}
