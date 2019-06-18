package com.oj.service.serviceImpl.exam;

import static java.lang.System.out;
import com.oj.entity.practic.SubmitCode;
import com.oj.entity.practic.TestData;
import com.oj.judge.RedisUtils;
import com.oj.mapper.exam.PracticeMapper;
import com.oj.service.exam.PracticeService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PracticeServiceImpl implements PracticeService {

    @Autowired(required = false)
    private PracticeMapper mapper;


    @Autowired
    private RedisUtils redisUtils;

    /*
        获取最新创建的10个题目信息[{proId, proName, proSubNum, proAcNum}, {题目编号,题目名称, 题目总提交数, 题目AC数}...]
     */
    @Override
    public List<Map> getNewestProList(){
        List<Map> list = mapper.getNewestProList();
        List<Map<String, Object>> acList = mapper.getPagingPublicProblemACStateList(list); //指定题目集的所有AC提交统计
        List<Map<String, Object>> subList = mapper.getPagingPublicProblemStateList(list); //指定题目集的所有提交统计
        out.println("--------------------------------------------");
        out.println(acList);
        out.println("++++++++++++++++++++++++++++++++++++");
        out.println(subList);
        list.forEach(cell->{
            String proId = cell.get("proId").toString();
            int i; Map<String, Object> temp=null;
            //匹配AC信息
            for(i=0;i<acList.size();i++) {
                temp = acList.get(i);
                if (proId.equals(temp.get("proId").toString())) break;
            }
            if(i!=acList.size()) cell.put("proAcNum", temp.get("proAcAmount").toString());
            else cell.put("proAcNum", "0");
            //匹配提交信息
            for(i=0;i<subList.size();i++) {
                temp = subList.get(i);
                if (proId.equals(temp.get("proId").toString())) break;
            }
            if(i!=subList.size()) cell.put("proSubNum", temp.get("proSubmitAmount").toString());
            else cell.put("proSubNum", "0");
            //换算题目的难度系数
            int tNum = (int) Math.ceil(0.05 * (Double.parseDouble(cell.get("proRank").toString())));
            tNum = (tNum == 0 ? 1 : tNum);
            cell.put("proDifficulty", "" + tNum);
        });
        out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        out.println(list);
        return list;
    }

    //获取题目类型的二级列表数据
    @Override
    public List<Map> getProblemTypeList(){
        List<Map> result = new LinkedList<Map>();
        List<Map> temp;
        Map cell;
        List<Map<String, Object>> list = mapper.getProblemTypeList();
        cell = new HashMap<>();
        cell.put("typeAName", "全部"); cell.put("typeBList", "[]");
        result.add(cell);

        int i=0, j;
        String strA, strB;
        for(;i<list.size();i++){
            if(null == list.get(i).get("father") || list.get(i).get("father").toString().equals("")){
                temp = new LinkedList<Map>();
                strA = list.get(i).get("id").toString();
                for(j=i+1; j<list.size();j++){
                    if(null == list.get(j).get("father")) continue;
                    strB=list.get(j).get("father").toString();
                    if(strB.equals(strA)){
                        cell = new HashMap<String, String>();
                        cell.put("typeBName", list.get(j).get("name").toString());
                        cell.put("typeBId", list.get(j).get("id").toString());
                        temp.add(cell);
                    }
                }
                cell = new HashMap<>();
                cell.put("typeAName", list.get(i).get("name").toString());
                cell.put("typeBList", temp);
                result.add(cell);
                //out.println(result);
            }
        }
        return result;
    }
    @Override
    //获取指定用户在系统中的简要信息
    public Map getSystemSimpleInf(String stuId){
        Map<String, String> result = new HashMap<>();
        List finishList = mapper.getFinishProblemList(stuId);
        List targetList = mapper.getTargetProblemStateList(stuId);
        List AllProblemlist = mapper.getPublicProblemList();
        result.put("problemAmount", ""+AllProblemlist.size());
        result.put("tryProblemAmount", ""+targetList.size());
        result.put("finishProblemAmount", ""+finishList.size());
        result.put("systemRank", ""+(targetList.size()-finishList.size()) );
        return result;
    }
    //获取指定题目的详细信息
    @Override
    public Map getTargetProblemInf(String proId){
        Map result = mapper.getTargetProblemInf(proId);
        List proList = new LinkedList<Map> ();
        Map map = new HashMap<String, String>(); map.put("proId", proId);
        proList.add(map);
        List<Map> subList = mapper.getPagingPublicProblemStateList(new LinkedList<>(proList));
        List<Map> AcList = mapper.getPagingPublicProblemACStateList(new LinkedList<>(proList));
        result.put("proSubmitAmount", 0==subList.size()?"0":(subList.get(0)).get("proSubmitAmount").toString());
        result.put("proAcAmount", 0==AcList.size()?"0":(AcList.get(0)).get("proAcAmount").toString());
        return result;
    }
    //验证代码提交以及查阅请求是否为有效请求（既非考试阶段无法查看题目以及提交代码、非公开题目无法查看以及提交代码）
    public List<Map<String, Object>> checkRequestCondition(Map params){
        return mapper.checkRequestCondition(params);
    }



    //获取所有公开题目的统计信息（题目id、题目AC数量、题目提交数量）
    public List<Map> getPublicProblemStatisticList(){
        List<Map> result = new LinkedList<>();
        List<Map<String, Object>> list = mapper.getPublicProblemList(); //公开题目集
        List<Map<String, Object>> acList = mapper.getPublicProblemACStateList(); //公开题目集的所有AC提交统计
        List<Map<String, Object>> subList = mapper.getPublicProblemStateList(); //公开题目集的所有提交统计
        list.forEach(cell -> {
            int i=0;
            String strProIdA = cell.get("proId").toString();
            for(;i<acList.size();i++) {
                Map temp = acList.get(i);
                if (strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proAcNum", temp.get("AcAmount").toString());
                    break;
                }
            }
            if(i==acList.size()) cell.put("proAcNum", "0");
            for(i=0;i<subList.size();i++){
                Map temp = subList.get(i);
                if(strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proSubNum", temp.get("submitAmount").toString());
                    break;
                }
            }
            if(i==subList.size()) cell.put("proSubNum", "0");
            result.add(cell);
        });

        return result;
    }
    //获取对应指定用户的题目集------- 方案A（前端分页）
    @Override
    public List<Map> getTargetProblemList(String stuId){
        //out.println("##"+stuId);
        List<Map> result = new LinkedList<>();
        List<Map> AllProList = getPublicProblemStatisticList(); //获取公开的题目集
        List<Map<String, Object>> TargetProStateList = mapper.getTargetProblemStateList(stuId); //获取指定用户已接触的题目集(这里面包含了，实验与考试时的提交记录)!!!可优化
        AllProList.forEach(cell ->{
            cell.put("AcState", "unknow");
            int tNum = (int)Math.ceil(0.05*(Double.parseDouble(cell.get("proRank").toString())) );
            tNum = (tNum==0?1:tNum);
            cell.put("proDifficulty", ""+ tNum);
            result.add(cell);
        } );
        TargetProStateList.forEach(cell -> {
            String str = cell.get("proId").toString();
            int i=0; Map temp;
            for(;i<result.size();i++){
                temp = result.get(i);
                if(str.equals(temp.get("proId").toString())) {
                    temp.put("AcState", Double.parseDouble(cell.get("accuracy").toString())==1.0 ? "true" : "false");
                    break;
                }
            }
        });
        return result;
    }

    //获取指定提交编号的处理结果
    @Override
    public Map getTargetResult(String submitId){
        /*
        int DEF = 0 , AC = 1, PRESENTATION_ERROR = 2,
            WRONG_ANSWER = 3 ,COMPILE_ERROR=8,
            TIME_LIMIT_EXCEED = 5 ,RUNTIME_ERROR = 4
            ,MEMORY_LIMIT_EXCEED = 6;
         */
        Map map = mapper.getTargetResult(submitId);
        out.println(map);
        Map result = new HashMap();
        if(null!=map) {
            String submitStateStr = map.get("submitState").toString();
            result.put("result", map.size()==0?"0": submitStateStr);
            result.put("problem_id", map.get("problem_id"));
            if(submitStateStr.equals("1") || submitStateStr.equals("2") || submitStateStr.equals("3"))
                result.put("inf",  (int)(Double.parseDouble(map.get("accuracy").toString()) *100 ) + "%");
            else result.put("inf", "");
        }
        return result;
    }

    //AC标准变更修改为submit_state字段-------------已变更
    //获取对应指定用户下指定条件的题目集（题目id、题目AC数量、题目提交数量、指定用户的AC状态）------- 方案（数据库分页）
    public Map getPagingTargetProblemList(Map param){
        Date tF, tE;
        tF = new Date();
        //@---转换参数集内分页所需的参数
        param.put("headLine", param.get("start"));  //@--- 分页的第一条数据的下标
        param.put("finalLine", Integer.parseInt(param.get("limit").toString())); //@--- 当前分页请求中页面内的数据最大条数
        //@---将参数集内的specialProblemListType字段转换为对应的题目集数据
        if(!param.get("specialProblemListType").toString().equals("1")){//题目集的搜索范围[1:所有题目、2:已尝试的题目集、3:已解决的题目集、4:未解决的题目集]
            List<Map<String, Object>> tempList = mapper.getTargetProblemStateList(param.get("stuId").toString());
            StringBuffer tempStr = new StringBuffer(); tempStr.append("");
            if(0==tempList.size()) ;
            else if(param.get("specialProblemListType").toString().equals("2")){
                for(int i=0; i<tempList.size(); i++){
                    tempStr.append((i==0?"":", ") + tempList.get(i).get("proId").toString());
                }
            }else if(param.get("specialProblemListType").toString().equals("3")){
                boolean firstPro=true;
                for(int i=0; i<tempList.size(); i++){
                    Map<String, Object> cell = tempList.get(i);
                    if(cell.get("proState").toString().equals("1")) {
                        tempStr.append((firstPro? "" : ", ") + cell.get("proId").toString());
                        firstPro = false;
                    }
                }
            }else if(param.get("specialProblemListType").toString().equals("4")){
                boolean firstPro=true;
                for(int i=0; i<tempList.size(); i++){
                    Map<String, Object> cell = tempList.get(i);
                    if(!cell.get("proState").toString().equals("1")){
                        tempStr.append((firstPro?"":", ") + cell.get("proId").toString());
                        firstPro=false;
                    }
                }
            }
            param.put("specialProblemListType",tempStr.toString());
            out.println("特殊结果集");
            out.println(tempStr);
        }else param.put("specialProblemListType", "");
        List<Map> result = new LinkedList<>();
        List<Map> targetList = getPagingPublicProblemStatisticList(param); //@--- 获取指定条件的题集

        tE =new Date();
        out.println("part_1 used time:"+(tE.getTime()-tF.getTime()));
        tF=tE;
        //@---将获取到的题集与用户做题信息汇总
        if(0!=targetList.size()) {
            List<Map<String, Object>> targetProStateList = mapper.getPagingTargetProblemStateList(new LinkedList(targetList), param.get("stuId").toString()); //获取指定用户在指定题集中已接触的集合
            //@---换算题目的难度系数
            targetList.forEach(cell -> {
                cell.put("AcState", "unknow");
                int tNum = (int) Math.ceil(0.05 * (Double.parseDouble(cell.get("proRank").toString())));
                tNum = (tNum == 0 ? 1 : tNum);
                cell.put("proDifficulty", "" + tNum);
                result.add(cell);
            });
            //@---获取指定用户对当前获取的的题集的做题情况
            targetProStateList.forEach(cell -> {
                String str = cell.get("proId").toString();
                int i = 0;
                Map temp;
                for (; i < result.size(); i++) {
                    temp = result.get(i);
                    if (str.equals(temp.get("proId").toString())) {
                        temp.put("AcState", cell.get("proState").toString().equals("1") ? "true" : "false");
                        break;
                    }
                }
            });
        }
        Map temp = new TreeMap();
        temp.put("draw", 0);
        temp.put("recordsTotal", mapper.getPublicProblemAmount().toString());  //当前获取到的数据总数
        temp.put("recordsFiltered", mapper.getAmountPublicProblemList(param)); //实际数据总数
        temp.put("data", result);
        tE =new Date();
        out.println("part_2 used time:"+(tE.getTime()-tF.getTime()));
        tF=tE;
        return temp;
    }
    //获取指定公开题目的统计信息（题目id、题目AC数量、题目提交数量）
    public List<Map> getPagingPublicProblemStatisticList(Map param){
        Date tF, tE;
        tF = new Date();
        List<Map> result = new LinkedList<>();
        List<Map> list = mapper.getPagingPublicProblemList(param); //@--- 指定条件的题目集
        if(list.size()==0) return result;
        //out.println("Flag");
        //out.println(list);
        List<Map<String, Object>> acList = mapper.getPagingPublicProblemACStateList(list); //指定题目集的所有AC提交统计
        List<Map<String, Object>> subList = mapper.getPagingPublicProblemStateList(list); //指定题目集的所有提交统计
        list.forEach(cell -> {
            int i=0;
            String strProIdA = cell.get("proId").toString();
            //@---搜索对应题目的AC总数
            for(;i<acList.size();i++) {
                Map temp = acList.get(i);
                if(strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proAcNum", temp.get("proAcAmount").toString());
                    break;
                }
            }
            if(i==acList.size()) cell.put("proAcNum", "0");
            //@---搜索对应题目的所有提交总数
            for(i=0;i<subList.size();i++){
                Map temp = subList.get(i);
                if(strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proSubNum", temp.get("proSubmitAmount").toString());
                    break;
                }
            }
            if(i==subList.size()) cell.put("proSubNum", "0");
            result.add(cell);
        });
        return result;
    }












    //----------------------------- 以下调用归属于判题模块

    @Override
    public Integer insertSubmit(SubmitCode code) {
        return mapper.insertSubmit(code);
    }

    @Override
    public Integer updateState(SubmitCode pojo) {
        return mapper.updateState(pojo);
    }

    @Override
    public Map<Integer, List<String>> selectTestData(Integer problemId) {
        Map<Integer, List<String>> res = redisUtils.getTestData(problemId);
        if (res != null && res.size() > 0) {
            return res;
        }
        List<TestData> list = mapper.selectTestData(problemId);
        //如果list为空，则该题目无测试样例，需写log
        if (list == null || list.size() == 0) {
            //写log
            Log log = LogFactory.getLog(PracticeServiceImpl.class);
            log.error("ProblemId:" + problemId + "has no testData!");
        } else {
            res = redisUtils.writeToRedisAndGetTestData(list, problemId);
        }
        return res;
    }

  //一级回复
    public void addReply(Map<String,String> param){
        mapper.InsertReply(param);
    }
    public List<Map> getReply(String proId){
       return  mapper.getReply(proId);
    }
    //某一评论下的回复
    public List<Map> OpenReply(Map<String,String> param){
        return mapper.OpenReply(param);
    }
    //
    public void Reply(Map<String,String> param){
        mapper.Reply(param);
    }
}
