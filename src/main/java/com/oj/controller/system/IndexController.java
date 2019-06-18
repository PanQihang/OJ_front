package com.oj.controller.system;

import com.oj.entity.system.RankPerDay;
import com.oj.frameUtil.LogUtil;
import com.oj.service.competition.CompetitionService;
import com.oj.service.discussion.BbsService;
import com.oj.service.exam.PracticeService;
import com.oj.service.system.IndexService;
import com.oj.service.system.RankPerDayService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/index")
public class IndexController {
    @Autowired
    private IndexService indexService;

    @Autowired
    private PracticeService service;

    @Autowired
    private RankPerDayService rankPerDayService;

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private com.oj.service.discussion.BbsService BbsService;

    @RequestMapping("/")
    //返回index.html页面
    public String index(HttpServletRequest request, Model model) {
        String userIp = LogUtil.getIpAddr(request);
        model.addAttribute("userIp",userIp);
        return "index";
    }

    @RequestMapping("/pageNotFound")
    //返回index.html页面
    public String pageNotFound(HttpServletRequest request) {
        return "error/404";
    }

    @PostMapping("/getJxtzList")
    @ResponseBody
    public List<Map> getJxtzList(){
        return indexService.getJxtzList();
    }

    @PostMapping("/getJxtzById")
    @ResponseBody
    public Map getJxtzById(HttpServletRequest request){
        String id = request.getParameter("id").toString();
        return indexService.getJxtzById(id);
    }

    @PostMapping("/getReToDo")
    @ResponseBody
    public List<Map> getReToDo(HttpServletRequest request){
         return indexService.getReToDo(request.getSession().getAttribute("user_class").toString(), request.getSession().getAttribute("user_id").toString());
    }

    @PostMapping("/getRecommandList")
    @ResponseBody
    public List<Map> getRecommandList(HttpServletRequest request){
         return indexService.getRecommandList(request.getSession().getAttribute("user_id").toString());
    }
    @PostMapping("/getRankPerDayFromRedis")
    @ResponseBody
    public List<RankPerDay> getRankPerDayFromRedis(){
        List<RankPerDay> rankPerDaysList = new ArrayList<>();
        List<String> userInfoList = rankPerDayService.getRankPerDayFromRedis();
        for(int i = userInfoList.size()-1; i>=0; i--){
            RankPerDay rankPerDay = (RankPerDay)JSONObject.toBean(new JSONObject().fromObject(userInfoList.get(i)),RankPerDay.class);
            rankPerDaysList.add(rankPerDay);
        }
        return rankPerDaysList;
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

    @PostMapping("/getPostFlagList")
    @ResponseBody
    public List<Map> getPostFlagMaplist(){
        return BbsService.getPostFlagMaplist();
    }

    //首页获取最新10道题目的调用
    @PostMapping("/getNewestProblemList")
    @ResponseBody
    public List<Map> getNewestProblemList(){
        return service.getNewestProList();
    }

}
