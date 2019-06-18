package com.oj.controller.system;

import com.oj.entity.system.User;
import com.oj.service.system.UserService;
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
 * @Time 2019年3月9日 15点21分
 * @Description Demo类
 */

//向框架中注册Controlle

@Controller
@RequestMapping("/userMn")
public class UserController {

    private Logger log = LoggerFactory.getLogger(this.getClass());
    //依赖注入UserService
    @Autowired
    private UserService userService;

    @RequestMapping("/")
    //返回demo.html页面
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "system/user";
    }


    @PostMapping("/getUserMapList")
    @ResponseBody
    //通过调用接口传递的条件，返回对应的用户信息JsonList
    public List<Map> getUserMapList(@RequestBody Map<String, String> param, HttpServletRequest request) {
        List<Map> list = userService.getUserMapList(param);
        return list;
    }

    @PostMapping("/getRoleSelectInfo")
    @ResponseBody
    //获取角色下拉信息
    public List<Map> getRoleSelectInfo(){
        List<Map> list = userService.getRoleSelectInfo();
        return list;
    }

    @PostMapping("/saveOrUpdateUser")
    @ResponseBody
    public Map<String, String> saveOrUpdateUser(@RequestBody User user){
        Map<String, String> map = new HashMap<>();
        try {
            userService.saveOrUpdateUser(user);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            map.put("message", e.getMessage());
            log.error(e.getMessage());
            return map;
        }
    }
    @PostMapping("/userDelete")
    @ResponseBody
    public Map<String, String> userDelete(HttpServletRequest request){
        Map<String, String> map = new HashMap<>();
        try {
            userService.userDelete(request.getParameter("id"));
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }
    @PostMapping("/getCourseList")
    @ResponseBody
    public List<Map> getCourseList(HttpServletRequest request){
        return userService.getCourseList(request.getParameter("id"));
    }

    @PostMapping("/saveCourseList")
    @ResponseBody
    public Map<String, String> saveCourseList(@RequestBody Map<String, Object> param){
        Map<String, String> map = new HashMap<>();
        try {
            userService.saveCourseList(param);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

}
