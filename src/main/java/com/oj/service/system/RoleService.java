package com.oj.service.system;

import com.oj.entity.system.Role;
import java.util.List;
import java.util.Map;
/**
 * @author lixu
 * @Time 2019年3月17日 11点16分
 * @Description 角色管理相关功能Service接口
 */
public interface RoleService {

    //获取角色信息列表
    public List<Map> getRoleMapList(Role role);

    //通过主键删除角色信息
    public void roleDelete(String id);

    //通过角色Id获取角色信息
    public Map getRoleById(String id);

    //获取最新角色Code
    public String getcode();

    //角色保存或更新
    public void roleSaveOrUpdate(Role role);

    //角色对应权限绑定
    public void roleAuthSave(String role_id, String postData);
}
