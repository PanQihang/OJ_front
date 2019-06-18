package com.oj.controller.exam;

import com.oj.service.exam.TestService;
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
import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年4月30日 15点48分
 * @Description 实验controller类
 */

@Controller
@RequestMapping("/experiment")
public class ExperController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TestService testService;

    //返回实验列表页面
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

    //通过学生所在班级获取全部实验信息接口
    @PostMapping("/getAllExper")
    @ResponseBody
    public List<Map> getAllExper(HttpServletRequest request){
        String account = request.getSession().getAttribute("user_class").toString();
        return testService.getExperMaplist(account);
    }

    //通过实验id和学生学号获取实验成绩
    @PostMapping("/getSubmitState")
    @ResponseBody
    public List<Map> getSubmitState(@RequestBody Map<String, String> param, HttpServletRequest request){
        List<Map> list =  testService.getSubmitState(request.getSession().getAttribute("user_id").toString(),param);
        return list;
    }

    //获取一条实验或考试的详细信息
    @PostMapping("/getTestDetail")
    @ResponseBody
    public List<Map> getTestDetail(HttpServletRequest request){
        List<Map> list =  testService.getTestDetail(request.getParameter("tid"));
        return list;
    }

    @PostMapping("getProblemDetails")
    @ResponseBody
    public List<Map> getProblemDetails(HttpServletRequest request){
        List<Map> p = testService.getProblemDetails(request.getParameter("id"));
        return p;
    }

//    //获取提交状态分类
//    @PostMapping("getSubmitType")
//    @ResponseBody
//    public List<Map> getSubmitType(HttpServletRequest request){
//        List<Map> p = testService.getSubmitType();
//        return p;
//    }

}
