package com.oj.controller.resource;

import com.oj.service.resource.MyFileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zt
 * @Time 2019年5月5日 11点44分
 * @Description 资源controller类
 */

@Controller
@RequestMapping("/resource")
public class MyFileController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MyFileService myfileService;

    //返回文件列表页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "resource/myFile";
    }

    @RequestMapping("/getFileListByFlag")
    @ResponseBody
    public List<Map>getFileListByFlag(HttpServletRequest request, @RequestBody Map<String, String> param)
    {
        String user_id = request.getSession().getAttribute("user_account").toString();
        //System.out.println(user_id + " and " + request.getParameter("flag"));
        param.put("user_id", user_id);
        List<Map> list = myfileService.getFileListByFlag(param);
        return list;
    }
    @RequestMapping("/getUploaderList")
    @ResponseBody
    public List<Map> getUploaderList()
    {
        List<Map>list = myfileService.getUploaderList();
        System.out.println("list "+list.toString());
        return list;
    }

    @GetMapping("/downloadFile")
    @ResponseBody
    public void downloadFile(HttpServletRequest request, HttpServletResponse response)
    {
        String id = request.getParameter("id");
        System.out.println("id : " + id);
        myfileService.downloadFile(id, response);
    }
    @PostMapping("/checkFileExistence")
    @ResponseBody
    public Map<String, String>checkFileExistence(HttpServletRequest request) {
        System.out.println("come in check");
        Map<String, String> map = new HashMap<>();
        if (myfileService.checkFileExistence(request.getParameter("id"))) {
            map.put("flag", "1");
            return map;
        } else {
            map.put("flag", "0");
            return map;
        }
    }
}
