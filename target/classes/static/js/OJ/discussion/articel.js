var replyList=[];
var j=0;
var zan=0;
replyList=Postinfo.replylist;
$(document).ready(function () {
    drawNavAct(5);
    showarticel();
    queryreplyInfo();
    loadSummernote();
    reply_btn();
});
function reply_btn(id,level) {

    $(".reply_btn").click(function(){
        $(".reply_textarea").remove();
        $(this).parent().append("<div class='reply_textarea'><textarea wrap='hard' class='content' placeholder='在这里发表你的观点...' name='' cols='100' rows='5' style='resize: none;'></textarea><br/><input type='submit' value='发表' onclick='addreplyson("+id+","+level+")'/></div>");
    });
}

function showarticel() {
    console.log(Postinfo)
    $("#title").html(Postinfo.post.title);
    $("#content").html(Postinfo.post.content);
    $("#username").html(Postinfo.name)
    $("#time").html(formatTime(Postinfo.post.time));
    $("#comment").html(Postinfo.post.reply_num);
    $("#view").html(Postinfo.post.view_num);
    $("#zan").html(Postinfo.post.zan_num);
    $("#iszan").html(Postinfo.zan);
    $('#Replynum').html(" &nbsp&nbsp&nbsp&nbsp"+Postinfo.post.reply_num+"条回复");
}

function queryreplyInfo(){
    if(replyList.length>0){
        $('#shafa').hide();
    }
    if(replyList.length>0){
        $('#shafa').hide();
    }
    if(replyList.length<=5){
        replyListPage(0);
    }else{
        replyListPage(0);
        var page=replyList.length/5;
        console.log(page);
        test="";
        var j=0;
        test+='<button class="btn btn-white" type="button"><i class="fa fa-chevron-left"></i>\n' +
            '                </button>';
        for(var i=0;i<page;i++){
            j=i+1;
            test+='<button class="btn btn-white" onclick="replyListPage('+i+')">'+j+'</button>\n'
        }
     test+=' <button class="btn btn-white" type="button"><i class="fa fa-chevron-right"></i>\n' +
            '                </button>';
        $('#page').append(test);
    }

}
function replyListPage(page){
    $('.media-list').html("");
    Test="";
    var first=0;
    var end=replyList.length;
    if(page==0){
        first=0;
        if(replyList.length<=5) {
            end = replyList.length;
        }else{
            end=5;
        }
    }else{
        first=(page)*5;
        if(first>replyList.length){
            return;
        }
        if(replyList.length> page*2*5){
            end=page*5*2;
        }else{
            end=replyList.length;
        }
    }
    for(var i=first;i<end;i++){
        var s="";
        Test+=' <li class="media">\n' +
            '                            <a class="pull-left" href="#">\n' +
            '                                <i class="fa fa-comments-o"></i>\n' +
            '                            </a>\n' +
            '                            <div class="media-body">\n' +
            '                                <h4 class="media-heading">'+replyList[i].name+'</h4>\n' +
            '<p>'+replyList[i].content+'</p>\n'+
            '<span ><i class="fa fa-clock-o"></i>发表于 :'+formatTime(replyList[i].time)+'</span>\n'+
            '<div class="small text-right">\n' +
            '                                    <div><i class="fa fa-comments-o"> </i>' +
            '<a class="reply_btn" onclick="reply_btn('+replyList[i].id+','+replyList[i].level+')">回复('+ replyList[i].sum+')</a>|\n' +
            '                                        <i class="fa fa-thumbs-up"></i><a onclick="replyzan('+replyList[i].id+')">赞('+replyList[i].zannum+')</a></div>\n' +
            '                                </div>\n';
        Test+=replysoninfo(replyList[i].id);
        Test+='                            </div>\n' +
            '                        </li>\n';
    }
    $('.media-list').append(Test);
}
function replysoninfo(level) {
    var newtest="";
    $.ajax({
        type: "POST",
        url: "/discussion/replysoninfo",
        dataType: "json",
        async:false,
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            level:level
        }),success:function(result){

            for(var j in result){
                newtest+=' <div class="media">\n' +
                    '                            <a class="pull-left" href="#">\n' +
                    '                                <i class="fa fa-comments-o"></i>\n' +
                    '                            </a>\n' +
                    '                            <div class="media-body">\n' +
                    '                                <h4 class="media-heading">'+result[j].name+' 回复 '+ result[j].replyedname+'</h4>\n' +
                    '<p>'+result[j].content.replace(/\n/g,'<br/>')+'</p>\n'+
                    '<span ><i class="fa fa-clock-o"></i>发表于 :'+formatTime(result[j].time)+'</span>\n'+
                    '<div class="small text-right">\n' +
                    '                                    <div><i class="fa fa-comments-o"> </i>' +
                    '<a class="reply_btn" onclick="reply_btn('+result[j].id+','+result[j].level+')">回复('+ result[j].sum+')</a>|\n' +
                    '                                        <i class="fa fa-thumbs-up"></i><a onclick="replyzan('+result[j].id+')">赞('+result[j].zannum+')</a></div>\n' +
                    '                                </div>'+
                    '                            </div>\n' +
                    '                        </div>\n';
            }
            //console.log(newtest);
            return newtest;
        }
    });

    return newtest;
}
function loadSummernote() {
    $("#reply").summernote({
        height: 200,
        minHeight: 200,
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

    })
}
function replyPost(){
    console.log($("#reply").code());
    if($("#reply").code()==undefined){
        toastr.error("","回复内容不能为空");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/discussion/addreply",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            post_id:Postinfo.post_id,
            content: $("#reply").code(),
        }),success:function(result){
            if(result == true){
                swal("回复成功！");
            }else{
                swal("发布失败！");
            }
            $('#reply').summernote('code','');
            setTimeout( function(){
                history.go(0);
            }, 1* 1000 );
        }
    })
}
function postzan() {
    $.ajax({
        type: "POST",
        url: "/discussion/postzan",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            post_id:Postinfo.post.id,
        }),success:function(result){
            if(result ==0){
                swal("点赞成功！");
                zan=$('#zan').html();
                $('#zan').html("");
                $('#zan').html( parseInt(zan)+1);
                $("#iszan").html("已赞");
            }else{
                swal("取消点赞！");
                zan=$('#zan').html();
                $('#zan').html("");
                $('#zan').html( parseInt(zan)-1);

                $("#iszan").html("点赞");
                 }



        }
    })
}
function replyzan(id){
    $.ajax({
        type: "POST",
        url: "/discussion/replyzan",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            id:id,
        }),success:function(result){
            if(result ==true){
                swal("点赞成功！");

            }else{
                swal("点赞失败！");
            }

        }
    })
}
function addreplyson(id,level) {
    console.log(id);
    console.log($(".content").val());
    if($(".content").val()==""){
        toastr.error("","回复内容不能为空");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/discussion/addreplyson",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            post_id:Postinfo.post.id,
            pid:id,
            level:level,
            content:$(".content").val()
        }),success:function(result){
            if(result ==true){
                swal("回复成功！");

            }else{
                swal("回复失败！");
            }
            setTimeout( function(){
                history.go(0);
            }, 1* 1000 );

        }
    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}