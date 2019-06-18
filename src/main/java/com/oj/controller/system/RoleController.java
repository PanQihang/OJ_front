package com.oj.controller.system;

import com.oj.entity.system.Role;
import com.oj.service.system.AuthService;
import com.oj.service.system.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月17日 10点47分
 * @Description 角色controller类
 */
@Controller
@RequestMapping("/roleMn")
public class RoleController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RoleService roleService;

    @Autowired
    private AuthService authService;

    //返回角色管理页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "system/roleInfo";
    }

    //通过参数返回对应角色列表接口
    @RequestMapping("/getRoleMapList")
    @ResponseBody
    public List<Map> getRoleMapList(@RequestBody Role role) {
        return roleService.getRoleMapList(role);
    }

    //角色删除接口
    @PostMapping("/roleDelete")
    @ResponseBody
    public Map<String, String> roleDelete(HttpServletRequest request){
        Map<String, String> map = new HashMap<>();
        try {
            roleService.roleDelete(request.getParameter("id").toString());
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

    //通过ID获取角色信息接口
    @PostMapping("/getRoleById")
    @ResponseBody
    public Map getRoleById(HttpServletRequest request){
        return roleService.getRoleById(request.getParameter("id").toString());
    }

    //获取最新角色Code接口
    @PostMapping("/getcode")
    @ResponseBody
    public String getcode(){
        return roleService.getcode();
    }

    //角色更新或添加接口
    @PostMapping("/roleSaveOrUpdate")
    @ResponseBody
    public Map<String, String> roleSaveOrUpdate(@RequestBody Role role){
        Map<String, String> map = new HashMap<>();
        try {
            roleService.roleSaveOrUpdate(role);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

    //获取权限列表接口
    @PostMapping("/authQuery")
    @ResponseBody
    public Map<String, Object> authQuery(HttpServletRequest request){
        Map<String, Object> map = new HashMap<>();
        map.put("auths", authService.getAuthMaplist());
        map.put("role_auth_ids", authService.getAuthIds(request.getParameter("id")));
        return map;
    }

    //保存角色配置权限接口
    @PostMapping("/roleAuthSave")
    @ResponseBody
    public Map<String, String> roleAuthSave(HttpServletRequest request){
        Map<String, String> map = new HashMap<>();
        String role_id = request.getParameter("role_id");
        String postData = request.getParameter("postData");
        try {
            roleService.roleAuthSave(role_id, postData);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }
}
