package com.oj.controller.discussion;

import com.oj.service.discussion.BbsService;
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
@RequestMapping("/discussion")
public class BbsController {
    private Logger log = LoggerFactory.getLogger(this.getClass());


    @Autowired
    private BbsService BbsService;
    //返回主题管理页面
    @RequestMapping("/")
    public String index() {
        return "discussion/bbs";
    }
    //通过调用接口传递的条件，返回对应的主题信息JsonList
    @PostMapping("/getTopic")
    @ResponseBody
    public Map<String, Object> getTopicMaplist() {
        List<Map> list = BbsService.getTopicMaplist();
        Map<String,Object> topic=new  HashMap<>();
        topic.put("list",list);
        topic.put("sum",BbsService.getTopicSum());
        return topic;
    }
    @PostMapping("/getPostFlagList")
    @ResponseBody
    public List<Map> getPostFlagMaplist(){
        return BbsService.getPostFlagMaplist();
    }

    //增加一条新的帖子
    @PostMapping("/addPost")
    @ResponseBody
    public boolean addPost(@RequestBody Map<String, Object> param,HttpServletRequest request){

        param.put("user_id",request.getSession().getAttribute("user_id").toString());
         BbsService.addPost(param);
         return true;
    }

    //返回指定话题下的文章列表
    @RequestMapping("/showpostinfo/{id}")
    public String showpostinfo(@PathVariable String id, Model model){
        Map<String, Object> info = new HashMap<>();
        List<Map> list=BbsService.getPostList(id);
        info.put("topicId",id);
        info.put("postList",list);
        model.addAttribute("info", info);
        return "discussion/postList";
    }
    //返回文章信息
    @RequestMapping("/showarticle/{id}/{name}/{sub_id}")
    public String showarticle(@PathVariable String id,@PathVariable String name,@PathVariable String sub_id, Model model,HttpServletRequest request){
        Map<String, Object> info = new HashMap<>();
        Map<String,Object> param=new HashMap<>();
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        param.put("post_id",id);
        info.put("post_id",id);
        if(BbsService.selectpostzan(param)>=1){
            info.put("zan","已赞");
        }else{
            info.put("zan","点赞");
        }
        info.put("name",name);
        info.put("replylist",getreplyMaplist(id));
        info.put("post",BbsService.getPostbyId(id));
        BbsService.updatetopicview(sub_id);
        model.addAttribute("info",info);
        return "discussion/article";
    }

    //返回文章下一级回复信息
    public List<Map> getreplyMaplist(String pid){
       return  BbsService.getreplyMaplist(pid);

    }
    //返回文章下某一级别下的回复信息
    @PostMapping("/replysoninfo")
    @ResponseBody
    public List<Map> repltsoninfo(@RequestBody Map<String, Object> param){
          String level=param.get("level").toString();
          return BbsService.repliysonlist(level);
    }
    //增加一条回复
    @PostMapping("/addreply")
    @ResponseBody
    public boolean addreply(@RequestBody Map<String, Object> param,HttpServletRequest request){
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        param.put("user_name",request.getSession().getAttribute("user_name").toString());
        BbsService.addreply(param);
        return true;
    }
    //增加子回复
    @PostMapping("/addreplyson")
    @ResponseBody
    public boolean addreplyson(@RequestBody Map<String, Object> param,HttpServletRequest request){
        System.out.println(param);
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        param.put("user_name",request.getSession().getAttribute("user_name").toString());
        BbsService.addreplyson(param);
        return true;
    }
    //对帖子进行点赞
    @PostMapping("/postzan")
    @ResponseBody
    public int postzan(@RequestBody Map<String, Object> param,HttpServletRequest request){
        param.put("user_id",request.getSession().getAttribute("user_id").toString());
        System.out.println(param);
        if(BbsService.selectpostzan(param)>=1){
           BbsService.deletepostzan(param);
           return 1;
        }else{
            BbsService.insertpostzan(param);
            return 0;
        }


    }
    //对评论进行点赞
    @PostMapping("/replyzan")
    @ResponseBody
    public boolean replyzan(@RequestBody Map<String, Object> param){
        BbsService.updatereplyzan(param.get("id").toString());
        return true;
    }
}
