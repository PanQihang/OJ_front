package com.oj.controller.competition;
import com.oj.service.competition.CompetitionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/competition")
public class CompetitionController {
    private Logger log = LoggerFactory.getLogger(this.getClass());


    @Autowired
    private CompetitionService competitionService;
    //返回主题管理页面
    @RequestMapping("/")
    public String index() {
        return "competition/competition";
    }

    //返回全部竞赛信息
    @PostMapping("/getComp")
    @ResponseBody
    public Map<String, Object> getCompMaplist() {
        List<Map> list = competitionService.getCompMaplist();
        Map<String,Object> topic=new  HashMap<>();
        topic.put("list",list);
        topic.put("sum",competitionService.getCompSum());
        return topic;
    }
    //返回未开始的一条竞赛信息
    @PostMapping("/getAComp")
    @ResponseBody
    public List<Map> getAComplist() {



        return competitionService.getACompMaplist();
    }

    //排名信息
    @PostMapping("/getrankList")
    @ResponseBody
    public List<Map> getrankList() {

        return competitionService.getrankList();
    }

    @RequestMapping("/showmorerank")
    public String showmorerank(Model model) {
        Map<String, Object> info = new HashMap<>();
        info.put("rank",competitionService.showmorerank());
        model.addAttribute("info", info);
        return "competition/showrank";
    }

    @RequestMapping("/showComp/{id}")
    public String showComp(@PathVariable String id, Model model) {
        Map<String, Object> info = new HashMap<>();
        info.put("compinfo",competitionService.showComp(id));
        info.put("proList",competitionService.Compro(id));
        model.addAttribute("info", info);
        return "competition/showComp";
    }
    //提交状态信息
    @PostMapping("/submitStatus")
    @ResponseBody
    public List<Map> submitStatus(@RequestBody Map<String, Object> param,HttpServletRequest request) {
          param.put("user_id",request.getSession().getAttribute("user_id").toString());
        return competitionService.submitStatus(param);
    }
    @PostMapping("/rankListbyId")
    @ResponseBody
    public List<Map> rankListbyId(@RequestBody Map<String, Object> param) {

        return competitionService.rankListbyID(param.get("id").toString());
    }
    //是否报名
    @PostMapping("/Isenroll")
    @ResponseBody
    public int Isenroll(@RequestBody Map<String,String> param,HttpServletRequest request) {
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        return competitionService.Isenroll(param);
    }
    //报名
    @PostMapping("/enroll")
    @ResponseBody
    public boolean enroll(@RequestBody Map<String,String> param,HttpServletRequest request) {
        System.out.println(param);
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        return competitionService.enroll(param);
    }
    //取消报名
    @PostMapping("/deleteenroll")
    @ResponseBody
    public boolean deleteenroll(@RequestBody Map<String,String> param,HttpServletRequest request) {
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        return competitionService.deleteenroll(param);
    }
    //报名表
    @PostMapping("/enrollList")
    @ResponseBody
    public List<Map> enrollList(@RequestBody Map<String,String> param) {

        return competitionService.enrollList(param.get("test_id"));
    }
    @PostMapping("/invComp")
    @ResponseBody
    public String invComp(HttpServletRequest request,@RequestBody Map<String,String> param) {
        String id = request.getSession().getAttribute("user_id").toString();
        param.put("user_id", id);
        System.out.println(competitionService.RandComp(param));
        return competitionService.RandComp(param);

    }
    @PostMapping("/CompedList")
    @ResponseBody
    public List<Map> CompedList(HttpServletRequest request) {
        String id = request.getSession().getAttribute("user_id").toString();

        return competitionService.CompedList(id);

    }
}
