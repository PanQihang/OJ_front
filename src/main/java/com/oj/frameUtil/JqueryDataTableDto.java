package com.oj.frameUtil;

import java.io.Serializable;

/**
 * Created by panqihang on 2019/5/6 15:52
 */
public class JqueryDataTableDto<T> implements Serializable {
    // 请求序号，前端传什么值就返回什么值
    private String draw;
    // 全部数据总条数
    private int recordsTotal;
    // 过滤后的总数(就是根据前端页面下拉框、搜索框等传参过来查询后的数据总数)
    private int recordsFiltered;
    private T data;

    public String getDraw() {
        return draw;
    }

    public void setDraw(String draw) {
        this.draw = draw;
    }

    public int getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(int recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public int getRecordsFiltered() {
        return recordsFiltered;
    }

    public void setRecordsFiltered(int recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

}
