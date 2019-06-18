$(function() {
    drawNavAct(0);
    darwJxtztb();
    darwDzlbtb();
    darwTktjtb();
    darwBrACphb();
    blocks();
    Copmlist();
    CompRank();
});

//加载教学通知信息方法
function darwJxtztb() {
    $.ajax({
        type: "POST",
        url: "/index/getJxtzList",
        dataType: "json",
        success: function (result) {
            debugger
            var s = "";
            for (var i=0; i<result.length; i++){
                s += '<tr><td class="project-title">'
                s += '<a onclick="openJxtzById(\''+result[i].id+'\')">'+result[i].author+'－'+result[i].title+'</a><br>'
                s += '<small>创建于 '+result[i].time+'</small></td></tr>'
            }
            $("#jxtztb").append(s)
        }
    });
}

//加载教学通知弹窗信息方法
function openJxtzById(id) {
    $.ajax({
        type: "POST",
        url: "/index/getJxtzById",
        data:{
            id:id
        },
        dataType: "json",
        success: function (result) {
            $("#jxtzDialogTitle").html(result.title);
            $("#jxtzDialogZuoZhe").html(result.author);
            $("#jxtzDialogCjsj").html(result.time);
            $("#jxtzDialogTznr").html(result.content);
            $('#jxtzDialog').modal('show');
        }
    });
}

