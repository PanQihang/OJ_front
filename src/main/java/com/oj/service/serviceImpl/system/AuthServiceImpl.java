package com.oj.service.serviceImpl.system;

import com.oj.entity.system.Auth;
import com.oj.mapper.system.AuthMapper;
import com.oj.service.system.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月17日 11点16分
 * @Description 权限功能相关功能Service接口
 */
@Service
public class AuthServiceImpl implements AuthService {
    @Autowired(required = false)
    private AuthMapper mapper;

    /**
     * 通过roleID获取当前用户的权限的功能接口实现
     * @param roleId
     * @return 当前权限下的前端功能HTML语句
     */
    @Override
    public String getAuthListByRole(String roleId) {
        //调用查询条件的Mapper接口方法
        List<Map<String, String>> authList = mapper.getAuthListByRole(roleId);
        return drawLeftPage(authList);
    }

    /**
     * 绘制前端权限功能的HTML语句
     * @param authList
     * @return
     */
    private String drawLeftPage(List<Map<String, String>> authList){
        StringBuffer leftHtml = new StringBuffer();
        for (Map<String, String> auth: authList){
            //若"auth_parent"字段为空代表为父权限
            if (null == auth.get("auth_parent")){
                leftHtml.append("<li class=''><a href='#'><i class='"+auth.get("auth_ico")+"'></i>");
                leftHtml.append("<span class='nav-label'>"+auth.get("auth_name")+"</span><span class='fa arrow'></span></a>");
                leftHtml.append("<ul class='nav nav-second-level collapse' aria-expanded='false' style='height: 0px;'>");
                for (Map<String, String> authForChild : authList) {
                    //若权限数据中有auth_parent键值，且键值与父权限对应，为子权限
                    if(null != authForChild.get("auth_parent")){
                        if (auth.get("id") == authForChild.get("auth_parent")){
                            leftHtml.append("<li><a class='J_menuItem' href='"+authForChild.get("auth_url")+"'><i class='"+authForChild.get("auth_ico")+"'></i>"+authForChild.get("auth_name")+"</a></li>");
                        }
                    }
                }
                leftHtml.append("</ul></li>");
            }
        }
        return leftHtml.toString();
    }

    /**
     * 获取权限信息列表接口功能实现
     * @return
     */
    @Override
    public List<Map> getAuthMaplist() {
        return mapper.getAuthMaplist();
    }

    /**
     * 保存权限信息接口功能实现
     * @param auth
     */
    @Transactional
    @Override
    public void authSave(Auth auth) {
        //若"auth_parent"字段为""则将其置为空防止错误
        if ("".equals(auth.getAuth_parent())){
            auth.setAuth_parent(null);
        }
        //保存新权限
        mapper.authSave(auth);
        //新权限成功保存后将新权限绑定给超级管理员
        mapper.roleAuthSave(auth.getId());
    }

    /**
     * 权限更新接口功能实现
     * @param auth
     */
    @Override
    public void authUpdate(Auth auth) {
        mapper.authUpdate(auth);
    }

    /**
     * 通过id获取权限信息接口功能实现
     * @param id
     * @return
     */
    @Override
    public Map getAuthById(String id) {
        return mapper.getAuthById(id).get(0);
    }

    /**
     * 权限删除接口功能实现
     * @param id
     */
    @Transactional
    @Override
    public void authDelete(String id) {
        List<String> authIdList = new ArrayList<>();
        authIdList.add(id);
        //获取当前权限和子权限的Id列表
        authIdList.addAll(mapper.getChildAuthIds(id));
        for (String authId : authIdList){
            //通过权限Id解除改权限与角色的绑定
            mapper.authRoleDelete(authId);
            //通过权限Id删除权限
            mapper.authDelete(authId);
        }
    }

    /**
     * 获取权限Id列表接口功能实现
     * @param id
     * @return
     */
    @Override
    public List<String> getAuthIds(String id) {
        return mapper.getAuthIds(id);
    }
}
