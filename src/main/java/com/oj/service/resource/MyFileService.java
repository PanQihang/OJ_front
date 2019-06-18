package com.oj.service.resource;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
/**
 * @author zt
 * @Time 2019年5月5日 11点47分
 * @Description 资源功能Service接口
 */
public interface MyFileService {
    public List<Map>getFileListByFlag(Map<String, String> param);
    //下载文件
    public void downloadFile(String id, HttpServletResponse response);
    //根据ID检查这个文件存不存在
    public boolean checkFileExistence(String id);
    //获取上传者
    public List<Map> getUploaderList();
}
