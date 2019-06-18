package com.oj.controller.system;

import com.oj.frameUtil.LogUtil;
import com.oj.mapper.system.AuthMapper;
import com.oj.service.system.AuthService;
import com.oj.service.system.LoginService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年3月13日 15点53分
 * @Description 登入登出控制类
 */
    @Controller
public class LoginController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    LoginService loginService;
    @Autowired
    AuthService authService;

    @RequestMapping("/login/")
    //返回login.html页面
    public String login(HttpServletRequest request) {
        return "login";
    }

    //用户登陆验证方法
    @PostMapping("/login/UserLogin")
    @ResponseBody
    public boolean userLogin(@RequestBody Map<String, String> loginInfo, HttpServletRequest request){
        List<Map<String, String>> userList = loginService.getUserByLoginInfo(loginInfo);
        //通过用户登录名和密码查询数据库看是否有该用户
        if (userList.size()==1){
            request.getSession().setAttribute("user_id",userList.get(0).get("id"));
            request.getSession().setAttribute("user_name",userList.get(0).get("name"));
            request.getSession().setAttribute("user_account",userList.get(0).get("account"));
            request.getSession().setAttribute("user_class", userList.get(0).get("class_id"));
            request.getSession().setAttribute("user_class_name", userList.get(0).get("class_name"));
            log.info("IP为："+LogUtil.getIpAddr(request) +",用户登录名为："+userList.get(0).get("account")+"的用户登入成功");
            return true;
        }else{
            return false;
        }
    }

    //用户注销功能
    @RequestMapping("/login/Logout")
    public void loginLogout(HttpServletRequest request, HttpServletResponse response)throws Exception{
        //进入用户注销功能后清除session中的用户信息
        String user_account = request.getSession().getAttribute("user_account").toString();
        request.getSession().setAttribute("user_id",null);
        request.getSession().setAttribute("user_name",null);
        request.getSession().setAttribute("user_account",null);
        request.getSession().setAttribute("user_class",null);
        request.getSession().setAttribute("user_class_name",null);
        response.sendRedirect("/");
        log.info("IP为："+LogUtil.getIpAddr(request) +",用户登录名为："+user_account+"的用户登出成功");
    }

    @RequestMapping("/index")
    //返回index.html页面
    public String index(HttpServletRequest request) {
        return "index";
    }
    @RequestMapping("/help")
    //返回index.html页面
    public String help(HttpServletRequest request) {
        return "help";
    }

    //重置密码功能
    @PostMapping("/resetPassword")
    @ResponseBody
    public boolean resetPassword(HttpServletRequest request){
        String newPassword = request.getParameter("newPassword");
        String id = StringUtils.isEmpty(request.getParameter("id"))?request.getSession().getAttribute("user_id").toString():request.getParameter("id");
        try {
            //通过请求中的新密码并结合session中的用户ID对用户密码进行更新
            loginService.resetPassword(id, newPassword);
            return true;
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
    }
    //重置密码功能
    @PostMapping("/login/checkLogin")
    @ResponseBody
    public boolean checkLogin(HttpServletRequest request){
        if(StringUtils.isEmpty(request.getSession().getAttribute("user_name"))){
            return false;
        }else{
            return true;
        }
    }

}
