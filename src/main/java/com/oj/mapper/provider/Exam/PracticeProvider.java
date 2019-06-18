package com.oj.mapper.provider.Exam;

import static java.lang.System.out;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

public class PracticeProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());


    @Deprecated
    public String getAmountPublicProblemListSQLA(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        sql.append("select count(*) from teach_problems t where t.public='on' ");
        if(!StringUtils.isEmpty(info.get("idOrNameDataArg").toString())){
            sql.append(" and ( t.id like '%"); sql.append(info.get("idOrNameDataArg"));
            sql.append("%') ");
            //sql.append("%' or t.name like '%"); sql.append(info.get("idOrNameDataArg")); sql.append("%' ) ");
        }else if(!StringUtils.isEmpty(info.get("problemTypeArg").toString())  && !info.get("problemTypeArg").toString().equals("-1")){
            sql.append(" and t.subjectid = "); sql.append(info.get("problemTypeArg").toString());
        }
        log.info(sql.toString());
        return sql.toString();
    }   // --------------------- 过去的调用，已弃用
    @Deprecated
    public String getPagingPublicProblemListSQLA(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        //out.println("题目集的条件");
        //out.println(info);
        sql.append("select t.id proId, t.name proName, t.rank proRank, t.subjectid proTypeId from teach_problems t where t.public = 'on' ");
        if(!StringUtils.isEmpty(info.get("idOrNameDataArg").toString())){
            sql.append(" and t.id = "); sql.append(info.get("idOrNameDataArg"));
            //sql.append(" and ( t.id like '%"); sql.append(info.get("idOrNameDataArg"));
            //sql.append("%') ");
            //sql.append("%' or t.name like '%"); sql.append(info.get("idOrNameDataArg")); sql.append("%' ) ");
        }else if(!StringUtils.isEmpty(info.get("problemTypeArg").toString())  && !info.get("problemTypeArg").toString().equals("-1")){
            sql.append(" and t.subjectid = ");
            sql.append(info.get("problemTypeArg").toString());
        }
        if(!StringUtils.isEmpty(info.get("difficultySortTypeArg").toString())){
            if(info.get("difficultySortTypeArg").toString().equals("1"))
                sql.append(" order by t.rank desc, t.id ");
            else sql.append(" order by t.rank , t.id ");
        }
        sql.append(" limit "); sql.append(info.get("headLine")+", "+info.get("finalLine"));
        //order by proId limit #{firstLine}, #{finalLine}")

        log.info(sql.toString());
        return sql.toString();
    }   // --------------------- 过去的调用，已弃用








    //AC标准变更修改为submit_state字段-------------当前类内对应调用已更改20190515/14:10
    //分页---在指定题目集中，获取指定用户已尝试的题目集（已解决和未解决的都有）[{题目id、题目状态}, {proId, proState}]
    public String getPagingTargetProblemStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("SELECT DISTINCT t.problem_id proId, MIN(t.submit_state) proState FROM teach_submit_code t  WHERE t.submit_state!=0 and t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        for(int i=0;i<info.size();i++){
            Map cell = info.get(i);
            sql.append((i==0?"":", ")+cell.get("proId").toString());
        }
        sql.append(") group by proId order by proId, proState desc ");
        log.info(sql.toString());
        return sql.toString();
    }
    //分页---在指定题目集中，获取指定用户已解决的题目集（只含已解决的）[{题目id、1}, {proId, proState}]  -------------- 冗余调用
    public String getPagingFinishProblemListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("SELECT DISTINCT t.problem_id proId, MIN(t.submit_state) proState FROM teach_submit_code t  WHERE t.submit_state=1 and t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        for(int i=0;i<info.size();i++){
            Map cell = info.get(i);
            sql.append((i==0?"":", ")+cell.get("proId").toString());
        }
        sql.append(") group by proId order by proId, proState desc ");
        log.info(sql.toString());
        return sql.toString();
    }

    //分页---获取指定题集的已AC的提交数据[{题目id、题目Ac次数},{proId, proAcAmount}]
    public String getPagingPublicProblemACStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proAcAmount from teach_submit_code t where t.submit_state=1 and t.problem_id in (");
        for(int i=0;i<info.size();i++){
            Map cell = info.get(i);
            sql.append((i==0?"":", ")+cell.get("proId").toString());
        }
        sql.append(") group by t.problem_id ");
        log.info(sql.toString());
        return sql.toString();
    }
    //分页---获取指定题集的所有提交记录数据[{题目id、题目提交总数},{proId, proSubmitAmount}]
    public String getPagingPublicProblemStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proSubmitAmount from teach_submit_code t where t.problem_id in (");
        for(int i=0;i<info.size();i++){
            Map cell = info.get(i);
            sql.append((i==0?"":", ")+cell.get("proId").toString());
        }
        sql.append(") group by t.problem_id ");
        log.info(sql.toString());
        return sql.toString();
    }

    //分页---获取符合指定条件的题目集[{题目id、题目名称、题目等级、题目类型}, {proId, proName, proRank, proTypeId}]
    public String getPagingPublicProblemListSQL(Map<String, Object> params){
        /*题目集的搜索条件
    proId : '', //题目关键字(精确搜索）
    proName : '', //题目名称（模糊搜索）
    proDifficultyType : 0, //难度指标[0:所有题目、1:入门、2:容易、3:普通、4:困难、5:超难]
    proType : 0, //题目的类型
    specialProblemListType : //题目集的搜索范围[题目id, .....]
         */
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        //out.println("题目集的条件");
        //out.println(info);
        sql.append("select t.id proId, t.name proName, t.rank proRank, t.subjectid proTypeId from teach_problems t where t.public = 'on' ");
        if(!StringUtils.isEmpty(info.get("proId").toString())){
            sql.append(" and t.id = "); sql.append(info.get("proId").toString());
        }else if(!StringUtils.isEmpty(info.get("proName").toString())){
            sql.append(" and t.name like '%" + info.get("proName").toString() + "%' ");
        }
        if(!StringUtils.isEmpty(info.get("proDifficultyType").toString()) && !info.get("proDifficultyType").toString().equals("0")){
            sql.append(" and ");
            if(info.get("proDifficultyType").toString().equals("1")){
                sql.append(" t.rank >= 0 and t.rank <= 20 ");
            }else if(info.get("proDifficultyType").toString().equals("2")){
                sql.append(" t.rank > 20 and t.rank <= 40 ");
            }else if(info.get("proDifficultyType").toString().equals("3")){
                sql.append(" t.rank > 40 and t.rank <= 60 ");
            }else if(info.get("proDifficultyType").toString().equals("4")){
                sql.append(" t.rank > 60 and t.rank <= 80 ");
            }else if(info.get("proDifficultyType").toString().equals("5")){
                sql.append(" t.rank > 80 and t.rank <= 100 ");
            }
        }
        if(!StringUtils.isEmpty(info.get("proType").toString()) && !info.get("proType").toString().equals("-1")){
            sql.append(" and t.subjectid = ");
            sql.append(info.get("proType").toString());
        }
        if(!StringUtils.isEmpty(info.get("specialProblemListType").toString())){
            sql.append(" and t.id in ("+info.get("specialProblemListType").toString()+") ");
        }
        sql.append(" order by t.time desc");
        sql.append(" limit "); sql.append(info.get("headLine")+", "+info.get("finalLine"));
        //order by proId limit #{firstLine}, #{finalLine}")

        log.info(sql.toString());
        return sql.toString();
    }
    //获取指定条件的题目集的总数__（与上一个调用(getPagingPublicProblemListSQL)配套使用于数据分页系统） {总数}
    public String getAmountPublicProblemListSQL(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        sql.append("select count(*) from teach_problems t where t.public = 'on' ");
        if(!StringUtils.isEmpty(info.get("proId").toString())){
            sql.append(" and t.id = "); sql.append(info.get("proId").toString());
        }else if(!StringUtils.isEmpty(info.get("proName").toString())){
            sql.append(" and t.name like '%" + info.get("proName").toString() + "%' ");
        }
        if(!StringUtils.isEmpty(info.get("proDifficultyType").toString()) && !info.get("proDifficultyType").toString().equals("0")){
            sql.append(" and ");
            if(info.get("proDifficultyType").toString().equals("1")){
                sql.append(" t.rank >= 0 and t.rank < 20 ");
            }else if(info.get("proDifficultyType").toString().equals("2")){
                sql.append(" t.rank >= 20 and t.rank < 40 ");
            }else if(info.get("proDifficultyType").toString().equals("3")){
                sql.append(" t.rank >= 40 and t.rank < 60 ");
            }else if(info.get("proDifficultyType").toString().equals("4")){
                sql.append(" t.rank >= 60 and t.rank < 80 ");
            }else if(info.get("proDifficultyType").toString().equals("5")){
                sql.append(" t.rank >= 80 and t.rank < 100 ");
            }
        }
        if(!StringUtils.isEmpty(info.get("proType").toString()) && !info.get("proType").toString().equals("-1")){
            sql.append(" and t.subjectid = ");
            sql.append(info.get("proType").toString());
        }
        if(!StringUtils.isEmpty(info.get("specialProblemListType").toString())){
            sql.append(" and t.id in ("+info.get("specialProblemListType").toString()+") ");
        }
        log.info(sql.toString());
        return sql.toString();
    }

    //验证指定指定提交是否有效，以及指定题目的查阅请求是否有效
    public String getCheckRequestConditionSQL(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        String strProId = info.get("proId").toString();
        String strTestId = info.get("testId").toString();
        if(!StringUtils.isEmpty(strTestId) && !strTestId.equals("0")){//考试或实验时的请求
            sql.append("select distinct t.pid proId from teach_test_problems t, teach_test k  where k.id="+strTestId+" and t.tid="+strTestId+" and t.pid="+strProId+"  and  UNIX_TIMESTAMP(NOW())>k.start and UNIX_TIMESTAMP(NOW())<k.end ");
        }else if(!StringUtils.isEmpty(strTestId) && strTestId.equals("0")){//公开题目的请求
            sql.append("SELECT distinct s.id proId FROM teach_problems s WHERE s.id="+strProId+" AND s.public='on'");
        }
        log.info(sql.toString());
        return sql.toString();
    }


}
