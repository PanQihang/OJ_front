var testIP = true;
$(document).ready(function () {
    testIP = isTestEndTime();//设置能否查看代码
    index();
    getStatusInfo();
});

function index() {
    $.ajax({
        url: "/submitStatus/",
    })
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
var laguateType = [
    "未知语言类型", //0
    "C++", //1
    'C',//2
    'Java',//3
    'Python'//4
]
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    getStatusInfo();
}
function getStatusInfo() {
    var dataTable = $('#StatusInfoTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching" : false,
        "serverSide": true,
        "autoWidth": false,
        "processing": true,
        "ajax": {
            url: "/submitStatus/getSubmitStatusMaplist",
            type: "POST",
            data: {
                "problem_id" : $('#problemId').val(),
                "submit_state" : $('#submit_state').val(),
                "submit_language" : $('#submit_language').val()
            },
        },
        "bSort": false,
        "columns": [{
            "data": "problem_id"
        }, {
            "data": "name"
        }, {
            "data": "submit_state"
        }, {
            "data": "submit_language"
        }, {
            "data": "submit_time"
        }, {
            "data": "submit_memory"
        }, {
            "data": "submit_code_length"
        }, {
            "data": "submit_date"
        }
        ],
        "columnDefs": [{
            "render" : function(data, type, row) {
                debugger
                var a = "";
                if(undefined != stateCNList[row.submit_state]){
                    a = stateCNList[row.submit_state]
                }
                return a;
            },
            "targets" :2
        },{
            "render" : function(data, type, row) {
                var a = "";
                if(undefined != laguateType[row.submit_language]){
                    if(testIP)
                    {
                        a = '<a onclick="setCode(\''+escape(row.submit_code)+'\')" data-toggle=\'modal\' data-target=\'#myModal5\'>'+laguateType[row.submit_language]+'</a>'
                    }
                    else
                    {
                        a = "<a onclick='hints()'>"+laguateType[row.submit_language]+"</a>"
                    }
                }
                return a;
            },
            "targets" :3
        }]
    });

}
function  setCode(code) {
    $("#code").text(unescape(code));
}
function isTestEndTime(){
    var a=true;
    $.ajax({
        type: "POST",
        url: "/exam/getTestEndTime",
        async:false,
        dataType: "json",
        success: function (result) {
            if(result[0] != null)
                a = result[0].end < getNowTimeStamp();
        }
    })
    console.log(a)
    return a;
}

function hints(){
    swal({
        title: "考试中不能查看代码",
        text: "现在存在正在进行的考试，考试结束后可查看代码。"
    });
}
function format(time)
{
    return new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}



