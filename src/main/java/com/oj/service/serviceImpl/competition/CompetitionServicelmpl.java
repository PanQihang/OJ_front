package com.oj.service.serviceImpl.competition;
import com.oj.mapper.copmetition.CompetitionMapper;
import com.oj.service.competition.CompetitionService;
import org.apache.ibatis.annotations.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetitionServicelmpl implements CompetitionService{

    @Autowired(required = false)
    private CompetitionMapper mapper;
    //获取竞赛列表
    @Override
    public List<Map> getCompMaplist(){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-M-dd HH:mm:ss");
        List<Map> list=mapper.getCompMaplist();
        int i=0;
        String time="";
        Date end=new Date();
        Date start=new Date();
        for(i=0;i<list.size();i++){
            try {
              end=format.parse(list.get(i).get("end").toString());
              start=format.parse(list.get(i).get("start").toString());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            time=getDatePoor(end,start);
            System.out.println(time);
            list.get(i).put("time",time);
        }

        return list;
    }
    public String getDatePoor(Date endDate, Date nowDate) {

        long nd = 1000 * 24 * 60 * 60;
        long nh = 1000 * 60 * 60;
        long nm = 1000 * 60;
        // long ns = 1000;
        // 获得两个时间的毫秒时间差异
        long diff = endDate.getTime() - nowDate.getTime();
        //long day = diff % nd;
        // 计算差多少小时
        long hour = diff % nd / nh;
        // 计算差多少分钟
        long min = diff % nd % nh / nm;
        // 计算差多少秒//输出结果
        // long sec = diff % nd % nh % nm / ns;
        return  hour + "小时" + min + "分钟";
    }
    public String getDatePoor1(Date endDate, Date nowDate) {

        long nd = 1000 * 24 * 60 * 60;
        long nh = 1000 * 60 * 60;
        long nm = 1000 * 60;
        long ns = 1000;
        // long ns = 1000;
        // 获得两个时间的毫秒时间差异
        long diff = endDate.getTime() - nowDate.getTime();
        long day = diff % nd;
        // 计算差多少小时
        long hour = diff % nd / nh;
        // 计算差多少分钟
        long min = diff % nd % nh / nm;
        // 计算差多少秒//输出结果
         long sec = diff % nd % nh % nm / ns;
        return  day+"天"+hour + "小时" + min + "分钟"+sec+"秒";
    }
    //总数
    public int getCompSum(){
        return mapper.getSum();
    }
    //返回一条即将要进行的比赛
    public List<Map> getACompMaplist(){
        List<Map> Comp=mapper.getACompList();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-M-dd HH:mm:ss");
        String time="";
        Date end=new Date();
        Date start=new Date();
        int i=0;
        for(i=0;i<Comp.size();i++){
            try {
                end=format.parse(Comp.get(i).get("end").toString());
                start=format.parse(Comp.get(i).get("start").toString());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            Date now=new Date();
            System.out.println(now);
            if(now.getTime()<start.getTime()){
                Comp.get(i).put("flag",0);
            }else if(now.getTime()>end.getTime()){
                Comp.get(i).put("flag",2);
            }else{
                Comp.get(i).put("flag",1);
            }
        }


        return Comp;
    }
    public List<Map> getrankList(){
        List<Map> list=mapper.getrankList();
        System.out.println(list);
        int i=0;
        String id="";
        for(i=0;i<list.size();i++){
            id= list.get(i).get("user_id").toString();
            Map<String,String> info=mapper.getStudent(id);
           if(info==null){
               list.remove(list.get(i));
               continue;
           }
            list.get(i).put("name",info.get("name"));
            list.get(i).put("className",info.get("className"));
            list.get(i).put("account",info.get("account"));
            list.get(i).put("num",mapper.getcompnum(id));
        }
        return list;
    }
    //获取更多排名
    public List<Map> showmorerank() {
        List<Map> list=mapper.showmorerank();
        int i=0;
        String id="";
        for(i=0;i<list.size();i++){
            id= list.get(i).get("user_id").toString();
            Map<String,String> info=mapper.getStudent(id);
            if(info==null){
                list.remove(list.get(i));
                continue;
            }
            list.get(i).put("name",info.get("name"));
            list.get(i).put("className",info.get("className"));
            list.get(i).put("account",info.get("account"));
            list.get(i).put("num",mapper.getcompnum(id));
        }
        return list;
    }
    //返回页面信息
    public Map<String ,Object> showComp(String id){
        Map<String,Object> Comp=mapper.showComp(id);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-M-dd HH:mm:ss");
        String time="";
        Date end=new Date();
        Date start=new Date();
        try {
            end=format.parse(Comp.get("end").toString());
            start=format.parse(Comp.get("start").toString());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Date now=new Date();
        System.out.println(now);
        if(now.getTime()<start.getTime()){
            Comp.put("flag","0");
           // Comp.put("data",getDatePoor1(start,now));
        }else if(now.getTime()>end.getTime()){
            Comp.put("flag","2");
            //Comp.put("data",getDatePoor1(now,end));
        }else{
            Comp.put("flag","1");
            //Comp.put("data",getDatePoor1(end,now));
        }
        return Comp;
    }
    //
    public List<Map> Compro(String id){
        return mapper.CompPro(id);
    }

    public List<Map> submitStatus(Map<String, Object> param){
          return mapper.submitStatus(param);
    }
    public List<Map> rankListbyID(String id){
        return mapper.rankList(id);
    }

    //查询是否已经报名
    public int Isenroll(Map<String ,String> param){
        if(mapper.Isenroll(param)>0){
            return 1;
        }
       return mapper.Isenroll(param);
    }
    //报名
    public boolean enroll(Map<String ,String> param){
        mapper.Insertenroll(param);
        return true;
    }
    //取消报名
    public boolean deleteenroll(Map<String ,String> param){
        System.out.println(param);
        mapper.deleteenroll(param);
        return true;
    }
    //报名表
    public List<Map> enrollList(String id){
        return mapper.enrollinfo(id);
    }
     //随即返回
    public String RandComp(Map<String,String> param){
        String flag=param.get("flag");
        String user_id=param.get("user_id");
        List<Map> list=new LinkedList<>();
        if(flag.equals("0")){
            list= mapper.CompList(user_id);
            if(list.size()==0){
                return "none";
            }else {
                return list.get((int) (0 + Math.random() * (list.size() - 1 - 0 + 1))).get("id").toString();
            }
        }else if(flag.equals("1")){
            list=mapper.CompedeList(user_id);
            System.out.println(list);
            if(list.size()==0){
                System.out.println(1);
                return "none";
            }else{
                return list.get((int)(0+Math.random()*(list.size()-1-0+1))).get("id").toString();

            }
        }else{
            list= mapper.CompAll();
            if(list.size()==0){
                return "none";
            }else{
                return list.get((int)(0+Math.random()*(list.size()-1-0+1))).get("id").toString();
            }
        }

    }
    public List<Map> CompedList(String user_id){
        return mapper.CompedList(user_id);
    }
}
