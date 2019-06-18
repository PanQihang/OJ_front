


/*
//
{
 */
// $(document).ready(function () {
//     reply_btn();
// });
toastr.options = {
    'closeButton':true,
    'debug':false,
    'progressBar':false,
    'positionClass':'toast-top-center',
    'onclick':null,
    'showDuration':'4000',
    'hideDuration':'5000',
    'timeOut':'6000',
    'extendedTimeOut':'1000',
    'showEasing':'swing',
    'hideEasing':'linear',
    'showMethod':'fadeIn',
    'hideMethod':'fadeOut'
}
var editor; //代码编辑器
var codeData={
    language : '1'  //默认是C++语言(1) /* C++:1, C:2, Java:3, Python:4   */
}; //代码的最终汇总结果
var postId=undefined; //最新提交代码的提交号
var PleaseDoNotDeleteMe = {
    limitTime : 5,
    handle : undefined,
    handleB : undefined
} ;
var submitBtn = $('#submitCodeBtn');
var loadingDiv = $('#loadingDiv');
$(function(){
    drawNavAct(1);
    //testFun();
    if(Info.result==undefined || Info.result=='failed'){
        $('#pageBody').hide();
        swal("内容请求失败！", "#提示：\n如果当前正是考试阶段，请查看考试时间是否已结束！\n或者联系系统管理员！")
        $('.confirm').click(function(){
            location.href = '/practice/';
        })
        setTimeout(function () {
            location.href = '/practice/';
        }, 10000);
        //submitBtn.css('pointer-events', 'none')
    }else if(Info.result=='succeed') init();
})

function init(){
    loadProblemData(Info);
    loadCodeEditArea();
    initSetPageSize();
    if(Info.public=='on'){
        loadSummernote();
        getReply();
    }else{
        $('#publicoff').css("display","block");
        $('#replybtton').css("display","none");
        $('.content').css("display","none");
    }

    window.onresize= function(){
        initSetPageSize();
    }
}

function testFun(){

    var result = {
        'proName':"周游加拿大",
        'MemoryLimit' : '50240',
        'TimeLimit' : '5000',
        'problemDescription':"你赢得了一场航空公司举办的比赛，奖品是一张加拿大环游机票。旅行在这家航空公司开放的最西边的城市开始，然后一直自西向东旅行，直到你到达最东边的城市，再由东向西返回，直到你回到开始的城市。每个城市只能访问一次，除了旅行开始的城市之外，这个城市必定要被访问两次（在旅行的开始和结束）。你不允许使用其他公司的航线或者用其他的交通工具。 给出这个航空公司开放的城市的列表，和两两城市之间的直达航线列表。找出能够访问尽可能多的城市的路线，这条路线必须满足上述条件，也就是从列表中的第一个城市开始旅行，访问到列表中最后一个城市之后再返回第一个城市。",
        'inputDescription':"Line 1: 航空公司开放的城市数 N 和将要列出的直达航线的数量 V。N 是一个不大于 100 的正整数。V 是任意的正整数。 Lines 2..N+1: 每行包括一个航空公司开放的城市名称。城市名称按照自西向东排列。不会出现两个城市在同一条经线上的情况。每个城市的名称都是一个字符串，最多15字节，由拉丁字母表上的字母组成；城市名称中没有空格。 Lines N+2..N+2+V-1: 每行包括两个城市名称（由上面列表中的城市名称组成），用一个空格分开。这样就表示两个城市之间的直达双程航线。",
        'outputDescription':"Line 1: 按照最佳路线访问的不同城市的数量 M。如果无法找到路线，输出 1。",
        'inputSample':"8 9\t\n" +
            "Vancouver\t\t\n" +
            "Yellowknife\t\n" +
            "Edmonton\n" +
            "Calgary\n" +
            "Winnipeg\n" +
            "Toronto\t\n" +
            "Montreal\n" +
            "Halifax\t\n" +
            "Vancouver Edmonton\n" +
            "Vancouver Calgary\t\n" +
            "Calgary Winnipeg\n" +
            "Winnipeg Toronto\n" +
            "Toronto Halifax\n" +
            "Montreal Halifax\n" +
            "Edmonton Montreal\n" +
            "Edmonton Yellowknife\n" +
            "Edmonton Calgary",
        'outputSample':"7\n" +
            "也就是: Vancouver, Edmonton, Montreal, Halifax, Toronto, Winnipeg, Calgary, 和 Vancouver （回到开始城市，但是不算在不同城市之内）。 "
    }
    result['testPro']='testMessage';
    //loadProblemData(result);
    result={
        result:'AC',
        info:' '
    }
    showSubmitResult(result);
}
//初始化页面尺寸
function initSetPageSize(){
    var doc = document.body;
    if(1000 > doc.scrollWidth){
        $('#pageBody').css('width', '1000px');
        editor.setSize('400px;','600px');
        $('#resultArea').css("width","400px;" )
    }else{
        $('#pageBody').css('width', doc.scrollWidth+'px');
        editor.setSize(doc.scrollWidth /2 -100 + 'px', '600px');
        $('#resultArea').css("width",doc.scrollWidth /2 -100 + 'px' )
    }
    if(800 > doc.scrollHeight){
        $('#pageBody').css('height', '1000px');

    }

}

