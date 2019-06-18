

/*
对题目集的后台分页(数据库分页)
 */



var dataTableDraw = 0; //datatable进行分页请求需要
var problemType = -1; //默认全部题目为-1
var problemListCondition = {  //题目集中题目匹配的条件
    proId : '', //题目关键字(精确搜索）
    proName : '', //题目名称（模糊搜索）
    proDifficultyType : 0, //难度指标[0:所有题目、1:入门、2:容易、3:普通、4:困难、5:超难]
    proType : -1, //题目的类型
    specialProblemListType : 1 //题目集的搜索范围[1:所有题目、2:已尝试的题目集、3:已解决的题目集、4:未解决的题目集]
}

$(function(){
    drawNavAct(1);
    //testFun();
    init();
    $('#selectProblemType').trigger('onclick')
    $('#selectProblemType').click();
    $('#selectProblemType').trigger('click')
    document.getElementById('selectProblemType').click();



})
//初始化函数
function init(){
    getProblemTypeList();
    loadProblemList();
    getSystemSimpleInf();
}
//单独的前端页面测试调用 ----------------- 开发过程用的测试调用
function testFun(){



    var result=[
        {'proId':'666',
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
            'AcState':'true'}
    ]
    var dataTable = $('#problemList');
    dataTable.callback(result);

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

//请求并加载显示题目列表
function loadProblemList(){
    var dataTable = $('#problemList');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching":false,
        'serverSide': true, //启用服务器端分页
        "bPaginate" : true, //是否显示（应用）分页器
        'pagingType': "simple_numbers", //分页样式：
        "bLengthChange": false,  //改变每页显示数量
        "iDisplayLength": 21,//每页显示10条数据
        "autoWidth" : false,
        "bSort": false,
        ajax: function (data, callback, settings) {
            //封装请求参数
            var param = problemListCondition;
            param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码
            $.ajax({
                type: "POST",
                url: "/practice/getPagingProblemList",
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                data:JSON.stringify(param),
                cache: false, //禁用缓存
                success: function (result) {
                    setTimeout(function (){
                        var t = result.data;
                        for(var i=0;i<t.length;i++){ //每次交由前端零时生成Ac率，减少服务器压力
                            if(0!=t[i].proSubNum) t[i]['proAcPercentage']=((t[i].proAcNum / t[i].proSubNum) * 100).toFixed(1)
                            else t[i]['proAcPercentage'] = 0;
                            if(t[i]['proAcPercentage']==0) t[i]['proAcPercentage']="0";
                        }
                        dataTableDraw++;
                        var returnData = {};
                        returnData.draw = dataTableDraw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                        returnData.recordsFiltered = result.recordsFiltered;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data;//返回的数据列表
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        $('#problemList td').css('padding', '0 3px 2px 2px')
                    }, 0);
                }
            });
        },
        "columns" : [{
            "data" : "AcState",
            "render":function (data, type, full, meta){
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
                var str=""; data=5-data+1;
                for(var i=0;i<data;i++)
                    str+=" <span class=\"glyphicon glyphicon-star\" style='color:#efc63b;'></span>";
                return str;
            }
        }]
    });
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


//跳转到指定题目的详细页面
function showProblemInf(tProId){
    //window.location.href="/practice/showProblemInf/"+t;  //该调用对应操作位当前页面重定向
    window.open("/practice/showProblemInf?proId="+tProId+"&testId=0","_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求
}

//
var ArgOfProName = $('#argOfProName');
var ArgOfProId = $('#argOfProId');
var ArgOfProDifficulty = $('#argOfProDifficulty');
var ArgOfProType = $('#problemType');
var proListName = $('#problemListName');
//重置搜索条件，并且执行搜索请求
function resetSearchArg(){
    ArgOfProDifficulty.val("0");
    ArgOfProId.val("");
    ArgOfProName.val("");
    ArgOfProType.val("全部题目"); problemType=-1;
    searchProblemList();
}
//请求指定条件的题目集
function searchProblemList(){
    var temp;
        problemListCondition.proId = ArgOfProId.val() //题目关键字(精确搜索）
        problemListCondition.proName =  ArgOfProName.val() //题目名称（模糊搜索）
        problemListCondition.proDifficultyType =  ArgOfProDifficulty.val() //难度指标
        problemListCondition.proType =  problemType //题目的类型
    console.log(problemListCondition);
    loadProblemList();
}
//显示特定题目集
function  showTargetProblemList(t){
    problemListCondition.specialProblemListType = t;
    var temp = ['', '所有题', '已尝试题集', '已解决题集', '未解决题集'];
    //console.log(t+temp[t]);
    proListName.text(temp[t]);
    resetSearchArg();
}