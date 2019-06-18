package com.oj.service.serviceImpl.system;

import com.oj.entity.system.Role;
import com.oj.mapper.system.RoleMapper;
import com.oj.service.system.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月17日 11点16分
 * @Description 角色管理相关功能Service接口功能实现类
 */

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired(required = false)
    RoleMapper mapper;

    /**
     * 获取角色信息列表接口功能实现
     * @param role
     * @return
     */
    @Override
    public List<Map> getRoleMapList(Role role) {
        return mapper.getRoleMapList(role);
    }

    /**
     * 通过主键删除角色信息接口功能实现
     * @param id
     */
    @Transactional
    @Override
    public void roleDelete(String id) {
        //首先将带有该权限的用户的角色信息置为空
        mapper.resetUserRole(id);
        //其次将角色对应权限的信息解绑
        mapper.roleAuthDelete(id);
        //最后进行角色信息删除
        mapper.roleDelete(id);
    }

    /**
     * 通过角色Id获取角色信息接口功能实现
     * @param id
     * @return
     */
    @Override
    public Map getRoleById(String id) {
        return mapper.getRoleById(id).get(0);
    }

    /**
     * 获取最新角色Code接口功能实现
     * @return
     */
    @Override
    public String getcode() {
        return mapper.getcode().get(0);
    }

    /**
     * 角色保存或更新接口功能实现
     * @param role
     */
    @Override
    public void roleSaveOrUpdate(Role role) {
        //若角色ID为空进行插入操作，否则进行更新操作
        if(StringUtils.isEmpty(role.getId())){
            mapper.save(role);
        }else {
            mapper.update(role);
        }
    }

    /**
     * 角色对应权限绑定接口功能实现
     * @param role_id
     * @param postData
     */
    @Transactional
    @Override
    public void roleAuthSave(String role_id, String postData) {
        //获取权限Id列表
        postData=postData.replace("[", "");
        postData=postData.replace("]", "");
        String[] authIds = postData.split(",");

        //通过角色ID清空角色的全部权限绑定
        mapper.roleAuthDelete(role_id);
        for (String authId: authIds) {
            //通过最新的参数重新进行角色权限绑定
            mapper.roleAuthSave(authId, role_id);
        }
    }
}
