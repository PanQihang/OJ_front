package com.oj.entity.system;
/**
 * @author lixu
 * @Time 2019年3月9日 15点21分
 * @Description 对应数据库中用户表实体类
 */
public class User {

    //用户id
    private String id;
    //用户登录名
    private String account;
    //用户密码
    private String password;
    //用户姓名
    private String name;
    //用户角色
    private String role;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
