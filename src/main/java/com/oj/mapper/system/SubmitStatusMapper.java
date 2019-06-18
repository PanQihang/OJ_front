package com.oj.mapper.system;

import com.oj.entity.system.SubmitCodeList;
import com.oj.mapper.provider.system.SubmitStatusProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;
import java.util.Map;

/**
 * Created by panqihang on 2019/5/6 15:55
 */
@Mapper
public interface SubmitStatusMapper {
    @SelectProvider(type= SubmitStatusProvider.class, method = "getQuerySql")
    public List<SubmitCodeList> getSubmitStatusMaplist(@Param("condition") Map<String, String> params);
    // 查询总数
    @Select("SELECT COUNT(*) FROM teach_submit_code AS a, teach_students AS b WHERE a.user_id = b.id and a.user_id = #{id}")
    public int selectTotalCount(String id);

    @SelectProvider(type=SubmitStatusProvider.class, method = "selectRecordsFiltered")
    // 根据条件获取筛选后的总数
    public int selectRecordsFiltered(@Param("condition")Map<String, String> params);

}