//加载题目详细信息
function loadProblemData(t){
    //console.log(t)
    t['proAcPercentage']= 0==t.proSubmitAmount ? 0 : ((t.proAcAmount / t.proSubmitAmount) * 100).toFixed(1);
    if(t['proAcPercentage']==0) t['proAcPercentage']="0";
    $('#problemName').text(t.proName);
    $('#problemId').text(t.proId);
    $('#problemDescription').html(t.problemDescription);
    $('#inputDescription').html(t.inputDescription);
    $('#outputDescription').html(t.outputDescription);
    $('#inputSample').html(t.inputSample);
    $('#outputSample').html(t.outputSample);
    $('#proAcPercentageTip').text("AC率:"+t.proAcPercentage+"%");
    $('#proAcNumTip').text("AC:"+t.proAcAmount);
    $('#proSubNumTip').text("SUB:"+t.proSubmitAmount);
    $('#MemoryThresholdTip').text("内存阀值:"+t.MemoryLimit+"K");
    $('#RunTimeThresholdTip').text("耗时阀值:"+t.TimeLimit+"MS");

    //确保textarea标签的高度足够  //已废除
    /*var textarea=document.getElementById('inputDescription');
    textarea.style.height = textarea.scrollHeight + 10+  'px';
    textarea=document.getElementById('outputDescription');
    textarea.style.height = textarea.scrollHeight + 10+ 'px';
    textarea=document.getElementById('inputSample');
    textarea.style.height = textarea.scrollHeight + 10+  'px';
    textarea=document.getElementById('outputSample');
    textarea.style.height = textarea.scrollHeight + 10+  'px';*/
}

//加载代码编辑框
function loadCodeEditArea(){
    $('#editAreaProName').text(Info.proName);
    $('#editAreaProId').text("题目编号:"+Info.proId);
    editor = CodeMirror.fromTextArea($("#codeEditArea")[0], { //script_once_code为你的textarea的ID号
        mode:"clike",　//默认脚本编码
        lineWrapping:false, //是否强制换行
        lineNumbers: true,     // 显示行数
        indentUnit: 4,         // 缩进单位为4
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true   // 括号匹配
    });
    editor.setSize('auto','600px');
    //editor.setSize(document.body.scrollWidth / 2 + )
    //改变编辑界面风格
    $('#selectEditAreaStyle').change(function(){
        var theme = $('#selectEditAreaStyle').val();
        editor.setOption("theme", theme); //editor.setOption()为codeMirror提供的设置风格的方法
    });

    //改变代码语言脚本类型
    $(".ck-code").click(function(){
        var txt=editor.getValue(); //editor.getValue()获取textarea中已有的值
        var lang=$(this).prop("id");
        if(lang=="languageC") {
            editor.setOption("mode","clike");//editor.setOption()设置脚本类型
            editor.setValue(txt);// editor.setValue()设置textarea中的值
            codeData['language'] = '2';//'C';
        }else if(lang=="languageCPP") {
            editor.setOption("mode","clike");
            editor.setValue(txt);
            codeData['language'] = '1';//'C++';
        }else if(lang == "languageJava") {
            editor.setOption("mode","clike");
            editor.setValue(txt);
            codeData['language'] = '3';//'Java';
        }else if(lang == "languagePython") {
            editor.setOption("mode","python");
            editor.setValue(txt);
            codeData['language'] = '4';//'Python';
        }
    });
}

