package com.oj.service.serviceImpl.system;

import com.oj.entity.system.SubmitCodeList;
import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.mapper.system.SubmitStatusMapper;
import com.oj.service.system.SubmitStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by AC on 2019/5/6 15:54
 */
@Service
public class SubmitStatusServicelmpl implements SubmitStatusService {
    @Autowired(required = false)
    private SubmitStatusMapper mapper;

    @Override
    public JqueryDataTableDto getSubmitStatusMaplist(String start, String count, String problem_id, String account, String submit_state, String user_id, String submit_language)  {
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        params.put("problem_id", problem_id);
        params.put("user_id", user_id);
        params.put("submit_state", submit_state);
        params.put("submit_language", submit_language);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<SubmitCodeList> list = mapper.getSubmitStatusMaplist(params);
        for(int i=0;i<list.size();i++)
        {
            SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            list.get(i).setSubmit_code_length(list.get(i).getSubmit_code_length()+"b");
            list.get(i).setSubmit_memory(list.get(i).getSubmit_memory()+"kb");
            list.get(i).setSubmit_time(list.get(i).getSubmit_time()+"ms");
            try {
                Date date = fmt.parse(list.get(i).getSubmit_date());
                String s = fmt.format(date);
                list.get(i).setSubmit_date(s);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        int total = mapper.selectTotalCount(user_id);
        int TOT = mapper.selectRecordsFiltered(params);
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(TOT);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }
}
