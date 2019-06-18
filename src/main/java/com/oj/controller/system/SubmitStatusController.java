package com.oj.controller.system;

import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.service.system.SubmitStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by panqihang on 2019/5/6 11:53
 */
@Controller
@RequestMapping("/submitStatus")
public class SubmitStatusController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SubmitStatusService submitstatusService;
    //返回提交状态页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "submitStatus";
    }

    @RequestMapping("/getSubmitStatusMaplist")
    @ResponseBody
    public String getSubmitStatusMaplist(Model model, HttpServletRequest request) {
        String draw = request.getParameter("draw");
        String start = request.getParameter("start");
        String count = request.getParameter("length");
        String problem_id = request.getParameter("problem_id");
        String account = request.getSession().getAttribute("user_account").toString();
        String user_id = request.getSession().getAttribute("user_id").toString();
        String submit_state = request.getParameter("submit_state");
        String submit_language = request.getParameter("submit_language");
        JqueryDataTableDto jqueryDataTableDto = submitstatusService.getSubmitStatusMaplist(start, count, problem_id, account, submit_state, user_id, submit_language);
        return net.sf.json.JSONObject.fromObject(jqueryDataTableDto).toString();
    }
}
