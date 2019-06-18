var FlagList=[];
$(document).ready(function () {
    drawNavAct(5);
    loadSummernote();
    showtopic();
    getPostFlag();
});
function showtopic(){
    $.ajax({
        type:"POST",
        url: "/discussion/getTopic",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function(result){
            $("#sumpost").html(result.sum);
            console.log(result);
            result=result.list;
            var newTest=""
            for(var i in result) {
                newTest += '  <div class="forum-item active">\n' +
                    '<div class="row">\n' +
                    '<div class="col-sm-9">\n' +
                    '<div class="forum-icon">\n' +
                    '                                        <i class="fa fa-star"></i>\n' +
                    '                                    </div>\n' +
                    '  <a href="/discussion/showpostinfo/'+result[i].id+'"  class="forum-item-title">'+result[i].name+'</a>\n' +
                    ' <div class="forum-sub-title">'+result[i].content+'</div>\n' +
                    '                                </div>'+
                    ' <div class="col-sm-1 forum-info"></div>\n'+
                    '   <div class="col-sm-1 forum-info">\n' +
                    '  <span class="views-number">'+result[i].view+ '</span>\n' +
                    '                                    <div>\n' +
                    '                                        <small>浏览</small>\n' +
                    '                                    </div>\n' +
                    '                                </div>\n' +
                    '                                <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">' + result[i].sum+
                    '                                        </span>\n' +
                    '                                    <div>\n' +
                    '                                        <small>帖子</small>\n' +
                    '                                    </div>\n' +
                    '                                </div></div></div>';
            }
            $("#parentTest").append(newTest);
            var newTest1="";
            for(var i in result){
                newTest1+='<option value="'+result[i].id+'"'+'color="blue">'+result[i].name+
                    '</option>\n';
            }
            $("#TopicSubject").append(newTest1);
        }
    })
}

function getPostFlag() {
    $.ajax({
        type:"POST",
        url: "/discussion/getPostFlagList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function(result) {
            console.log(result);
            FlagList=result;
            Page();
        }
    })
}
function Page() {
    if(FlagList.length>0){
        $('#shafa').hide();
    }
    if(FlagList.length<=10){
        FlagListPage(0);
    }else{
        FlagListPage(0);
        var page=FlagList.length/10;
        console.log(page);
        test="";
        test+='<button class="btn btn-white" type="button"><i class="fa fa-chevron-left"></i>\n' +
            '                </button>';
        for(var i=0;i<page;i++){
            j=i+1;
            test+='<button class="btn btn-white" onclick="FlagListPage('+i+')">'+j+'</button>\n'
        }
        test+=' <button class="btn btn-white" type="button"><i class="fa fa-chevron-right"></i>\n' +
            '                </button>';
        $('#page').append(test);
    }
}
function FlagListPage(page){
    $('#Parentform').html("");
    newTest="";
    var first=0;
    var end=FlagList.length;
    if(page==0){
        first=0;
        if(FlagList.length<10) {
            end = FlagList.length;
        }else{
            end=10;
        }
    }else{
        first=(page)*10;
        if(first>FlagList.length){
            return;
        }
        if(FlagList.length> page*2*10){
            end=page*10*2;
        }else{
            end=FlagList.length;
        }
    }
    var result=FlagList
    for(var i=first;i<end;i++){
        newTest+='  <div class="row">\n' +
            '                                <div class="col-sm-9">\n' +
            '                                    <div class="forum-icon">\n' +
            '                                        <i class="fa fa-clock-o"></i>\n' +
            '                                    </div>\n' +
            '                                    <a href="/discussion/showarticle/'+result[i].id+'/'+result[i].name+'/'+result[i].sub_id+'" class="forum-item-title">'+result[i].title+
            '                                         <b class="btn btn-primary btn-xs">置顶</b>'+
            '                                        </a>\n' +
            '                                    <div class="forum-sub-title">'+result[i].content.replace(/<[^>]+>/g,"").substring(0,50)+'</div>\n' +
            '<span color="#676a6c">'+result[i].name+'&nbsp&nbsp<i class="fa fa-clock-o"></i>发表于 :'+formatTime(result[i].time)+'</span>\n'+
            '<span>&nbsp&nbsp&nbsp&nbsp发表在[<b color="#676a6c">'+result[i].topic_name+'</b>]中</span>'+
            '                                </div>\n' +
            '                                <div class="col-sm-1 forum-info">\n' +
            '                                        <span class="views-number">\n' + result[i].view_num+
            '                                        </span>\n' +
            '                                    <div>\n' +
            '                                        <small>浏览</small>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                                <div class="col-sm-1 forum-info">\n' +
            '                                        <span class="views-number">\n' + result[i].zan_num+
            '                                        </span>\n' +
            '                                    <div>\n' +
            '                                        <small>点赞</small>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                                <div class="col-sm-1 forum-info">\n' +
            '                                        <span class="views-number">\n' + result[i].reply_num+
            '                                        </span>\n' +
            '                                    <div>\n' +
            '                                        <small>回复</small>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n'+
            '<hr>';
    }
    $("#Parentform").append(newTest);
}
function resetDialog() {
    $('#content').code("");
    $('#dialogNoticeForm input').select('');
    $('#dialogNoticeForm input').val('');
}
function AddTopic(){
    if($("#postTitle").val()==""){
        toastr.error("","文章标题不能为空");
        return;
    }
    if($("#content").html()==""){
        toastr.error("","内容不能为空");
        return;
    }
    if($("#TopicSubject").val()==-1){
        toastr.error("","所属主题不能为空");
        return;
    }
    $.ajax({
        type:"POST",
        url: "/discussion/addPost",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            title: $("#postTitle").val(),
            topicId:$("#TopicSubject").val(),
            content:$("#content").code(),
        }),
        success:function(result) {
            console.log(result);
            if(result == true){
                swal("发布成功！");
                $('#myModal5').modal('hide');
                // $(".confirm").click(function(){history.back(-1)});
            }else{
                swal("发布失败！");
            }
            setTimeout( function(){
                history.go(0);
            }, 1* 1000 );

        }
    })

}
//初始化题目详情编辑器
function loadSummernote() {
    $("#content").summernote({
        height: 200,
        minHeight: 200,
        maxHeight: 200,
        lang: 'zh-CN',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview']]
        ]

    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}