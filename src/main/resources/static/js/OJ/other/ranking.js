$(document).ready(function () {
    index();
    getRanking1();
    getRanking();
});

function index() {
    $.ajax({
        url: "/ranking/",
    })
}
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
}

function getRanking() {
    var dataTable = $('#RankingInfoTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching" : false,
        "serverSide": true,
        "autoWidth": false,
        "processing": true,
        "ajax": {
            url: "/ranking/getRankingMaplist",
            type: "POST",
        },
        "bSort": false,
        "columns": [{
            "data": "rank"
        }, {
            "data": "name"
        }, {
            "data": "ac"
        }, {
            "data": "tot"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(\''+row.name+'\',\''+row.account+'\')">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}

function showEdit(name,account) {
    $("#dialogTitle").html("用户信息")
    $("#name").html("")
    $("#rank").html("")
    $("#aclv").html("")
    $("#Class").html("")
    $("#user_id").html("")
    $("#ac").html("")
    $("#nac").html("")
    document.getElementById("bb1").innerHTML = "";
    document.getElementById("bb2").innerHTML = "";
    document.getElementById("bb3").innerHTML = "";
    document.getElementById("bb4").innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
             "account" : account
        },
        success:function (result){
            console.log(result);
            $("#name").html(name)
            $("#rank").html(result.rank)
            $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
            $("#Class").html(result.class)
            $("#user_id").html(account)
            $("#ac").html("(Total:"+result.acCount+")")
            var insertText;
            var len = result.aclist.length;
            var s="";
            for(var i=0;i<len;i++)
            {
                insertText = result.aclist[i];
                s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }
            // document.getElementById("ac").innerHTML+=s;
            $("#ac").append(s)
            s="";
            $("#nac").html("(Total:"+result.nacCount+")")
            len = result.naclist.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.naclist[i];
                s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }

            // document.getElementById("nac").innerHTML+=s;
            $("#nac").append(s)
            s="";
            $("#bb1").html("(Total:"+result.bb1.length+")")
            len = result.bb1.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb1[i];
                s +=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }
            // document.getElementById("bb1").innerHTML+=s;
            $("#bb1").append(s)
            s="";
            $("#bb2").html("(Total:"+result.bb2.length+")")
            len = result.bb2.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb2[i];
                s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }
            // document.getElementById("bb2").innerHTML+=s;
            $("#bb2").append(s)
            s="";
            $("#bb3").html("(Total:"+result.bb3.length+")")
            len = result.bb3.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb3[i];
                s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }
            // document.getElementById("bb3").innerHTML+=s;
            $("#bb3").append(s)
            s="";
            $("#bb4").html("(Total:"+result.bb4.length+")")
            len = result.bb4.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb4[i];
                s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
            }
            // document.getElementById("bb4").innerHTML+=s;
            $("#bb4").append(s)
        }
    })
}

function search() {
    $("#dialogTitle").html("用户信息")
    var account = $("#searchid").val();
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
            "account" : account
        },
        success:function (result){
            if(result.message=="该学生存在")
            {
                $("#name").html(result.name)
                $("#rank").html(result.rank)
                $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
                $("#Class").html(result.class)
                $("#user_id").html(account)
                $("#ac").html("(Total:"+result.acCount+")")
                var insertText;
                var len = result.aclist.length;
                var s="";
                for(var i=0;i<len;i++)
                {
                    insertText = result.aclist[i];
                    s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("ac").innerHTML+=s;
                s="";
                $("#nac").html("(Total:"+result.nacCount+")")
                len = result.naclist.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.naclist[i];
                    s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("nac").innerHTML+=s;
                s="";
                $("#bb1").html("(Total:"+result.bb1.length+")")
                len = result.bb1.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb1[i];
                    s +=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("bb1").innerHTML+=s;
                s="";
                $("#bb2").html("(Total:"+result.bb2.length+")")
                len = result.bb2.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb2[i];
                    s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("bb2").innerHTML+=s;
                s="";
                $("#bb3").html("(Total:"+result.bb3.length+")")
                len = result.bb3.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb3[i];
                    s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("bb3").innerHTML+=s;
                s="";
                $("#bb4").html("(Total:"+result.bb4.length+")")
                len = result.bb4.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb4[i];
                    s+=" <a onclick='showProblemInf(\""+insertText+"\")'>"+insertText+"</a>";
                }
                document.getElementById("bb4").innerHTML+=s;
            }
            else if(result.message=="该学生不存在")
            {
                $("#user_id").html("该学生不存在")
            }
        }
    })
}
function getRanking1() {
    var dataTable = $('#RankingInfoTable1');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching" : false,
        "serverSide": true,
        "autoWidth": false,
        "processing": true,
        "ajax": {
            url: "/ranking/getRankingMaplist1",
            type: "POST",
        },
        "bSort": false,
        "columns": [{
            "data": "rank"
        }, {
            "data": "name"
        }, {
            "data": "ac"
        }, {
            "data": "tot"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(\''+row.name+'\',\''+row.account+'\')">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}

//跳转到指定题目的详细页面
function showProblemInf(tProId){
    //window.location.href="/practice/showProblemInf/"+t;
    window.open("/practice/showProblemInf?proId="+tProId+"&testId=0","_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求

}
