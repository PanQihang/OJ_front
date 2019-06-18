/*
    题库区的题目请求调用以及显示数据的调用

 */
initPracticeArea();
function initPracticeArea(){
    requestNewestProList();
}
function testPracticeAreaFun(){
    var testData = [
        {proId:310, proName:"测试题目1", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:311, proName:"测试题目2", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:312, proName:"测试题目3", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:313, proName:"测试题目4", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:314, proName:"测试题目5", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:315, proName:"测试题目6", proAcPercentage:"0.85", proDifficulty:4}
        ,{proId:316, proName:"测试题目7", proAcPercentage:"0.85", proDifficulty:4}
    ]
    loadNewestProList(testData);
}

//请求最新的题目集合
function requestNewestProList(){
    $.ajax({
        type: "POST",
        url: "/index/getNewestProblemList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({}),
        success:function (result) {
            loadNewestProList(result);
        }
    });
}
//将给定的题目集合加载到页面
function loadNewestProList(t){
    for(var i=0;i<t.length;i++){ //每次交由前端零时生成Ac率，减少服务器压力
        if(0!=t[i].proSubNum) t[i]['proAcPercentage']=((t[i].proAcNum / t[i].proSubNum) * 100).toFixed(1)
        else t[i]['proAcPercentage'] = 0;
        if(t[i]['proAcPercentage']==0) t[i]['proAcPercentage']="0";
    }
    var dataTable = $('#problemList_wrapper');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching":false,
        "bLengthChange": false,  //改变每页显示数量
        "iDisplayLength": 10,//每页显示10条数据
        "autoWidth" : false,
        "bSort": false,
        "paging": false,   //禁止分页
        "info": false, //去除底部栏信息显示
        "data":t,
        "columns" : [{
            "data" : "proId",
            "render":function(data, type, full, meta){
                return "<span >"+data+"</span>";
            }
        },{
            "data" :"proName",
            "render":function(data, type, full, meta){
                return "<a onclick='showProblemInf(\""+full['proId']+"\")'><span style='font-weight:bold; font-size:15px; '>"+data+"</span></a>";
            }
        },{
            "data" : "proAcPercentage",
            "render":function(data){
                return "<small>"+data+"%</small>\n" +
                    "<div class=\"progress progress-mini\">" +
                    "<div style=\"width: "+data+"%;\" class=\"progress-bar\"></div></div>";
            }
        },{
            "data" : "proDifficulty",
            "render":function (data) {
                var str=""; data=5-data+1;
                for(var i=0;i<data;i++)
                    str+=" <span class=\"glyphicon glyphicon-star\" style='color:#efc63b;'></span>";
                return str;
            }
        }]
    });
    var temp = dataTable.next();
    temp.css("text-align", "center")
    temp.css("margin-bottom", "0px")
    temp.css("margin-top", "0px")
    $('#problemList_wrapper_wrapper').css("padding-bottom", "10px")
    var str = '<a onclick="openPage(\'/practice/\')"><sprn style="font-size:15px; margin-top:8px;">查看更多</sprn></a>'
    temp.html(str)

}
//跳转到指定题目的详细页面
function showProblemInf(tProId){
    //window.location.href="/practice/showProblemInf/"+t;  //该调用对应操作位当前页面重定向
    //window.open("/practice/showProblemInf?proId="+tProId+"&testId=0","_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求
    openPage("/practice/showProblemInf?proId="+tProId+"&testId=0");
}
