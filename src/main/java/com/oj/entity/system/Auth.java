package com.oj.entity.system;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 对应数据库中权限表实体类
 */
public class Auth {
    //功能ID
    private String id;
    //功能编码
    private String auth_code;
    //功能名称
    private String auth_name;
    //功能地址
    private String auth_url;
    //功能图标
    private String auth_ico;
    //父级功能id
    private String auth_parent;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuth_code() {
        return auth_code;
    }

    public void setAuth_code(String auth_code) {
        this.auth_code = auth_code;
    }

    public String getAuth_name() {
        return auth_name;
    }

    public void setAuth_name(String auth_name) {
        this.auth_name = auth_name;
    }

    public String getAuth_url() {
        return auth_url;
    }

    public void setAuth_url(String auth_url) {
        this.auth_url = auth_url;
    }

    public String getAuth_ico() {
        return auth_ico;
    }

    public void setAuth_ico(String auth_ico) {
        this.auth_ico = auth_ico;
    }

    public String getAuth_parent() {
        return auth_parent;
    }

    public void setAuth_parent(String auth_parent) {
        this.auth_parent = auth_parent;
    }
}