//提交代码到服务器
function submitCode(){
    editor.save();
    var temp = $('#codeEditArea').val();
    codeData['codeData'] = temp;
    codeData['proId'] = Info.proId;
    codeData.testId=Info.testId;
    if(codeData.codeData==''){
        toastr.error("请勿提交空代码");
        return;
    }
    postData(codeData);
}

//询问提交结果
function getPostResult(){
    if(PleaseDoNotDeleteMe.limitTime-- <= 0){
        if(PleaseDoNotDeleteMe.handleB!=undefined){
            clearInterval(PleaseDoNotDeleteMe.handleB);
            PleaseDoNotDeleteMe.handleB = undefined;
        }
        submitBtn.css('pointer-events', '');
        submitBtn.css('background', '#7266ba');
        loadingDiv.hide();
        return;
    }
    $.ajax({
        type: "POST",
        url: "/practice/getTheSubmitResult",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            'postId' : postId
        }),
        success:function (result) {
            //console.log("服务器返回的处理结果");
            //console.log(result);
            dealPostResult(result);
        },
        error:function(){
            if(PleaseDoNotDeleteMe.handleB!=undefined){
                clearInterval(PleaseDoNotDeleteMe.handleB);
                PleaseDoNotDeleteMe.handleB = undefined;
            }
        }
    });
}
//处理返回结果
function dealPostResult(t){

    if(0!=t.result){
        if(PleaseDoNotDeleteMe.handleB!=undefined){
            clearInterval(PleaseDoNotDeleteMe.handleB);
            PleaseDoNotDeleteMe.handleB = undefined;
        }
        submitBtn.css('pointer-events', '');
        submitBtn.css('background', '#7266ba');
        loadingDiv.hide();
        showSubmitResult(t);
    }
}
//发送代码包给服务器
function postData(t){
    $.ajax({
        type: "POST",
        url: "/practice/receiveCode",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify(t),
        success:function (result) {
            if (result.result == 'succeed') {
                postId = result.submitId;
                //swal('代码提交成功', '代码已提交，请等待系统判题结果！', 'success');
                //if(undefined != PleaseDoNotDeleteMe.handle ) clearInterval(PleaseDoNotDeleteMe.handle);
                if(undefined != PleaseDoNotDeleteMe.handleB ) clearInterval(PleaseDoNotDeleteMe.handleB);
                PleaseDoNotDeleteMe.limitTime=5;
                //PleaseDoNotDeleteMe.handle = setInterval("babyRunning()",1000);
                PleaseDoNotDeleteMe.handleB = setInterval("getPostResult()",1000);
                $('#submitResult').text("未知");
                $('#submitResult').css("color", "gray");
                $('#submitInf').text("后台处理中....");
                loadingDiv.show();
            }else{
                swal("代码提交失败", "提交失败\n如果当前处于考试阶段，请检查考试时间是否已结束！\n或者，你可以联系系统管理员！", 'error');
            }
            submitBtn.css('pointer-events', 'none');
            submitBtn.css('background', 'gray');
        },
        error: function(){
            swal("代码提交失败","未知错误！（请检查浏览器或当前网络状态是否异常）")
        }

    });
}
//显示提交结果
function showSubmitResult(t){


    if('1'==t.result){
        $('#submitResult').text("Accept");
        $('#submitResult').css("color", "#33a551");
        swal("恭喜你成功AC此题", "")
    }else if('3'==t.result){
        $('#submitResult').text("Wrong answer");
        $('#submitResult').css("color", "#d85959");
    }else if('8'==t.result){
        $('#submitResult').text("Complie error");
        $('#submitResult').css("color", "#d89459");
    }else{
        $('#submitResult').text(transitionStateNumToString(t.result));
        if('2'==t.result) $('#submitResult').css("color", "#d8d259"); //答案正确，但格式不对
        else if('0'==t.result) $('#submitResult').css("color", "#8292b1");
        else $('#submitResult').css("color", "#f22342");
    }
    $('#submitInf').text(t.inf);
}
var resultStateNum = {
    0:'服务器处理中'  , 1:'AC', 2:'PRESENTATION_ERROR',
    3: 'WRONG_ANSWER'  ,8:'COMPILE_ERROR',
    5:'TIME_LIMIT_EXCEED'  ,4:'RUNTIME_ERROR'
    ,6:'MEMORY_LIMIT_EXCEED'
}
//处理结果状态码解读
function transitionStateNumToString(t){
    //console.log(resultStateNum[t])
    return resultStateNum[t];
}


