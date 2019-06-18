package com.oj.service.serviceImpl.system;

import com.oj.entity.system.RankPerDay;
import com.oj.service.system.RankPerDayService;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RankPerDayServiceImpl implements RankPerDayService {
    @Autowired
    private JedisPool jedisPool;

    private Logger log = LoggerFactory.getLogger(this.getClass());
    /**
     * 将用户的AC题目信息放置到Redis当中接口方法实现
     * @param problemId
     * @param request
     */
    @Override
    public void setACinfoToRedis(String problemId, HttpServletRequest request) {
        //当前登陆人ID
        String userId = request.getSession().getAttribute("user_id").toString();
        //当前登陆人姓名
        String userName = request.getSession().getAttribute("user_name").toString();
        //当前登陆人学号
        String userAccount = request.getSession().getAttribute("user_account").toString();
        //当前登陆人班级ID
        String userClassId = request.getSession().getAttribute("user_class").toString();
        //当前登陆人班级名称
        String userClassName = request.getSession().getAttribute("user_class_name").toString();

        Jedis jedis = jedisPool.getResource();
        //判断用户哈希和用户zsort是否存在，若不存在创建一下
        if (!jedis.exists("userInfoHash") && !jedis.exists("userInfoZSort")){
            //创建用户哈希
            jedis.hset("userInfoHash", "info", "000");
            jedis.zadd("userInfoZSort", 0, "info");
            //将这两个key定义为当晚23点59分销毁
            long destoryTimeUnix = getdestoryTimeUnix();
            jedis.expireAt("userInfoHash", destoryTimeUnix);
            jedis.expireAt("userInfoZSort", destoryTimeUnix);
        }
        RankPerDay rankPerDay = null;
        if (jedis.hexists("userInfoHash", userId)){
            JSONObject obj = new JSONObject().fromObject(jedis.hget("userInfoHash", userId));
            rankPerDay = (RankPerDay) JSONObject.toBean(obj,RankPerDay.class);
        }else{
            rankPerDay = new RankPerDay();
            rankPerDay.setUserId(userId);
            rankPerDay.setUserName(userName);
            rankPerDay.setUserAccount(userAccount);
            rankPerDay.setUserClassId(userClassId);
            rankPerDay.setUserClassName(userClassName);
        }
        double ACNums = (double)rankPerDay.setUserACProblems(problemId);
        jedis.hset("userInfoHash", userId, JSONObject.fromObject(rankPerDay).toString());
        jedis.zadd("userInfoZSort", ACNums,userId);
        jedis.close();
        log.info("用户ID："+userId+", AC信息已成功保存到redis");
    }

    /**
     * //从Redis当中取出本日的排名信息
     * @return
     */
    @Override
    public List<String> getRankPerDayFromRedis() {
        Jedis jedis = jedisPool.getResource();
        Set<String> userInfoZSort = jedis.zrange("userInfoZSort", 1, -1);
        List<String> userList = new ArrayList<>();
        for (String str : userInfoZSort) {
            userList.add(jedis.hget("userInfoHash", str));
        }
        jedis.close();
        return userList;
    }
    private long getdestoryTimeUnix(){
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime) + " 23:59:00";
        formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        long timeUnix = 0;
        try{
            timeUnix = formatter.parse(dateString).getTime();
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return timeUnix/1000;
    }
}
