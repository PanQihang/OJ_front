package com.oj.service.system;

import com.oj.frameUtil.JqueryDataTableDto;

import java.util.List;
import java.util.Map;

/**
 * Created by panqihang on 2019/5/7 13:48
 */
public interface RankingService {
    //返回所有排行
    public JqueryDataTableDto getRankingMaplist(String start, String count);
    //返回三个月排行
    public JqueryDataTableDto getRankingMaplist1(String start,String count);
    //返回学生排行详情
    public Map getStudent(String account,String idself);


}
