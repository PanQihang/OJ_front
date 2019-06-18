package com.oj.service.serviceImpl.system;

import com.oj.entity.system.Auth;
import com.oj.mapper.system.AuthMapper;
import com.oj.mapper.system.IndexMapper;
import com.oj.service.system.AuthService;
import com.oj.service.system.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年5月13日 14点54分
 * @Description 首页相关业务service接口实现类
 */
@Service
public class IndexServiceImpl implements IndexService {

    @Autowired(required = false)
    private IndexMapper indexmapper;

    @Override
    public List<Map> getJxtzList() {
        return indexmapper.getJxtzList();
    }

    @Override
    public Map getJxtzById(String id) {
        return indexmapper.getJxtzById(id);
    }

    @Override
    public List<Map> getReToDo(String classId, String studentId) {
        return indexmapper.getReToDo(classId, studentId);
    }

    @Override
    public List<Map> getRecommandList(String user_id) {
        return indexmapper.getRecommandList(user_id);
    }
}
