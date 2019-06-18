package com.oj.controller.system;

import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.service.system.RankingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by panqihang on 2019/5/5 16:21
 */
@Controller
@RequestMapping("/ranking")
public class RankingController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RankingService rankingService;
    //返回排行榜页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "ranking";
    }

    //返回全部排行榜信息
    @RequestMapping("/getRankingMaplist")
    @ResponseBody
    public String getRankingMaplist(Model model, HttpServletRequest request) {
        String draw = request.getParameter("draw");
        String start = request.getParameter("start");
        String count = request.getParameter("length");
        JqueryDataTableDto jqueryDataTableDto = rankingService.getRankingMaplist(start, count);
        return net.sf.json.JSONObject.fromObject(jqueryDataTableDto).toString();
    }

    //返回三个月内排行榜信息
    @RequestMapping("/getRankingMaplist1")
    @ResponseBody
    public String getRankingMaplist1(Model model, HttpServletRequest request) {
        String draw = request.getParameter("draw");
        String start = request.getParameter("start");
        String count = request.getParameter("length");
        JqueryDataTableDto jqueryDataTableDto = rankingService.getRankingMaplist1(start, count);
        return net.sf.json.JSONObject.fromObject(jqueryDataTableDto).toString();
    }

    //返回学生排行详情
    @RequestMapping("/getStudent")
    @ResponseBody
    public Map getStudent(Model model, HttpServletRequest request)
    {
        String account = request.getParameter("account");
        String user_id = request.getSession().getAttribute("user_id").toString();
        return rankingService.getStudent(account, user_id);
    }
}
