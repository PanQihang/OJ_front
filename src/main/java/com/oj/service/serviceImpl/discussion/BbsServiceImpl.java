package com.oj.service.serviceImpl.discussion;

import com.oj.mapper.discussion.BbsMapper;
import com.oj.service.discussion.BbsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class BbsServiceImpl implements BbsService{

    @Autowired(required = false)
    private BbsMapper mapper;
    //获取话题列表
    @Override
    public List<Map> getTopicMaplist() {
        List<Map> list = mapper.getTopicMaplist();
        return list;
    }
    @Override
    public String getTopicSum() {
        String sum = mapper.getTopicSum();
        return sum;
    }
    //获得顶置热帖
    @Transactional
    @Override
    public List<Map> getPostFlagMaplist() {
        List<Map> list=mapper.getPostFlagMaplist();
        int i=0;
        String name="";
        for(i=0;i<list.size();i++){
            if(list.get(i).get("identity").toString().equals("1")){
                name=mapper.getadminname(list.get(i).get("user_id").toString());
            }else{
                name=mapper.getstudentname(list.get(i).get("user_id").toString());
            }
            list.get(i).put("name",name);
        }
        return list;
    }
    //发布帖子
    @Override
    public void addPost(Map<String, Object> param) {

       mapper.addPost(param);
       mapper.updatetopicsum(param.get("topicId").toString());
    }
    //获取文章列表
    @Override
    public List<Map> getPostList(String id) {
        List<Map> list=mapper.getPostList(id);
        int i=0;
        String name="";
        for(i=0;i<list.size();i++){
            if(list.get(i).get("identity").toString().equals("1")){
                name=mapper.getadminname(list.get(i).get("user_id").toString());
            }else{
                name=mapper.getstudentname(list.get(i).get("user_id").toString());
            }
            list.get(i).put("name",name);
        }
        return list;
    }

    //通过id获得指定的文章信息
    @Override
    public Map<String,String> getPostbyId(String id) {
        mapper.updatepostview(id);

        return mapper.getPostbyId(id);
    }
    // //返回文章下回复信息
    public List<Map> getreplyMaplist( String pid){

        List<Map> list=mapper. getreplyMaplist(pid);
        return list;

    }
   //返回文章下某一级别下的回复信息
   public List<Map> repliysonlist(String level){
       return mapper.repliysonlist(level);
   }
    //增加一条回复

    public void addreply(Map<String,Object> param){
        mapper.addreply(param);
        mapper.updatereplynum(param.get("post_id").toString());
    }
    //增加一条子回复
    public void addreplyson(Map<String, Object> param){
       if(param.get("level").toString().equals("0")) {
           System.out.println(param.get("level"));
           param.put("level",param.get("pid"));
       }
       mapper.addreplyson(param);
       mapper.updatereplynum(param.get("post_id").toString());
       mapper.updatereplyreplynum(param.get("pid").toString());
    }

   //查询是否对帖子进行点赞
    public int selectpostzan(Map<String,Object> param){
        return mapper.selectpostzanlist( param);
    }
   //取消点赞
    public void deletepostzan(Map<String,Object> param){
        mapper.deletepostzan(param);
        mapper.deletepostzannum(param.get("post_id").toString());
    }
    //进行点赞
    public void insertpostzan(Map<String,Object> param){
        mapper.insertpostzan(param);
        mapper.addpostzannum(param.get("post_id").toString());
    }

    //评论点赞
    public void updatereplyzan(String id){
        mapper.updatereplyzan(id);
    }

    //
    public void updatetopicview(String sub_id){
        mapper.updatetopicview(sub_id);
    }
}
