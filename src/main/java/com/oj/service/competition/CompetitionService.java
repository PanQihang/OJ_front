package com.oj.service.competition;
import java.util.List;
import java.util.Map;
public interface CompetitionService {
    ////返回全部竞赛信息
    public List<Map> getCompMaplist();
    //总数
    public int getCompSum();
    //返回一条即将要进行的比赛
    public List<Map> getACompMaplist();
    //排行信息
    public List<Map> getrankList();
    public List<Map> showmorerank();
    public Map<String ,Object> showComp(String id);
    public List<Map> Compro(String id) ;

    public List<Map> submitStatus(Map<String, Object> param);
    public List<Map> rankListbyID(String id);
    //是否报名
    public int Isenroll(Map<String ,String> param);
    //报名
    public boolean enroll(Map<String ,String> param);
    //取消报名
    public boolean deleteenroll(Map<String ,String> param);
    //报名表
    public List<Map> enrollList(String id);
    public String  RandComp(Map<String,String> param);
    public List<Map> CompedList(String user_id);
}
