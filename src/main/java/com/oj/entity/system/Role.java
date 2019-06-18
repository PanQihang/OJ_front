package com.oj.entity.system;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 对应数据库中角色表实体类
 */
public class Role {

    //角色ID
    private String id;
    //角色名称
    private String role_name;
    //角色编码
    private String role_code;
    //角色描述
    private String role_desc;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole_name() {
        return role_name;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    public String getRole_code() {
        return role_code;
    }

    public void setRole_code(String role_code) {
        this.role_code = role_code;
    }

    public String getRole_desc() {
        return role_desc;
    }

    public void setRole_desc(String role_desc) {
        this.role_desc = role_desc;
    }
}