//加载待做列表table
function darwDzlbtb() {
    if($("#dzlbTb").length>0){
        $.ajax({
            type: "POST",
            url: "/index/getReToDo",
            dataType: "json",
            success: function (result) {
                debugger
                if(result.length > 0){
                    console.log(result)
                    var exams = new Array();
                    $.each(result,function(index,value){
                        if(value.kind == 2){
                            var experItem = setExperItem(value.id,value.name,value.start,value.end);
                            $("#dzlbTb").append(experItem);
                        }else{
                            exams.push({id:value.id,name:value.name,start:value.start,end:value.end,is_ip:value.is_ip,only_ip:value.only_ip,first_ip:value.first_ip});
                        }
                    })
                    var result =  examIsShow(exams,userIp);
                    $.each(result,function(index,value){
                        $("#dzlbTb").append(value);
                    })

                    // var s = '';
                    // s += '<table class="table table-hover"><tbody>';
                    // for (var i=0; i< result.length; i++){
                    //     s += '<tr><td class="project-status">';
                    //     //若当前时间大于等于开始时间为进行中
                    //     if (new Date() >= new Date(result[i].start)){
                    //         s+='<span class="label label-primary">进行中</span>'
                    //     }else{
                    //         s+='<span class="label label-warning-light">未开始</span>'
                    //     }
                    //     s += '</td><td class="project-title"><a>'+result[i].name+'</a><br>';
                    //     s += '<small>开始时间:'+result[i].start+'&nbsp;&nbsp;&nbsp;</small>';
                    //     s += '<small> 结束时间:'+result[i].end+'</small></td></tr>';
                    // }
                    // s += '<tbody></table>';
                    //
                    //  $("#dzlbTb").append(s)
                    drawOverFlow("dzlbTb");
                }else{
                    $("#dzlbTb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
                }
            }
        });
    }
}


function darwTktjtb() {
    if($("#tktjTb").length>0){
        $.ajax({
            type: "POST",
            url: "/index/getRecommandList",
            dataType: "json",
            success: function (result) {
                debugger
                if(result.length > 0){
                    var s = '';
                    s += '<table class="table table-hover"><tbody>';
                    for (var i=0; i< result.length; i++){
                        s += '<tr><td class="project-title">'+result[i].pid+'</td><td class="project-title">';
                        s += '<a onclick="openJxtzById(\'\')">'+result[i].p_name+'</a>'
                        s += '</td></tr>';
                    }
                    s += '<tbody></table>';

                    $("#tktjTb").append(s)
                    drawOverFlow("tktjTb");
                }else{
                    $("#tktjTb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
                }
            }
        });
    }
}
function darwBrACphb() {
    $.ajax({
        type: "POST",
        url: "/index/getRankPerDayFromRedis",
        dataType: "json",
        success: function (result) {
            debugger
            if(result.length > 0){
                var s = '<table class="table table-hover"><thead><tr>';
                s += '<th>排名</th><th>姓名</th><th>学号</th><th>班级</th><th>A题数量</th>';
                s += '</tr></thead><tbody>';
                for (var i=0; i< result.length; i++){
                    s += '<tr>';
                    s += '<td>'+(i+1)+'</td>';
                    s += '<td>'+result[i].userName+'</td>';
                    s += '<td>'+result[i].userAccount+'</td>';
                    s += '<td>'+result[i].userClassName+'</td>';
                    s += '<td>'+result[i].userACProblems.length+'</td>';
                    s += '</tr>';
                }
                s += '</tbody></table>';

                $("#brACphb").append(s)
                drawOverFlow("brACphb");
            }else{
                $("#brACphb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
            }
        }
    });
}


//通过标签ID动态添加纵向滚动条
function drawOverFlow(tagId) {
    if ($("#"+tagId).parent().height() < $("#"+tagId).height()){
        $("#"+tagId).parent().css("overflow","scroll");
        $("#"+tagId).parent().css("overflow-x","hidden");
    }
}
function blocks() {
    $.ajax({
        type:"POST",
        url: "/index/getPostFlagList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function(result) {
            debugger
            var end=3
            if(end>result.length){
                end=result.length
            }

            var newTest="";
            for(var i=0;i<end;i++){
                newTest+=' <div class="row">\n' +
                    '                        <div class="col-sm-9">\n' +
                    '                            <div class="forum-icon">\n' +
                    '                                <i class="fa fa-clock-o"></i>\n' +
                    '                            </div>\n' +
                    '                            <a onclick="openPage(\'/discussion/showarticle/'+result[i].id+'/'+result[i].name+'/'+result[i].sub_id+'\''+')" class="forum-item-title">'+result[i].title+
                    '                                    <b class="btn btn-primary btn-xs">置顶</b>                                        </a>\n' +
                    '                            <div class="forum-sub-title">'+result[i].content.replace(/<[^>]+>/g,"").substring(0,50)+'</div>\n' +
                    '                            <span color="#676a6c">'+result[i].name+'&nbsp;&nbsp;<i class="fa fa-clock-o"></i>发表于 :'+formatTime(result[i].time)+'</span>\n' +
                    '                            <span>&nbsp;&nbsp;&nbsp;&nbsp;发表在[<b color="#676a6c">'+result[i].topic_name+'</b>]中</span>                                </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].view_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>浏览</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].zan_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>点赞</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].reply_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>回复</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div><hr>';
            }
        $('#Parentform').append(newTest);
        }
    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ");
    return time;
}

function Copmlist() {
    $.ajax({
        type:"POST",
        url: "/index/getAComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {
            debugger;
            var end=0;
            if(result.length==0){
               $('#Comp').html("")
                return;
            }else{
                $('#node').html("")
            }
            if(result.length>=3) {
                end=3
            }else{
                end=result.length
            }
            var newTest="";
            for(var i=0;i<end;i++){
                newTest+='   <tr>\n' +
                    '                                    <td class="project-status">\n' +
                    '                                                    <span class="label label-primary"\n' ;
                if(result[i].flag==1){
                    newTest+=' style="background-color: #52dc5bd6;">进行中';
                }else{
                    newTest+='>未开始';
                }
                    newTest+='                                                </span></td>\n' +
                    '                                    <td class="project-title">\n' +
                    '                                        <a onclick="openPage('+'/competition/'+')">'+result[i].name+'</a>\n' +
                    '                                        <br>\n' +
                    '                                        <small>开始时间' + formatTime(result[i].start) + '</small>\n' +
                    '                                    </td>\n' +
                    '                                    <td class="project-completion">\n' ;
                if(result[i].flag==1){
                    newTest+='<small>竞赛正在进行中</small>';
                }else{

                        newTest+='                                    <small>点击进行报名</small>\n';


                }

                newTest+= '                                </td>\n' +
                    '                            </tr>';
            }
            $('#Comp').append(newTest);
            }
        })
}
function CompRank() {
    $.ajax({
        type: "POST",
        url: "/index/getrankList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
            debugger;
            console.log(result);
            var newTest="";
            var k=0;
            for(var i=0;i<result.length;i++){
                if(result[i].name!=undefined) {
                    k = i + 1;
                    newTest += '<tr>\n' +
                        '<td><span class="rate-num rating'+k+'">'+k+'</span></td>' +
                        '<td>'+result[i].className+'</td>'+
                        '                        <td  style="color:'+getColor()+'">' + result[i].name + '</td>\n' +
                        '<td>'+result[i].ac+'</td>'+
                        '                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + result[i].num + '</td>\n' +
                        '</tr>';
                }
                // var oGameName = document.getElementsByClassName("gameName")[0];

            }
            $('#rankList').append(newTest);
        }

    })
}
function getColor()
{
    var colorArray =new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
    var color="#";
    for(var i=0;i<6;i++)
    {
        color += colorArray[Math.floor(Math.random()*16)];
    }
    return color;
}

//获取显示单个实验的语句
function setExperItem(id,name,start,end,is_ip,only_ip,first_ip,ip,isSaveIp){
    var experItem = "<tr>";
    var underWay =   "<td class=\"project-status\">" +
        "<span class=\"label label-primary\">进行中</span>" +
        "</td>";
    var notStarted = "<td class=\"project-status\">\n" +
        "<span class=\"label label-warning-light\">未开始\n" +
        "</td>";
    var testState = 0;
    if (new Date() >= new Date(start)){
        testState = 1;
    }else{
        testState = -1;
    }
    // console.log(testState)
    if(testState == 1){
        experItem += underWay;
    }else if(testState == -1){
        experItem += notStarted;
    }
    experItem += "<td class=\"project-title\">\n";

    experItem += "<a onclick='hint(\""+id+"\",\""+testState+"\",\""+isSaveIp+"\",\""+is_ip+"\",\""+only_ip+"\",\""+first_ip+"\",\""+ip+"\")'>"+ name + "</a>" ;
    experItem +=   " <br/>\n" +
        "                                        <small>开始时间:"+ start  +"&nbsp&nbsp&nbsp</small>\n" +
        "                                        <small>  结束时间:" + end + "</small>\n" +
        "                                    </td>\n" +
        "\n" +
        "                                    <td class=\"project-actions\">\n" ;
    experItem += " <a onclick='hint(\""+id+"\",\""+testState+"\",\""+isSaveIp+"\",\""+is_ip+"\",\""+only_ip+"\",\""+first_ip+"\",\""+ip+"\")' class=\"btn btn-white btn-sm link\"><i class=\"fa fa-folder\"></i> 查看 </a>\n";
    experItem += "</td>\n" +
        "                                </tr>";
    return experItem;

}

//选择要显示的考试
function examIsShow(result,ip) {
    var testID = new Array();
    var testName = new Array();
    var testStart= new Array();
    var testEnd = new Array();
    var is_ip = new Array();
    var only_ip = new Array();
    var first_ip = new Array();
    var res = new Array();
    //将按A、B卷分类的考试加入数组
    var j = 0;
    for(var i = 0; i + 1 < result.length;){
        // console.log(result[i].name + " " + (result[i].start == result[i + 1].start &&  result[i].end == result[i + 1].end) && getTestState(result[i].start,result[i].end) != 0&& getTestState(result[i + 1].start,result[i + 1].end) != 0)
        if((result[i].start == result[i + 1].start) &&  (result[i].end == result[i + 1].end)  ){
            testID[j] = result[i].id;
            testID[j + 1] = result[i + 1].id;
            testName[j] = result[i].name;
            testName[j + 1] = result[i + 1].name;
            testStart[j] = result[i].start;
            testStart[j + 1] = result[i + 1].start;
            testEnd[j] = result[i].end;
            testEnd[j + 1] = result[i + 1].end;
            is_ip[j] = result[i].is_ip;
            is_ip[j + 1] = result[i + 1].is_ip;
            only_ip[j] = result[j].only_ip;
            only_ip[j + 1] = result[j + 1].only_ip;
            first_ip[j] = result[j].first_ip;
            first_ip[j + 1] = result[j + 1].first_ip;
            j = j + 2;
            i = i + 2;
        }else
            i++;
    }
    // console.log(testID)
    // console.log(testName)
    ///显示考试
    var ipTail = ip.charAt(ip.length - 1);
    $.each(result,function(index,value){
        //如果取出的考试已经绑定则正常显示
        if(typeof (value.sid) != "undefined"){
            //console.log(value.name + "已经绑定ip")
            var experItem = setExperItem(value.id,value.name,value.start,value.end,value.is_ip,value.only_ip,value.first_ip,ip,0);
            res.push(experItem);
            //table.append(experItem);
        }
        //未绑定则显示未开始和正在进行的考试
        else{
            //如果考试不分A、B卷，正常显示
            if(testID.indexOf(value.id) == -1){
                // console.log(value.name + "不分AB卷")
                var experItem = setExperItem(value.id,value.name,value.start,value.end,value.is_ip,value.only_ip,value.first_ip,ip,1);
                res.push(experItem);
                //table.append(experItem);
            }
            //否则根据用户ip与考试id判断
            else{
                var index = testID.indexOf(value.id)
                var other = index % 2 == 0 ? index + 1 : index - 1;
                //console.log(value.name + "分AB卷 对应试卷绑定ip " + first_ip[other])
                if(ipTail % 2  == value.id % 2 && typeof (first_ip[other]) == "undefined"){
                    //console.log(value.name + "分AB卷 对应试卷绑定ip " + first_ip[other])
                    var experItem = setExperItem(value.id,value.name,value.start,value.end,value.is_ip,value.only_ip,value.first_ip,ip,1);
                    res.push(experItem);
                    // table.append(experItem);
                }
            }
        }
    })
    return res;
}

//进入考试时的提示信息
function hint(id,testState,isSaveIp,is_ip,only_ip,first_ip,ip){
    console.log("isSaveIp: " + isSaveIp)
    console.log("is_ip: " + is_ip)
    console.log("only_ip: " + only_ip)
    if(isSaveIp == "undefined"){
        openPage("/exam/experDetail?id=" + id + "&testState="+testState+ "&isSaveIp="+isSaveIp);
    }
    if(testState == -1){
        swal({
            title: "未到考试时间",
            text: "现在还未到考试时间，请等待。"
        });
        return;
    }else if(testState == 1 && (is_ip == "on" || only_ip == "on")){
        $.ajax({
            type: "POST",
            url: "/exam/getTestIp",
            dataType: "json",
            data:{
                "tid" : id
            },
            success:function (result) {
                var ipArray = new Array();
                for(var i = 0; i< result.length; i++){
                    var a = result[i].ip.split(".");
                    result[i].ip = a[0] + a[1] + a[2];
                    // if(result[i].ip.charAt(result.length - 1) == '.')
                    //     result[i].ip = result[i].ip.substring(0,length - 1);
                    ipArray[i] = result[i].ip;
                    console.log("允许进入考试的ip段:" + result[i].ip)
                }
                console.log("绑定ip:"+first_ip)
                console.log("用户ip：" + ip)
                if(is_ip == "on" && !checkIP(ip,ipArray)){
                    //如果用户登陆ip不符合，弹出提示窗
                    swal({
                        title: "考试地址错误！",
                        type: "error",
                        text: "请按照老师要求到指定机房进行考试",
                        confirmButtonText:"确认"
                    });
                    return;
                }
                if(only_ip == "on" && (first_ip != "undefined" && ip != first_ip)){
                    swal({
                        title: "该主机ip已绑定！",
                        type: "error",
                        text: "该主机ip已绑定，考试结束后管理员解绑后可使用",
                        confirmButtonText:"确认"
                    });
                    return;
                }
                openPage("/exam/experDetail?id=" + id + "&testState="+testState+ "&isSaveIp="+isSaveIp);
            }
        })
    }else
        openPage("/exam/experDetail?id=" + id + "&testState="+testState+ "&isSaveIp="+isSaveIp);


}


//考试时检查用户ip是否符合要求
function   checkIP(userIp,ipArray)
{
    //var userIp = userIp.substring(0, userIp.lastIndexOf('.'));     //截取IP地址中最后一个.前面的数字
    var a = userIp.split(".");
    userIp = a[0] + a[1] + a[2];
    var res = ipArray.indexOf(userIp) == -1 ? false: true;
    return res;
}


