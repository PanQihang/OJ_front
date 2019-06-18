var problemTable = $("#problems");
var submitTable = $("#submit");
var tid = getParam("id");
var setedTestInfo = false;
var setedProblemInfo = false;
var testIP = true;
$(document).ready(function () {
    //testIP = isTestEndTime();//设置能否查看代码
    $("#code").height($(window).innerHeight() * 0.75)
    getSubmitType();
   // getUserIP(function(ip){
        getInfo();
        if(getParam("isSaveIp") !="undefined"){
            drawNavAct(4);
            $("#breadList").html("考试列表");
            $("#breadList").attr("href","/exam/")
            $("#breadDetail").html("考试");
        }else{
            drawNavAct(3);
        }
        getParam("isSaveIp") == 1 ? savaFirstIP(getParam("id")) : null;
   // });

});

function getInfo(){
    $.ajax({
        type: "POST",
        url: "/experiment/getSubmitState",
        dataType: "json",
        async: false,
        contentType: "application/json;charset=UTF-8",//指定消息请求类型
            data:JSON.stringify({
                "id" : $('#problemId').val(),
                "name" : $('#problemName').val(),
                "submit" : $('#submitState').val(),
                "tid" : tid
            }),
        success:function (result) {

            //console.log(result)
            var list_map = new Array();
            var list_map_submit = new Array();
            var problemsId = new Array();
            var score = new Array();
            var pName = new Array();
            var isAC = new Array();
            var pNum = -1;
            var ACNum = 0;
            var submitNum = 0;
            $.each(result,function(index,value){
                value.submit_date = formatTime(value.submit_date)
                if(problemsId.indexOf(value.id) == -1){
                    pNum++;
                    problemsId[pNum] = value.id;
                    pName[pNum] = value.name;
                    score[pNum] = value.score;
                    isAC[pNum] = false;
                }
                var idIndex= problemsId.indexOf(value.id)
                if(value.submit_state == "Accepted" && idIndex != -1 ){
                    isAC[idIndex] = true;
                }
                if(value.submit_state != null && value.score != null){
                    list_map_submit.push({id: value.id,name: value.name,state: value.submit_state,memory:value.submit_memory + "kb",language:value.submit_language,time:value.submit_time + "ms",submitTime:value.submit_date,length:value.submit_code_length + "b",code:value.submit_code})
                    submitNum++;
                }
            })
            setSubmitInfo(list_map_submit,tid);
            if(!setedProblemInfo){
                for ( var i = 0; i < problemsId.length; i++) {
                    list_map.push({id: problemsId[i], name: pName[i], isAc: isAC[i],score:score[i]});
                }
                setProblemsInfo(list_map,tid);
                //setedProblemInfo = true;
            }
            if(!setedTestInfo){
                for(var i = 0; i <= isAC.length; i++){
                    if(isAC[i] == true){
                        ACNum++;
                    }
                }
                setTestInfo(tid,((ACNum /++pNum) * 100).toFixed(2)) ;
                setedTestInfo = true;
            }
        }
    })
}

function getSubmitType(){
    // $.ajax({
    //     type: "POST",
    //     url: "/experiment/getSubmitType",
    //     dataType: "json",
    //     success:function (result) {
    //         $.each(result,function(index,value){
    //             var submitType = "<option value=\""+ value.id + "\" >" + value.state_name +"</option>"
    //             $("#submitState").append(submitType);
    //         })
    //     }
    // })
    var submitType = "<option value=\"1\">Accepted</option>\n" +
        "                                                                                    <option value=\"2\">PresentationError</option>\n" +
        "                                                                                    <option value=\"3\">WrongAnswer</option>\n" +
        "                                                                                    <option value=\"4\">RuntimeError</option>\n" +
        "                                                                                    <option value=\"5\">TimeLimitExceed</option>\n" +
        "                                                                                    <option value=\"6\">MemoryLimitExceed</option>\n" +
        "                                                                                    <option value=\"7\">SystemCallError</option>\n" +
        "                                                                                    <option value=\"8\">CompileError</option>\n" +
        "                                                                                    <option value=\"9\">SystemError</option>\n" +
        "                                                                                    <option value=\"10\">ValidateError</option>\n" +
        "                                                                                    <option value=\"11\">含违规字符</option>"
    $("#submitState").append(submitType);
}

