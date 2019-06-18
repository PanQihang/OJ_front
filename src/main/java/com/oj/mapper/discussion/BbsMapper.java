package com.oj.mapper.discussion;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface BbsMapper  {
    //获取全部主题列表
    @Select("SELECT * FROM teach_bbs_topic")
    public List<Map> getTopicMaplist();
    //
    @Select("SELECT sum(sum) FROM teach_bbs_topic")
    public String getTopicSum();
    //获取全部置顶帖子
    @Select("select a.id,a.user_id,a.sub_id,a.title,a.content,a.reply_num,a.zan_num,a.view_num,FROM_UNIXTIME(creat_time) as time,identity,b.name as topic_name\n" +
            "from teach_bbs_post as a,teach_bbs_topic as b\n" +
            "where flag=1\n" +
            "and a.sub_id=b.id ORDER BY creat_time desc")
    public List<Map> getPostFlagMaplist();

    //增加一条帖子
    @Select("INSERT INTO teach_bbs_post(id,sub_id,title,content,user_id,creat_time,identity) VALUES (NULL,#{topicId},#{title},#{content},#{user_id},unix_timestamp(now()),0)")
    public void addPost(Map<String, Object> param);

    //更新主题中帖子总数
    @Select("update teach_bbs_topic set sum=sum+1 where id=#{id}")
    public void updatetopicsum(String id);
    //文章列表
    @Select("select id,sub_id,user_id,title,content,reply_num,zan_num,view_num,FROM_UNIXTIME(creat_time) as time,identity\n" +
            "from teach_bbs_post where sub_id=#{id} ORDER BY creat_time desc")
    public List<Map> getPostList(String id);

    //获取作者内容
    @Select("select name from teach_admin where id=#{id}")
    public String getadminname(String id);

    @Select("select name from teach_students where id=#{id}")
    public String getstudentname(String id);
    //通过id获得指定的文章信息
    @Select("select id,user_id,title,content,reply_num,zan_num,view_num,FROM_UNIXTIME(creat_time) as time from teach_bbs_post where id=#{id}")
    public Map<String,String> getPostbyId(String id);

    //获取文章下一级回复
    @Select("select id,user_id,content,sum,zannum,FROM_UNIXTIME(reply_time) as time,admin,name,level from teach_bbs_reply where post_id=#{post_id} and p_id=0")
    public List<Map> getreplyMaplist(String post_id);

    //返回文章下某一级别下的回复信息
    @Select("select a.id,a.user_id,a.content,a.sum,a.zannum,FROM_UNIXTIME(a.reply_time) as time,a.admin,a.name,a.level,b.name as replyedname \n" +
            "from teach_bbs_reply a,teach_bbs_reply b\n" +
            "where a.level=#{level}\n" +
            "and a.p_id=b.id order by a.reply_time ")
    public List<Map> repliysonlist(String level);
    //增加一条一级回复
    @Select("insert into teach_bbs_reply(id,user_id,content,post_id,p_id,reply_time,admin,name) values(NULL,#{user_id},#{content},#{post_id},0,unix_timestamp(now()),0,#{user_name})")
    public void addreply(Map<String, Object> param);

    //更新帖子的评论数
    @Select("update teach_bbs_post set reply_num=reply_num+1 where id=#{post_id}")
    public void updatereplynum(String post_id);

    //增加一条子评论
    @Select("insert into teach_bbs_reply(id,user_id,content,post_id,p_id,reply_time,level,name,admin) values(NULL,#{user_id},#{content},#{post_id},#{pid},unix_timestamp(now()),#{level},#{user_name},0)")
    public void addreplyson(Map<String, Object> param);

    //更新回复的评论数
    @Select("update teach_bbs_reply set sum=sum+1 where id=#{reply_id}")
    public void updatereplyreplynum(String reply_id);

    //更新帖子赞数
    @Select("update teach_bbs_post set zan_num=zan_num+1 where id=#{post_id}")
    public void addpostzannum(String post_id);
    @Select("update teach_bbs_post set zan_num=zan_num-1 where id=#{post_id}")
    public void deletepostzannum(String post_id);

    //查询学生赞的帖子
    @Select("select count(1) from teach_bbs_post_zan where user_id=#{user_id} and post_id=#{post_id} and admin=0")
    public int selectpostzanlist(Map<String, Object> param);

    //增加一条post赞
    @Select("INSERT INTO teach_bbs_post_zan(id,user_id,post_id,admin) values(NULL,#{user_id},#{post_id},0)")
    public void insertpostzan(Map<String, Object> param);

    //减少一条post赞
    @Select("delete  from teach_bbs_post_zan where user_id=#{user_id} and post_id=#{post_id} and admin=0")
    public void deletepostzan(Map<String, Object> param);
    //增加一条评论赞
    @Select("update teach_bbs_reply set zannum=zannum+1 where id=#{id}")
    public void updatereplyzan(String id);
    //增加浏览数
    @Select("update teach_bbs_post set view_num=view_num+1 where id=#{id}")
    public void updatepostview(String id);
    //更新话题的浏览数
    @Select("update teach_bbs_topic set view=view+1 where id=#{id}")
    public void updatetopicview(String id);

}
