package com.oj.entity.exam;

/**
 * @author zhouli
 * @Time 2019年4月30日 17点18分
 * @Description 数据库里teach_test实体类
 */
public class Exam {
    //编号
    private String id;
    //名称
    private String name;
    //开始时间
    private String start;
    //结束时间
    private String end;
    //描述
    private String description;
    //分类
    private String kind;
    //限定机房
    private String is_ip;
    //限定多机登陆
    private String only_ip;
    //作者ID
    private String admin_id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getIs_ip() {
        return is_ip;
    }

    public void setIs_ip(String is_ip) {
        this.is_ip = is_ip;
    }

    public String getOnly_ip() {
        return only_ip;
    }

    public void setOnly_ip(String only_ip) {
        this.only_ip = only_ip;
    }

    public String getAdmin_id() {
        return admin_id;
    }

    public void setAdmin_id(String admin_id) {
        this.admin_id = admin_id;
    }
}
