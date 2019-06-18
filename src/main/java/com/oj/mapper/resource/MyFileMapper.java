package com.oj.mapper.resource;

import com.oj.mapper.provider.resource.MyFileProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;
import java.util.Map;

/**
 * @author zt
 * @Time 2019年5月5日 11点47分
 * @Description myfile接口操作
 */
@Mapper
public interface MyFileMapper {
    //通过学生学号获取教他老师上传的文件
    /*
    @Select("select * from teach_myfile where flag = 0 and uploader_id = (" +
            "select admin_id from teach_admin_course where course_id in (" +
            "select course_id from teach_course_class where class_id in (" +
            "select class_id from teach_students where account = #{user_id})))")*/
    @SelectProvider(type = MyFileProvider.class, method = "getQuerySql")
    public List<Map> getTeacherFileByStudent(@Param("condition") Map<String, String> param);

    //获取所有文件
    @SelectProvider(type = MyFileProvider.class, method = "getAllQuerySql")
    public List<Map> getAllFileByStudent(@Param("condition") Map<String, String> param);

    /*
    @Select("select myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag from teach_myfile myfile, teach_admin admin where flag = 1 and myfile.uploader_id = admin.id order by myfile.upload_time desc")
    */
    //获取所有公开文件
    @SelectProvider(type = MyFileProvider.class, method = "getOpenQuerySql")
    public List<Map> getOpenFile(@Param("condition") Map<String, String> param);

    //根据文件ID获取名字
    @Select("select name from teach_myfile where id = #{id}")
    public String getFileNameById(String id);
    //根据文件ID获取存储路径
    @Select("select route from teach_myfile where id = #{id}")
    public String getPathById(String id);

    //获取上传者
    @Select("select id, name from teach_admin order by id")
    public List<Map> getUploaderList();
}
