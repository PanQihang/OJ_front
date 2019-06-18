


var editor; //代码编辑器
var codeData={
    language : '2'  //默认是C语言
}; //代码的最终汇总结果
var postId=undefined; //最新提交代码的提交号
var PleaseDoNotDeleteMe = {
    limitTime : 10,
    handle : undefined,
    handleB : undefined
} ;

$(function(){

    testFun();
    init();
})

function init(){
    loadProblemData(Info);
    loadCodeEditArea();

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
//初始化页面高度
function initSetPageHeight(){
    var doc = document.body;
    var temp = doc.scrollHeight;

}

//加载题目详细信息
function loadProblemData(t){
    //console.log(t)
    $('#problemName').text(t.proName);
    $('#problemId').text(t.proId);
    $('#problemDescription').html(t.problemDescription);
    $('#inputDescription').html(t.inputDescription);
    $('#outputDescription').html(t.outputDescription);
    $('#inputSample').html(t.inputSample);
    $('#outputSample').html(t.outputSample);
    $('#proAcPercentageTip').text("AC率:"+t.proAcPercentage+"%");
    $('#proAcNumTip').text("AC:"+t.proAcNum);
    $('#proSubNumTip').text("SUB:"+t.proSubNum);
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
        styleActiveLine: false, // 当前行背景高亮
        matchBrackets: true   // 括号匹配
    });
    editor.setSize('auto','600px');
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
            codeData['language'] = '2';
        }else if(lang=="languageCPP") {
            editor.setOption("mode","clike");
            editor.setValue(txt);
            codeData['language'] = '1';
        }else if(lang == "languageJava") {
            editor.setOption("mode","clike");
            editor.setValue(txt);
            codeData['language'] = '3';
        }else if(lang == "languagePython") {
            editor.setOption("mode","python");

            editor.setValue(txt);
            codeData['language'] = '4';
        }
    });
}

//提交代码到服务器
function submitCode(){
    if(undefined!=PleaseDoNotDeleteMe.handle){
        alert("请在"+PleaseDoNotDeleteMe.limitTime+"秒后再次提交!");
        return;
    }
    editor.save();
    var temp = $('#codeEditArea').val();
    codeData['codeData'] = temp;
    codeData['proId'] = Info.proId;
    console.log(codeData);
    postData(codeData);
    if(undefined != PleaseDoNotDeleteMe.handle ) clearInterval(PleaseDoNotDeleteMe.handle);
    if(undefined != PleaseDoNotDeleteMe.handleB ) clearInterval(PleaseDoNotDeleteMe.handleB);
    PleaseDoNotDeleteMe.limitTime=10;
    PleaseDoNotDeleteMe.handle = setInterval("babyRunning()",1000);
    PleaseDoNotDeleteMe.handleB = setInterval("getPostResult()",5000);
}

//询问提交结果
function getPostResult(){
    $.ajax({
        type: "POST",
        url: "/practice/getTheSubmitResult",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            'postId' : postId
        }),
        success:function (result) {
            dealPostResult(result);
        }
    });
}
//处理返回结果
function dealPostResult(t){
    if(t.result!='unknow'){
        clearInterval(PleaseDoNotDeleteMe.handleB);
        PleaseDoNotDeleteMe.handleB = undefined;
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
            postId = result.postId;
        }
    });
}
//显示提交结果
function showSubmitResult(t){
    if('AC'==t.result){
        $('#submitResult').text("Accept");
        $('#submitResult').css("color", "greenyellow");
    }else if('wrongAnswer'==t.result){
        $('#submitResult').text("Wrong answer");
        $('#submitResult').css("color", "red");
    }else if('complieError'==t.result){
        $('#submitResult').text("Complie error");
        $('#submitResult').css("color", "yellow");
    }
    $('#submitInf').text(t.inf);
}


function babyRunning(){
    if(0==PleaseDoNotDeleteMe.limitTime){
        clearInterval(PleaseDoNotDeleteMe.handle);
        PleaseDoNotDeleteMe.handle = undefined;
    }
    else PleaseDoNotDeleteMe.limitTime--;
}
