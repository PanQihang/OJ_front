$(document).ready(function () {
    problemDetails();
});

//题目详情显示
function  problemDetails() {
    var id = $("#proid").val();
    if(id != null && id != ""){
        $.ajax({
            type: "POST",
            url: "/experiment/getProblemDetails",
            dataType: "json",
            async:false,
            data:{
                "id" : id
            },success:function (result){
                $("#dialogProblemName").text(result[0].name);
                $("#desc").html(delHtml(result[0].description))
                $("#dialogProblemInType").html(delHtml(result[0].intype))
                $("#dialogProblemOutType").html(delHtml(result[0].outtype))
                $("#dialogProblemInSample").html(delHtml(result[0].insample))
                $("#dialogProblemOutSample").html(delHtml(result[0].outsample))
                $("#dialogProblemMaxMemory").text(result[0].maxmemory)
                $("#dialogProblemMaxTime").text(result[0].maxtime)
                $("#dialogProblemRank").text(5 - parseInt(result[0].rank / 20));
                $("#ac").html(result[0].AC_number);
                $("#sum").html(result[0].submit_number);
                var rate = ((result[0].AC_number / result[0].submit_number) * 100).toFixed(2).toString() + "%";
                $("#ac_rate").html(rate);
                $("#rate").css("width",rate)
            }
        })
    }else{
        $("#dialogTitle").html("出错了");
    }
}

//过滤文本中的html标签
function delHtml(msg) {

         msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        msg = msg.replace(/[|]*\n/, '') //去除行尾空格
        msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
        return msg;

}

//获取url中的参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

