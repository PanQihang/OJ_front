package com.oj.service.system;

import com.oj.entity.system.Auth;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月17日 11点16分
 * @Description 权限功能相关功能Service接口
 */
public interface AuthService {
    //通过roleID获取当前用户的权限
    public String getAuthListByRole(String roleId);

    //获取权限信息列表
    public List<Map> getAuthMaplist();

    //保存权限信息
    public void authSave(Auth auth);

    //权限更新
    public void authUpdate(Auth auth);

    //通过id获取权限信息
    public Map getAuthById(String id);

    //权限删除
    public void authDelete(String id);

    //获取权限Id列表
    public List<String> getAuthIds(String id);
}