function setTestInfo(id,progress){
    $("#status").html(getParam("testState")== 0 ? "已结束" : "正在进行");
    $("#status").addClass(getParam("testState")== 0 ? "label-danger" : "label-primary");
    progress += "%"
    $("#progress").html(progress);
    $("#progrocessBar").css("width", progress);
    $.ajax({
        type: "POST",
        url: "/experiment/getTestDetail",
        dataType: "json",
        data:{
            "tid" : id
        },
        success:function (result) {
            $("#experName").html(result[0].name);
            $("#description").html(result[0].description);
            $("#admin").html(result[0].admin);
            $("#end").html(formatTime(result[0].end));
            $("#start").html(formatTime(result[0].start));
            //console.log()
            // if(getParam("isSaveIp") != "undefined" &&getParam("testState") == 1 &&result[0].only_ip == "on" && result[0].is_ip == "on" ){
            //     $.ajax({
            //         type: "POST",
            //         url: "/exam/getTestIp",
            //         dataType: "json",
            //         data:{
            //             "tid" : id
            //         },
            //         success:function (result) {
            //             var ipArray = new Array();
            //             for(var i = 0; i< result.length; i++){
            //                 if(result[i].ip.charAt(result.length - 1) == '.')
            //                     result[i].ip = result[i].ip.substring(0,length - 1);
            //                 ipArray[i] = result[i].ip;
            //                 console.log("允许进入考试的ip段:" + result[i].ip)
            //             }
            //             console.log("用户ip：" + ip)
            //             if(!checkIP(ip,ipArray)){
            //                 hint();
            //             }
            //         }
            //     })
            // }
        }
    })
}

function setProblemsInfo(result,testId) {
    console.log(result)
    var testState = getParam("testState");
    var dataTable = $("#problems");
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "data" : result,
        "columns" : [{
            "data" : "id"
        },{
            "data" : "name"
        },{
            "data" : "score"
        },{
            "data" : "isAC",
            "defaultContent" : "NA"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                return testState == 0&&(getParam("isSaveIp")!="undefined") ? "<td>" + row.id + "</td>" : "<td ><a style=\"color:grey;\" onclick='getProblem(\""+row.id+"\",\""+testId+"\")'>" + row.id + "</a></td>";
            },
            "targets" :0
        },{
            "render" : function(data, type, row) {
                return testState == 0&&(getParam("isSaveIp")!="undefined") ? "<td>" + row.name + "</td>" : "<td ><a style=\"color:grey;\" onclick='getProblem(\""+row.id+"\",\""+testId+"\")'>" + row.name + "</a></td>";
            },
            "targets" :1
        },{
            "render" : function(data, type, row) {
                var success =  "<td><span class=\"label label-primary\"><i class=\"fa fa-smile-o\"></i>AC</span> </td>";
                var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>NA</span></td>"
                return row.isAc == true ? success : wrong;
            },
            "targets" :3
        }, {
                "render" : function(data, type, row) {
                    var problemItem = testState == 0&&(getParam("isSaveIp")!="undefined") ? "<td class=\"project-actions\"> <a class=\"btn btn-white btn-sm\"><i class=\"fa fa-folder\"></i> 查看 </a></td>" :"<td class=\"project-actions\"> <a  onclick='getProblem(\""+row.id+"\",\""+testId+"\")' class=\"btn btn-white btn-sm\"><i class=\"fa fa-folder\"></i> 查看 </a></td>";
                  // console.log((getParam("isSaveIp")=="undefined"))
                    return problemItem;
                },
                "targets" :4
            }],


    });

    // problemTable.empty();
    // for(var i = 0; i < id.length; i++){
    //     var problemItem = "<tr>";
    //     problemItem += testState == 0 ? "<td>" + id[i] + "</td>" : "<td ><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + id[i] + "</a></td>";
    //     problemItem += testState == 0 ?"<td>" + name[i] + "</td>"  : "<td><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + name[i] + "</a></td>";
    //     var success =  "<td><span class=\"label label-primary\"><i class=\"fa fa-smile-o\"></i>AC</span> </td>";
    //     var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>NA</span></td>";
    //     problemItem += isAC[i] == 1 ? success : wrong;
    //     problemItem += testState == 0 ? "<td class=\"project-actions\"> <a class=\"btn btn-white btn-sm\"><i class=\"fa fa-folder\"></i> 查看 </a></td>\";" :"<td class=\"project-actions\"> <a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")' class=\"btn btn-white btn-sm\"><i class=\"fa fa-folder\"></i> 查看 </a></td>";
    //     //problemItem += "<td class='project-actions' onclick='setId(\""+id[i]+"\")'data-toggle='modal' data-target='#myModal5' href='problemDetails'><i class=\"fa fa-folder\"></i> 查看 </td>"
    //     problemItem += "</tr>";
    //     problemTable.append(problemItem);
    // }
}

