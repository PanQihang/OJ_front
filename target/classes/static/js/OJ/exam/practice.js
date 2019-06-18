

/*
对题目集的后台分页(数据库分页)
 */


var problemListBackup; //题目集的本地备份，用以减少服务器的压力

$(function(){
    //testFun();
    init();
})
function init(){
    getProblemTypeList();
    getProblemList();
    getSystemSimpleInf();
}
function testFun(){
    var result=[
        /*{'proId':'666',
            'proName':'红黑树',
            'proDifficulty':'5',
            'proAcNum':'18',
            'proSubNum':'45',
            'AcState':'unknow'},
        {'proId':'310',
            'proName':'鸡兔同笼',
            'proDifficulty':'1',
            'proAcNum':'53',
            'proSubNum':'75',
            'AcState':'true'}*/
    ]
    loadProblemList(result);
    result =[{typeAName:"全部题目",
        typeBList:[]
    }, {
        typeAName: "数据结构",
        typeBList: [
            {typeBName: "链表", typeBId: "210"},
            {typeBName: "图", typeBId: "211"},
            {typeBName: "二叉树", typeBId: "212"}
        ]
    },{
        typeAName: "基础算法",
        typeBList: [
            {typeBName: "冒泡循环", typeBId: "310"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"},
            {typeBName: "字符串比较", typeBId: "311"},
            {typeBName: "递归运算", typeBId: "312"}
        ]
    }]
    loadProblemTypeList(result);
    result={
        'problemAmount':'613',
        'tryProblemAmount':'546',
        'finishProblemAmount':'543',
        'systemRank':'3'
    }
    loadSystemSimpleInf(result);
}

//加载显示题目列表
function getProblemList(){
    $.ajax({
        type: "POST",
        url: "/practice/getProblemList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
        }),
        success:function (result) {
            problemListBackup = result;
            loadProblemList(result);
        }
    });
}
function loadProblemList(t){
    var i=0;
    for(;i<t.length;i++){ //每次交由前端零时生成Ac率，减少服务器压力
        console.log(t[i].proId+","+t[i].proAcNum+", "+t[i].proSubNum)
        if(0!=t[i].proSubNum) t[i]['proAcPercentage']=((t[i].proAcNum / t[i].proSubNum) * 100).toFixed(1)
        else t[i]['proAcPercentage'] = 0;
        if(t[i]['proAcPercentage']==0) t[i]['proAcPercentage']="0";
    }
    var dataTable = $('#problemList');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching":true,
        "serverSide": false,
        "bLengthChange": false,  //改变每页显示数量
        "iDisplayLength": 10,//每页显示10条数据
        "autoWidth" : false,

        "bSort": true,
        "order":[ 1, 'asc' ], //默认排序的依据
        "data" : t,
        "columns" : [{
            "data" : "AcState",
            "render":function (data, type, full, meta){
                //console.log(type+", "+ full+", "+ meta);
                //console.log(full); //full是当前整个单元的内容
                if('true'==data) return "<span class='label label-primary'>已解决</span>";
                if('false'==data) return  "<span class='label label-danger'>未解决</span>";
                if('unknow'==data) return  "<span class='label label-default'>未尝试</span>";
            }
        },{
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
                var str="";
                for(var i=0;i<data;i++)
                    str+=" <span class=\"glyphicon glyphicon-star\"></span>";
                return str;
            }
        }]
    });
    //$('#problemList td').css('padding', '0 3px 2px 2px')
}

//加载显示题目类型列表
function getProblemTypeList(){
    $.ajax({
        type: "POST",
        url: "/practice/getProblemTypeList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
        }),
        success:function (result) {
            loadProblemTypeList(result);
        }
    });
}
function loadProblemTypeList(t){
    new SelectColor({
        data:t
    });
}

//加载题库系统简要
function getSystemSimpleInf(){
    $.ajax({
        type: "POST",
        url: "/practice/getSystemSimpleInf",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
        }),
        success:function (result) {
            loadSystemSimpleInf(result);
        }
    });
}
function loadSystemSimpleInf(t){
    $('#problemAmount').text(t.problemAmount);
    $('#tryProblemAmount').text(t.tryProblemAmount);
    $('#finishProblemAmount').text(t.finishProblemAmount);
    $('#systemRank').text(t.systemRank);
}

//根据题目类型对本地题目集进行筛选
function filtrateProblemList(t){
    var temp = [];//problemListBackup;
    var i=0, j=0;
    if(-1!=t)
        for(;i<problemListBackup.length;i++){
            if(problemListBackup[i]['proTypeId']==t)
                temp[j++]=problemListBackup[i];
        }
    else temp=problemListBackup;
    //console.log(temp);
    loadProblemList(temp);
}

//跳转到指定题目的详细页面
function showProblemInf(tProId){
    //window.location.href="/practice/showProblemInf/"+t;
    window.open("/practice/showProblemInf?proId="+tProId+"&testId=0","_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求

}