package com.oj.controller.system;

import com.oj.entity.system.Auth;
import com.oj.service.system.AuthService;
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
 * @Description 权限controller类
 */

@Controller
@RequestMapping("/authMn")
public class AuthController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AuthService authService;

    //返回权限管理页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "system/auth";
    }

    //通过调用接口传递的条件，返回对应的权限信息JsonList
    @PostMapping("/getAuthMaplist")
    @ResponseBody
    public List<Map> getAuthMaplist() {
        List<Map> list = authService.getAuthMaplist();
        return list;
    }

    //权限信息保存接口
    @PostMapping("/authSave")
    @ResponseBody
    public Map<String, String> authSave(@RequestBody Auth auth) {
        Map<String, String> map = new HashMap<>();
        try {
            authService.authSave(auth);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

    //权限信息更新接口
    @PostMapping("/authUpdate")
    @ResponseBody
    public Map<String, String> authUpdate(@RequestBody Auth auth) {
        Map<String, String> map = new HashMap<>();
        try {
            authService.authUpdate(auth);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

    //通过权限ID查找权限信息接口
    @PostMapping("/getAuthById")
    @ResponseBody
    public Map getAuthById(HttpServletRequest request){
        return authService.getAuthById(request.getParameter("id").toString());
    }

    //权限删除接口
    @PostMapping("/authDelete")
    @ResponseBody
    public Map<String, String> authDelete(HttpServletRequest request){
        Map<String, String> map = new HashMap<>();
        try {
            authService.authDelete(request.getParameter("id").toString());
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

}
