console.log(compinfo);
var dataTable = $('#proTable');
var status=$('#Table');
var rankTable=$('#rankTable');
var enrollTable=$('#enrollTable');
$(document).ready(function () {
    drawNavAct(2);
    loadres();
});
function proList(){
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "paging": false,
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "data" : compinfo.proList,
        "columns" : [{
            "data" : "pid"
        },{
            "data" :"name"
        },{
            "data":"score"
       }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                if(compinfo.compinfo.flag=='0'){
                    return row.name;
                }else{
                    a="";
                    a+='<a onclick="showpro('+row.pid+')">'+row.name+'</a>';
                    return a
                }
            },
             "targets" :1
        }]
});
}
function showpro(id) {
    console.log(id);
    window.open("/practice/showProblemInf?proId="+id+"&testId=" + compinfo.compinfo.id,"_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求

}
function loadres(){
    $('#title').html("");
    $('#title').html(compinfo.compinfo.name);
    $('#state').html("");
    $('#welcome').html("");
    $('#welcome').html("欢迎来到"+compinfo.compinfo.name);

    if(compinfo.compinfo.flag=='0'){
        $('#state').html("距离竞赛开始还有");
        setInterval(timecount,1000)
      Isenroll();
        enrollList()

    }else if(compinfo.compinfo.flag=='1'){
        $('#state').html("距离竞赛结束还有");
        setInterval(timecount,1000)
        proList();
        submitstat();
    }else{
        $('#state').html("本场竞赛已经结束");
        console.log(1);
        proList();
        rankList();
    }
}
var stateCNList = ['已提交,请等待…', //0
    '<font color="green">Accepted</font>', //1
    'PresentationError',//2 这个没用了
    'WrongAnswer',//3 这个没用了
    '<font color="red">RuntimeError</font>',//4
    '<font color="orangered">TimeLimitExceed</font>',//5
    '<font color="red">MemoryLimitExceed</font>',//6
    '<font color="red">SystemCallError</font>',//7
    'CompileError',//8
    'SystemError',//9 		以上为数据库提供
    '超时,到查看状态处查看',//10   		以下为异常错误
    '含违规字符',//11
    '无权提交',//12
    '未知错误，联系管理员'//13
]
function submitstat(){
    $.ajax({
        type: "POST",
        url: "/competition/submitStatus",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "tid":compinfo.compinfo.id
        }),
        success:function (result) {
            if ($.fn.dataTable.isDataTable(status)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "paging": true,
                "serverSide": false,
                "autoWidth": false,
                "bSort": false,
                "data": result,
                "columns": [{
                    "data": "problem_id"
                }, {
                    "data": "submit_state"
                }, {
                    "data": "time"
                }],
                "columnDefs": [{
                    "render": function (data, type, row) {
                        var b=""
                        if(undefined != stateCNList[row.submit_state]){
                            b = stateCNList[row.submit_state]
                        }
                         var a="";
                         a+='<a href="">'+b+'</a>'
                        return a;
                    },
                    "targets" :1
                },{
                    "render":function (data, type, row) {
                        return formatTime(row.time);
                    },
                    "targets":2
                }
                ]

        })
}
    })
}
function rankList(){
    $.ajax({
        type: "POST",
        url: "/competition/rankListbyId",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "id":compinfo.compinfo.id
        }),
        success:function (result) {
            console.log(result);
            if ($.fn.dataTable.isDataTable(rankTable)) {
                rankTable.DataTable().destroy();
            }
            var i=0;
            rankTable.DataTable({
                "paging": true,
                "serverSide": false,
                "autoWidth": false,
                "bSort": false,
                "data": result,
                "columns": [{
                    "data": "id"
                }, {
                    "data": "name"
                }, {
                    "data": "ac"
                }],
                "columnDefs": [{
                    "render": function (data, type, row) {
                        i++;
                        return i;
                    },
                    "targets" :0
                }]

            })
        }
    })
}
//是否报名
function Isenroll() {
    $.ajax({
        type: "POST",
        url: "/competition/Isenroll",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "test_id":compinfo.compinfo.id
        }),
        success:function (result) {
            var a="";
            if(result==1){
            a+='您已经报名<a class="btn btn-warning btn-rounded" onclick="deleteenroll()">取消报名</a> '
            }else{
                a+='您还未报名<a class="btn btn-warning btn-rounded" onclick="enroll()">报名</a> '
            }
            $('#enroll').html("");
        $('#enroll').append(a);
        }
    })
}
//取消报名
function deleteenroll(){
    swal({
            title: "确认要取消这次报名机会吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
    $.ajax({
        type: "POST",
        url: "/competition/deleteenroll",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "test_id":compinfo.compinfo.id
        }),
        success:function (result) {
            if(result==true) {
                var a = "";
                a += '您还未报名<a class="btn btn-warning btn-rounded" onclick="enroll()">报名</a> '
                $('#enroll').html("");
                $('#enroll').append(a);
                swal("取消报名成功！", "很遗憾不能与你一决高下", "success");
            }else{
                swal("取消报名失败！", "请联系管理员解决问题", "fail");
            }
            enrollList();
        }
  } )

    }})
}
//报名
function enroll(){
    swal({
            title: "确认要参加这次竞赛吗?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: "POST",
                    url: "/competition/enroll",
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8",
                    data:JSON.stringify({
                        "test_id":compinfo.compinfo.id
                    }),
                    success:function (result) {
                        if(result==true) {
                            var a = "";
                            a+='您已经报名<a class="btn btn-warning btn-rounded" onclick="deleteenroll()">取消报名</a> '
                            $('#enroll').html("");
                            $('#enroll').append(a);
                            swal("报名成功！", "请准时参加比赛", "success");
                        }else{
                            swal("报名失败！", "请联系管理员", "fail");
                        }
                        enrollList();
                    }
                } )

            }})
}
//报名表
function enrollList(){
    $.ajax({
        type: "POST",
        url: "/competition/enrollList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "test_id":compinfo.compinfo.id
        }),
        success:function (result) {
            console.log(result);
            if ($.fn.dataTable.isDataTable(enrollTable)) {
                enrollTable.DataTable().destroy();
            }
            var i=0;
            enrollTable.DataTable({
                "paging": true,
                "serverSide": false,
                "autoWidth": false,
                "bSort": false,
                "data": result,
                "columns": [{
                    "data": "id"
                }, {
                    "data": "name"
                }],
                "columnDefs": [{
                    "render": function (data, type, row) {
                        i++;
                        return i;
                    },
                    "targets" :0
                }]

            })
        }
    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}
   function timecount()
    {
        //当前日期
        var dateNow=new Date();

        //结束日期
        var start=compinfo.compinfo.start;
        var end=compinfo.compinfo.end;
        var datestart=new Date(start);
        var dateEnd=new Date(end);

        if(datestart> dateNow){
            dateEnd=datestart;
        }

        //设置结束年份
        //dateEnd.setFullYear(parseInt(2015));
        //设置结束月份
        //dateEnd.setMonth(parseInt(07)-1);
        //设置结束日期
        //dateEnd.setDate(parseInt(1));
        //设置结束的时分秒
        //dateEnd.setHours(0);
        //dateEnd.setMinutes(0);
        //dateEnd.setSeconds(0);
        console.log(start,end)
        //总时间间隔
        var lengthTime=(dateEnd.getTime()-dateNow.getTime())/1000;
        var dates=parseInt(lengthTime/(24*3600));
        lengthTime=lengthTime%(24*3600);
        var hours=parseInt(lengthTime/3600).toString();
        lengthTime=lengthTime%3600;
        var iMinutes=parseInt(lengthTime/60).toString();

        var iSecends=parseInt(lengthTime%60).toString();
        //console.log(dates+'天'+hours+'小时'+iMinutes+'分钟'+iSecends+'秒');

        $('#block').html(dates+'天'+hours+'小时'+iMinutes+'分钟'+iSecends+'秒');
    }

    //开定时器。

    //timecount();

