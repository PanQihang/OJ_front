package com.oj.controller.exam;

import com.oj.mapper.system.LoginMapper;
import com.oj.service.exam.TestService;
import com.oj.service.system.LoginService;
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
import java.net.InetAddress;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年5月4日 15点48分
 * @Description
 */

@Controller
@RequestMapping("/exam")
public class ExamController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TestService testService;
    @Autowired
    private LoginService loginService;

    //返回考试列表页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "exam/exper";
    }

    //返回实验详情页面
    @RequestMapping("experDetail")
    public String experDetail(HttpServletRequest request) {
        return "exam/experDetail";
    }

    //返回题目详情页面
    @RequestMapping("/problemDetails")
    public String problemDetails( HttpServletRequest request) {
        return "exam/problemDetails";
    }

    //通过学生所在班级获取全部考试信息接口
    @PostMapping("/getAllExam")
    @ResponseBody
    public List<Map> getAllExper(HttpServletRequest request){
        String cid = request.getSession().getAttribute("user_class").toString();
        String sid = request.getSession().getAttribute("user_id").toString();
        Map<String, String> map = new HashMap<String, String>();
        String localip = request.getRemoteAddr();
        map.put("userIp",localip);
       // System.out.println(localip);
        List<Map> test = testService.getExamMaplist(cid,sid);
        test.add(map);
        return test;
    }

    //将初次登陆考试的ip进行记录
    @PostMapping("/recordIP")
    @ResponseBody
    public Map<String, String> recordIP(HttpServletRequest request){
        String sid = request.getSession().getAttribute("user_id").toString();
        String tid = request.getParameter("tid");
        String first_ip = request.getRemoteAddr();
        Map<String, String> map = new HashMap<>();
        try {
            testService.saveIP(tid,sid,first_ip);
            map.put("flag", "1");
            return map;
        }catch (Exception e){
            map.put("flag", "0");
            log.error(e.getMessage());
            return map;
        }
    }

    //获取可参与考试的ip段
    @PostMapping("/getTestIp")
    @ResponseBody
    List<Map> getTestIp(HttpServletRequest request){
        return testService.getTestIp(request.getParameter("tid"));
    }

    //获取可参与考试的班级
    @PostMapping("/getTestClass")
    @ResponseBody
    List<Map>   getTestClass(HttpServletRequest request){//,@RequestBody Map<String, String> loginInfo){
        String cid = request.getSession().getAttribute("user_class").toString();
        //System.out.println(cid);
//        String cid = "";
//        List<Map<String, String>> userList = loginService.getUserByLoginInfo(loginInfo);
//        //通过用户登录名和密码查询数据库看是否有该用户
//        if (userList.size()==1)
//           cid = userList.get(0).get("class_id");
        Map<String, String> map = new HashMap<String, String>();
        map.put("class_id", cid);
        List<Map> test = testService.getTestClass();
        test.add(map);
        System.out.println(test.contains(map));
        return test;
    }

    //获取正在参与考试的学生与ip
    @PostMapping("/getTestIps")
    @ResponseBody
    List<Map>   getTestIps(HttpServletRequest request) {
        String sid = request.getSession().getAttribute("user_id").toString();
        Map<String, String> map = new HashMap<String, String>();
        //Map<String, String> newMap = new HashMap<String, String>();

        map.put("sid", sid);
        String localip = request.getRemoteAddr();
        map.put("first_ip",localip);
        List<Map> test = testService.getTestIps();
        test.add(map);
        //System.out.println(localip);
        return test;
    }

    //获取正在参与考试的学生与ip
    @PostMapping("/getTestEndTime")
    @ResponseBody
    List<Map>   getTestEndTime() {
        List<Map> test = testService.getTestEndTime();
        return test;
    }
}
