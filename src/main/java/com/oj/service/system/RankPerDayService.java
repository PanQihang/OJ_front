package com.oj.service.system;

import com.oj.entity.system.Auth;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年5月17日 16点20分
 * @Description 每日排行Service接口
 */
public interface RankPerDayService {
    //将用户的AC题目信息放置到Redis当中
    public void setACinfoToRedis(String problemId, HttpServletRequest request);

    //从Redis当中取出本日的排名信息
    public List<String> getRankPerDayFromRedis();
}
