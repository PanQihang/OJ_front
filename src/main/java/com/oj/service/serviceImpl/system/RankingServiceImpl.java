package com.oj.service.serviceImpl.system;

import com.oj.entity.system.RankingList;
import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.mapper.system.RankingMapper;
import com.oj.service.system.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by AC on 2019/5/7 13:50
 */
@Service
public class RankingServiceImpl implements RankingService {

    @Autowired(required = false)
    private RankingMapper mapper;
    @Override
    public JqueryDataTableDto getRankingMaplist(String start, String count) {
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<RankingList> list = mapper.getRankingMaplist(params);
        int rank = Integer.valueOf(start)+1;
        for(int i=0;i<list.size();i++)
        {
            String id = list.get(i).getUser_id();
            String account = mapper.selectAccount(id);
            int tot = mapper.selectTot(id);
            String Tot = String.valueOf(tot);
            String nname = mapper.selectName(id);
            list.get(i).setName(nname);
            list.get(i).setTot(Tot);
            list.get(i).setRank(rank);
            list.get(i).setAccount(account);
            rank++;
        }
        int total = mapper.selectTotalCount();
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(total);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }

    @Override
    public JqueryDataTableDto getRankingMaplist1(String start, String count) {
        long nowtime = Calendar.getInstance().getTimeInMillis()/1000;
        nowtime -= 7776000;
        String time = String.valueOf(nowtime);
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<RankingList> list = mapper.getRankingMaplist1(params);
        int rank = Integer.valueOf(start)+1;
        for(int i=0;i<list.size();i++)
        {
            String id = list.get(i).getUser_id();
            String account = mapper.selectAccount(id);
            int tot = mapper.selectTot1(id, time);
            String Tot = String.valueOf(tot);
            String nname = mapper.selectName(id);
            list.get(i).setName(nname);
            list.get(i).setTot(Tot);
            list.get(i).setRank(rank);
            list.get(i).setAccount(account);
            rank++;
        }
        int total = mapper.selectTotalCount1(time);
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(total);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }

    @Override
    public Map getStudent(String account, String idself) {
        Map<String,Object> map = new HashMap<>();
        String id = mapper.searchid(account);
        if(id==null)
        {
            map.put("message","该学生不存在");
            return map;
        }
        else {
            map.put("message","该学生存在");
            int ac = mapper.selectAc(id);
            int tot = mapper.selectTot(id);
            double aclv = new Double(Math.round(ac * 10000 / tot) / 100.0);//这样为保持4位;
            //个人ac总数
            map.put("ac", String.valueOf(ac));
            //提交总数
            map.put("tot", String.valueOf(tot));
            //ac率
            map.put("aclv", String.valueOf(aclv) + '%');
            String name = mapper.selectName(id);
            //姓名
            map.put("name", name);
            int rank = mapper.selectRank(ac) + 1;
            //排名
            map.put("rank", String.valueOf(rank));
            String Class = mapper.selectClass(id);
            //班级
            map.put("class", Class);
            //user_id
            map.put("id",id);
            List<String> aclist = mapper.acProblem(id);

            //ac题目编号
            map.put("aclist",aclist);

            List<String> alllist = mapper.AllProblem(id);
            //提交未ac题目号
            List<String> naclist = new ArrayList<>();
            for(int i=0; i<alllist.size(); i++)
            {
                if(!aclist.contains(alllist.get(i)))
                {
                    naclist.add(alllist.get(i));
                }
            }
            map.put("naclist",naclist);
            //提交未ac题目数
            map.put("nacCount",naclist.size());
            //ac题目数
            int acCount = mapper.acProblemCount(id);
            map.put("acCount",acCount);
            //查询本用户ac题目编号
            List<String> selfaclist = mapper.acProblem(idself);
            //查询本用户总题目编号
            List<String> selfalllist = mapper.AllProblem(idself);
            //本用户提交未ac题目号
            List<String> selfnaclist = selfalllist;
            selfnaclist.removeAll(selfaclist);

            //他AC你却没有AC的题目:
            List<String> bb1 = new ArrayList<>();
            if(!idself.equals(id)) {
                for (int i = 0; i < aclist.size(); i++) {
                    if (selfaclist.contains(aclist.get(i)) == false) {
                        bb1.add(aclist.get(i));
                    }
                }
            }
            map.put("bb1",bb1);

            //你AC他却没有AC的题目:
            List<String> bb2 = new ArrayList<>();
            if(!idself.equals(id)) {
                for (int i = 0; i < selfaclist.size(); i++) {
                    if (!aclist.contains(selfaclist.get(i))) {
                        bb2.add(selfaclist.get(i));
                    }
                }
            }
            map.put("bb2",bb2);

            //你们都AC的题目
            System.out.println(idself+id);
            if(!idself.equals(id)) {
                List<String> bb3 = new ArrayList<>(aclist);
                bb3.retainAll(selfaclist);
                map.put("bb3",bb3);
            }
            else
            {
                List<String> bb3 = new ArrayList<>();
                map.put("bb3",bb3);
            }

            //你们都尝试过却没有AC的题目
            if(!idself.equals(id)) {
                List<String> bb4 = new ArrayList<>(naclist);
                bb4.retainAll(selfnaclist);
                map.put("bb4",bb4);
            }
            else
            {
                List<String> bb4 = new ArrayList<>();
                map.put("bb4",bb4);
            }
            System.out.println(map);
            return map;
        }
    }
}