function babyRunning(){
    if(0==PleaseDoNotDeleteMe.limitTime){
        clearInterval(PleaseDoNotDeleteMe.handle);
        PleaseDoNotDeleteMe.handle = undefined;
    }
    else{
        PleaseDoNotDeleteMe.limitTime--;
    }
}

function loadSummernote() {
    $("#reply").summernote({
        height: 100,
        minHeight: 100,
        maxHeight: 200,
        lang: 'zh-CN',
        // placeholder: '在这里畅所欲言吧...',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview']]
        ]

    });
    $("#reply").code("");
}


function ReplyPro() {
    console.log($("#reply").code().length);
    if($("#reply").code()==""){
        toastr.error("","回复内容不能为空");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/practice/addReply",
        dataType: "json",
        async:false,
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            proId:Info.proId,
            content:$("#reply").code()
        }),success:function(result){
           if(result=='1'){
               swal("评论成功","sccess");
           }else{
               swal("评论失败","未知错误！（请检查浏览器或当前网络状态是否异常）");
           }
            $("#reply").code("");
            getReply();
        }
    })
}


function getReply() {
    $('#replyList').html("");
    $.ajax({
        type: "POST",
        url: "/practice/getReply",
        dataType: "json",
        async:false,
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            proId:Info.proId
        }),success:function(result){
            debugger;
          if(result.length!=0){
              $('#shafa').hide();
              newTest='';
              for(var i in result){
                  newTest+='<li class="media">\n' +
                      '                                                        <div class="media-body">\n' +
                      '                                                            <small class="text-left">'+result[i].name+'</small>\n' +
                      '                                                            <small class="pull-right">'+result[i].time+'&nbsp;&nbsp;</small>\n' +
                      '                                                        <p>'+result[i].content+'</p>\n' +
                      '                                                            <div class="css-1wigilb-Toolbar e5i1odf8">\n' +
                      '                                                                <button class="e5i1odf7 css-914y8j-transparent-xs-Btn-ToolButton e5i1odf0" type="transparent" onclick="OpenReply(this'+','+result[i].id+')"><svg viewBox="0 0 24 24" width="1em" height="1em" class="css-1lc17o4-icon"><path fill-rule="evenodd" d="M8.995 22a.955.955 0 0 1-.704-.282.955.955 0 0 1-.282-.704V18.01H3.972c-.564 0-1.033-.195-1.409-.586A1.99 1.99 0 0 1 2 15.99V3.97c0-.563.188-1.032.563-1.408C2.94 2.188 3.408 2 3.972 2h16.056c.564 0 1.033.188 1.409.563.375.376.563.845.563 1.409V15.99a1.99 1.99 0 0 1-.563 1.432c-.376.39-.845.586-1.409.586h-6.103l-3.709 3.71c-.22.187-.454.281-.704.281h-.517zm.986-6.01v3.1l3.099-3.1h6.948V3.973H3.972V15.99h6.01zm-3.99-9.013h12.018v2.018H5.991V6.977zm0 4.037h9.014v1.972H5.99v-1.972z"></path></svg><span>查看所有'+result[i].sum+'条回复</span></button>\n' +
                      '                                                                <button   class="e5i1odf7 css-914y8j-transparent-xs-Btn-ToolButton e5i1odf0 replyson" type="transparent" onclick="reply_btn(this,'+result[i].id+')"><svg viewBox="0 0 24 24" width="1em" height="1em" class="css-1lc17o4-icon"><path fill-rule="evenodd" d="M21.947 18.144a1 1 0 0 1-1.496 1.18c-3.255-2.193-5.734-3.275-8.556-3.477v4.134a1 1 0 0 1-1.688.726L2.312 13.22a1 1 0 0 1 0-1.451l7.894-7.494A1 1 0 0 1 11.895 5v3.953c3.62.481 7.937 3.52 10.052 9.191zm-6.992-5.851c-1.624-.938-3.31-1.407-5.06-1.407V7.287l-5.422 5.207 5.422 5.203v-3.885c2.696 0 5.644.763 8.843 2.29-1.002-1.52-2.346-2.979-3.783-3.81z"></path></svg><span class="css-1km43m6-BtnContent e5i1odf1">回复</span></button>\n' +
                      '                                                            </div>\n' +
                      '                                                        </div>\n' +
                      '                                                    </li>';
              }
              $('#replyList').append(newTest);
          }
        }
    })
}
function OpenReply(tap,id) {
    $($(tap).parent().parent().find('.media')).remove();
    $.ajax({
        type: "POST",
        url: "/practice/OpenReply",
        dataType: "json",
        async:false,
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            id:id,
            proId:Info.proId
        }),success:function(result) {
            if (result.length == 0) {
                swal("没有更多回复", "快来回复吧！");
            } else {
                debugger;
                var newTest = '';
                for (var i in result) {
                    newTest += '  <div class="media">\n' +
                        '                                                            <a class="pull-left" href="#">\n' +
                        '                                                                <i class="fa fa-comments-o"></i>\n' +
                        '                                                            </a>\n' +
                        '                                                        <div class="media-body">\n' +
                        '                                                            <small class="text-left">' + result[i].name + '</small>\n' +
                        '                                                            <small class="pull-right">' + result[i].time + '&nbsp;&nbsp;</small>\n' +
                        '                                                            <p>' + result[i].content + '</p>\n' +
                        '                                                        </div>\n' +
                        '                                                         </div>';
                }
                newTest+='<div class="media">\n'+
                   '<button class="e5i1odf7 css-914y8j-transparent-xs-Btn-ToolButton e5i1odf0" type="transparent" onclick="RemoveReply(this)"><svg viewBox="0 0 24 24" width="1em" height="1em" class="css-1lc17o4-icon"><path fill-rule="evenodd" d="M8.995 22a.955.955 0 0 1-.704-.282.955.955 0 0 1-.282-.704V18.01H3.972c-.564 0-1.033-.195-1.409-.586A1.99 1.99 0 0 1 2 15.99V3.97c0-.563.188-1.032.563-1.408C2.94 2.188 3.408 2 3.972 2h16.056c.564 0 1.033.188 1.409.563.375.376.563.845.563 1.409V15.99a1.99 1.99 0 0 1-.563 1.432c-.376.39-.845.586-1.409.586h-6.103l-3.709 3.71c-.22.187-.454.281-.704.281h-.517zm.986-6.01v3.1l3.099-3.1h6.948V3.973H3.972V15.99h6.01zm-3.99-9.013h12.018v2.018H5.991V6.977zm0 4.037h9.014v1.972H5.99v-1.972z"></path></svg><span>隐藏回复</span></button>\n' +
                    '</div>';
                    $(tap).parent().parent().append(newTest);
            }
        }
        })
}
function RemoveReply(tap) {
    $($(tap).parent().parent().find('.media')).remove();
    //$($(tap).parent().parent().find('.css-1wigilb-Toolbar e5i1odf8')).remove();
    $(tap).remove();
}
function reply_btn(tab,id) {
    console.log(1);
        $(".reply_textarea").remove();
        $(tab).parent().append("<div class='reply_textarea' style='position: relative; height:90px;'><textarea wrap='hard' class='replyContent' placeholder='在这里发表你的观点...' name='' cols='60' rows='3' style='position:absolute; right:2px;resize:none;'></textarea><br/><input type='submit' class='' value='发表' style='position:absolute;top:60px;right:2px;' onclick='Reply("+id+")'/></div>");
}
function Reply(id) {
    if($(".replyContent").val()==""){
        toastr.error("","回复内容不能为空");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/practice/Reply",
        dataType: "json",
        async:false,
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            id:id,
            proId:Info.proId,
            content:$(".replyContent").val()
        }),success:function(result) {
            if(result=='1'){
                swal("回复成功","sccess");

            }else{
                swal("回复失败","未知错误！（请检查浏览器或当前网络状态是否异常）");
            }
            $(".reply_textarea").remove();
            getReply();
        }
        })
}