function setSubmitInfo(result,testId){
    console.log(result)
    var testState = getParam("testState")
    var dataTable = $("#submit");
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "data" : result,
        "columns" : [{
            "data" : "id",
        },{
            "data" : "name",
        },{
            "data" : "state",
        },{
            "data" : "language",
        },{
            "data" : "time",
        },{
            "data" : "memory",
        },{
            "data" : "length",
        },{
            "data" : "submitTime",
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                // console.log("----------------------------")
                // console.log(testIP)
                if(testIP)
                    var submitItem = "<td class=\"project-actions\"> <a class=\"btn btn-white btn-sm\" onclick='setCode(\""+escape(row.code)+"\")' data-toggle='modal' data-target='#myModal5'><i class=\"fa fa-folder\"></i> 查看 </a></td>";
                else
                    submitItem = "<td class=\"project-actions\"> <a class=\"btn btn-white btn-sm\" onclick='hints()' '><i class=\"fa fa-folder\"></i> 查看 </a></td>";
                return submitItem;
            },
            "targets" :8
        },{
            "render" : function(data, type, row) {
                var success ="<td><span class=\"label label-primary\"><i class=\"fa fa-smile-o\"></i>AC</span> </td>";
                var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>" + row.state + "</span></td>";
                return row.state == "Accepted" ? success : wrong;
            },
            "targets" :2
         }
         //, {
        //     "render": function (data, type, row) {
        //         if(testIP)
        //             var submitItem = "<td> <a style=\"color:grey;\" click='setCode(\""+escape(row.code)+"\")' data-toggle='modal' data-target='#myModal5'>" + row.language +"</a></td>";
        //         else
        //             submitItem = "<td> <a style=\"color:grey;\" onclick='hints()' '>+row.language+</a></td>";
        //         return submitItem;
        //         return testState == 0 && (getParam("isSaveIp") != "undefined") ? "<td>" + row.id + "</td>" : "<td ><a style=\"color:grey;\" onclick='getProblem(\"" + row.id + "\",\"" + testId + "\")'>" + row.id + "</a></td>";
        //     },
        //     "targets": 3
        // }
            ,{
            "render" : function(data, type, row) {
                return testState == 0&&(getParam("isSaveIp")!="undefined") ? "<td>" + row.id + "</td>" : "<td ><a style=\"color:grey;\" onclick='getProblem(\""+row.id+"\",\""+testId+"\")'>" + row.id + "</a></td>";
            },
            "targets" :0
        },{
            "render" : function(data, type, row) {
                return testState == 0&&(getParam("isSaveIp")!="undefined") ? "<td>" + row.name + "</td>" : "<td ><a style=\"color:grey;\" onclick='getProblem(\""+row.id+"\",\""+testId+"\")'>" + row.name + "</a></td>";
            },
            "targets" :1
        }]
    });
//     var submitItem = "<tr>";
//     var success ="<td><span class=\"label label-primary\"><i class=\"fa fa-check\"></i>AC</span> </td>";
//     var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>" + state + "</span></td>";
//     submitItem += testState == 0 ? "<td>" + id + "</td>" : "<td ><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + id[i] + "</a></td>";
//     submitItem += testState == 0 ?"<td>" + name + "</td>"  : "<td><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + name[i] + "</a></td>";
//     submitItem += state == "Accepted" ? success : wrong;
//     submitItem += "<td>" + language + "</td>";
//     submitItem += "<td>" + time+ "ms</td>";
//     submitItem += "<td>" +memory + "kb</td>";
//     submitItem += "<td>" + length + "b</td>";
//     submitItem += "<td>" + formatTime(submitTime) + "</td>";
// // <button type='button' class='btn btn-primary' onclick='setId(\""+row.id+"\")'data-toggle='modal' data-target='#myModal5' href='problemDetails' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;详情</button>"
//     submitItem += "<td class=\"project-actions btn btn-white btn-sm>\" onclick='setCode(\""+escape(code)+"\")' data-toggle='modal' data-target='#myModal5'><i class=\"fa fa-folder\"></i> 查看 </a></td>";
//     submitItem += "</tr>";
//     submitTable.append(submitItem);
}

//获取url中的参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//将时间戳转换为正常时间格式
function formatTime(timeStamp) {
    var date = new Date(timeStamp*1000);
    var  Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var  D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var  m = date.getMinutes() + ':';
    var  s = date.getSeconds();
    return (Y+M+D+h+m+s);
}

function  setCode(code) {
    $("#code").text(unescape(code));
}

//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    $("#b1").val("查 询");
    $("#b2").val("重 置");
    getInfo();
}

// //设置题目详情页的id，用于获取数据
// function setId(id){
//     //$('#proid').val(id);
//     window.open("/practice/showProblemInf?proId="+id+"&proAcPercentage="+0+"&proAcNum="+0+"&proSubNum="+0,"_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求
//
// }

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs

    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


//将初次登陆考试的ip进行记录
function savaFirstIP(tid){
    $.ajax({
        type: "POST",
        url: "/exam/recordIP",
        dataType: "json",
        data:{
            "tid" : tid,
        },
        success: function (result) {
            if(result.flag == 1 ){
            }else{
                swal("登入失败！", result.message, "error");
            }
        }
    })
}

//如果用户登陆ip不符合，弹出提示窗
function hint(){
    swal({
        title: "考试地址错误！",
        type: "error",
        text: "请按照老师要求到指定机房进行考试",
        confirmButtonText:"确认",
    },function (isConfirm) {
        if(isConfirm)
            window.location.href="/exam/";
    });
}

//获取题目信息
function getProblem(id,testId){
    window.open("/practice/showProblemInf?proId="+id+"&testId=" + testId,"_blank"); //从用户的使用逻辑上减轻服务器负担（既保留原题目集页面，可以一定程度上减少用户对服务器的请求
}

function hints(){
    swal({
        title: "考试中不能查看代码",
        text: "现在存在正在进行的考试，考试结束后可查看代码。"
    });
}


