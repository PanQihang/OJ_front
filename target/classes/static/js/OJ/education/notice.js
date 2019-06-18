$(function() {
    queryNoticeInfo();
    loadSummernote();
});
function resetNoticeInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 textarea").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 textarea").removeClass("error");
    $("#myModal5 label.error").remove()
}
function formatTime(date) {
    var date = new Date(date);
    // 有三种方式获取
    var time1 = date.getTime();
    var time2 = date.valueOf();
    var time3 = Date.parse(date);
    return time1/1000;
}
function formatDate (date) {
    var tt = new Date(date)
    var date= new Date(Date.parse(tt));
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var time = y+'-'+m+'-'+d+' '+hour+':'+min;
    return time;
}

function formatDate1 (date) {
    var tt = new Date(date)
    var date= new Date(Date.parse(tt));
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var time = y+'-'+m+'-'+d+' ';
    return time;
}
function queryNoticeInfo() {
    $.ajax({
        type: "POST",
        url: "/noticeMn/getNoticeMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "title" : $('#noticeTitle').val(),
            "author" : $('#noticeAuthor').val(),
            "time" : formatTime($('#noticeTime').val()),
        }),
        success:function (result) {
            var len = result.length;
            for(var i=0;i<len;i++)
            {
                result[i].time = formatDate(result[i].time*1000);
                if(result[i].content.length>100)
                {
                    var str = result[i].content;
                    result[i].content = str.slice(0,50)+"......";
                }
            }
            var dataTable = $('#noticeInfoTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "data" : result,
                "columns" : [{
                    "data" : "num"
                },{
                    "data" : "title"
                },{
                    "data" : "author"
                },{
                    "data" : "time"
                },{
                    "data" : "content"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='showContent(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='查看完整内容' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;查看全部内容</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showEditNotice(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑通知' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteNotice(\""+row.id+"\")' title='删除通知' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        return a;
                    },
                    "targets" :5
                }]
            });
        }
    })
}
//重置输入框
function resetForm() {
    $(".form-horizontal input").val("");
    queryNoticeInfo();
}
function showContent(id) {
    resetNoticeInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("查看教学通知全部内容")
        $("#dialogNoticeId").val(id)
        $.ajax({
            type: "POST",
            url: "/noticeMn/getNoticeById",
            dataType: "json",
            data:{
                "id" : id
            },
            success:function (result){
                $("#dialogNoticeContent").code(result.content)
                $("#lable1").hide()
                $("#lable2").hide()
                $("#dialogNoticeTitle").hide()
                $("#dialogNoticeAuthor").hide()
                $("#button1").hide()
            }
        })
    }
}
//展示IP编辑详情模态窗口
function showEditNotice(id) {
    $("#button1").show()
    $("#lable1").show()
    $("#lable2").show()
    $("#dialogNoticeTitle").show()
    $("#dialogNoticeAuthor").show()
    resetNoticeInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑教学通知")
        $("#dialogNoticeId").val(id)
        $.ajax({
            type: "POST",
            url: "/noticeMn/getNoticeById",
            dataType: "json",
            data:{
                "id" : id
            },
            success:function (result){
                $("#dialogNoticeContent").code(result.content)
                $("#dialogNoticeTitle").val(result.title)
                $("#dialogNoticeAuthor").val(result.author)
            }
        })
    }else{
        $("#dialogTitle").html("添加通知")
        $("#dialogNoticeContent").code("")
    }
}

function loadSummernote() {
    $("#dialogNoticeContent").summernote({
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

function deleteNotice(id) {
    swal({
            title: "确认删除?",
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
                    url: "/noticeMn/noticeDelete",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == 1){
                            queryNoticeInfo();
                            swal("删除成功！", "通知已被删除", "success");
                        }else{
                            swal("删除失败！", "通知暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除通知操作", "error");
            }
        });
}
//新增或更新IP信息
function saveOrUpdateNoticeInfo() {
    if(validform().form()) {
        $.ajax({
            type: "POST",
            url: "/noticeMn/noticeSaveOrUpdate",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogNoticeId").val(),
                "title" : $("#dialogNoticeTitle").val(),
                "author" : $("#dialogNoticeAuthor").val(),
                "content" : $("#dialogNoticeContent").code(),
                "time" : Date.parse(new Date())/1000
            }),
            success:function (result){
                if(result.flag == 1){
                    queryNoticeInfo();
                    //关闭模态窗口
                    $('#myModal5').modal('hide');
                    swal("保存成功！", result.message, "success");
                }else{
                    swal("保存失败！", result.message, "error");
                }
            }
        })
    }
}

function validform() {
    var icon = "<i class='fa fa-times-circle'></i>";
    return $("#dialogNoticeForm").validate({
        rules: {
            dialogNoticeTitle: {
                required: true,
                maxlength: 50
            },
            dialogNoticeAuthor: {
                required: true,
                maxlength: 20
            },
            dialogNoticeContent: {
                required: true,
            }
        },
        messages: {
            dialogNoticeTitle: {
                required: icon + "标题不能为空",
                maxlength: icon + "标题最大长度为50"
            },
            dialogNoticeAuthor: {
                required: icon + "作者不能为空",
                maxlength: icon + "作者最大长度为20"
            },
            dialogNoticeContent: {
                required: icon + "内容不能为空",
            }
        }
    });
}