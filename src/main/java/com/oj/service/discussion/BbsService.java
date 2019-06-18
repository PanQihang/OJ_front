package com.oj.service.discussion;

import java.util.List;
import java.util.Map;

public interface BbsService {
    //获取主题信息列表
    public List<Map> getTopicMaplist();
    //帖子总数
    public String getTopicSum();
   //获取顶置post列表
    public List<Map> getPostFlagMaplist();

    //增加一条post
    public void addPost(Map<String, Object> param);
   //通过话题id获得文章列表
    public List<Map> getPostList(String id);
    //通过id获得指定的文章信息
    public Map<String,String> getPostbyId(String id);

    //返回文章下回复信息
    public List<Map> getreplyMaplist(String pid);
    // //返回文章下某一级别下的回复信息
    public List<Map> repliysonlist(String level);
    //增加一条回复
    public void addreply(Map<String, Object> param);
    //增加一条子回复
    public void addreplyson(Map<String, Object> param);


    //查询是否对帖子点赞
    public int selectpostzan(Map<String, Object> param);

    public void deletepostzan(Map<String, Object> param);

    public void insertpostzan(Map<String, Object> param);

    //评论点赞
    public void updatereplyzan(String id);

    //
    public void updatetopicview(String sub_id);

}
