$(document).ready(function ()
{
    drawNavAct(6);
    showFile();
    indexUploaderSelect();
    resetForm();
    //loadLayerDate();
});

function updateTime()
{
    TimeChoose();
    var check = document.getElementById('InputFileTime').value;
    console.log(check.length);
    if(check.length !== 0)
    {
        var startTime;
        var endTime;
        laydate({
            elem: '#InputFileTime', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
            event: 'focus' //响应事件。如果没有传入event，则按照默认的click
        });
    }
}
function TimeChoose()
{
    var check = document.getElementById('InputFileTime').value;
    console.log(check.length);
    if(check.length===0)
    {
        loadLayerDate();
    }
    else
    {
        //$(".form-horizontal input").val("");
        //$(".InputFileTime").val("");
    }
}
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    $(".InputFileName").val("");
    $(".InputFileUploader").val("");
    $(".InputFileTime").val("");
    showFile();
    //loadLayerDate();
}
function loadLayerDate() {
    $('#InputFileTime').val(laydate.now(0, 'YYYY-MM-DD'));
    //alert($('#InputFileTime').val());
    var startTime;
    var endTime;
    laydate({
        elem: '#InputFileTime', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
        event: 'focus' //响应事件。如果没有传入event，则按照默认的click
    });
}
function indexUploaderSelect() {
    $.ajax({
        type: "POST",
        url: "/resource/getUploaderList",
        dataType: "json",
        success:function (result){
            //alert(JSON.stringify(result));
            var uploaderSelectInfo = "";
            for (var i=0; i<result.length; i++){
                uploaderSelectInfo += "<option value='"+result[i].id+"'>"+result[i].name+"</option>"
            }
            $("#InputFileUploader").append(uploaderSelectInfo);
        }
    })
}
function formatTime(date) {
    var date = new Date(date);
    // 有三种方式获取
    var time1 = date.getTime();
    var time2 = date.valueOf();
    var time3 = Date.parse(date);
    return time1/1000;
}
function showFile()
{
    //alert($('#InputFileTime').val());
    var dataTime = formatTime($('#InputFileTime').val());
    //alert(dataTime);
    //alert(formatTime($('#InputFileTime').val()));
    $.ajax({
        type:'POST',
        url:'/resource/getFileListByFlag',
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "name" : $('#InputFileName').val(),
            "uploader_id": $('#InputFileUploader').val(),
            "time" : dataTime,
            "flag" : $('#InputFileFlag').val(),
        }),

        success:function(result)
        {
            for(var i = 0; i < result.length; i++)
            {
                var date = new Date(result[i].upload_time*1000);
                result[i].upload_time = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate();
                var fileSize = getSize(result[i].size);
                result[i].size = fileSize;
                if(result[i].flag==0)result[i].flag = "教师文件";
                else result[i].flag = "公共文件";
            }
            var dataTable = $('#fileInfoTable');
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
                    "data" : "uploader_name"
                },{
                    "data" : "upload_time"
                },{
                    "data" : "size"
                },{
                    "data" : "flag"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='downloadFile(\""+row.id+"\")' data-toggle='modal' title='下载' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;下载</button>"
                        return a;
                    },
                    "targets" :6
                }]
            });

        }
    })
}

function downloadFile(id)
{
    $.ajax({
        type: "POST",
        url: "/resource/checkFileExistence",
        dataType: "json",
        data: {
            id: id,
        },
        success:function (result){
            if(result.flag == 1)
            {
                window.location.href="/resource/downloadFile?id="+id;
            }
            else
            {
                swal("下载失败！", "文件不存在，请联系教师或管理员", "error");
            }
        }
    })
}
function getSize(size) {
    var fileSize = '0KB';
    if (size > 1024 * 1024) {
        fileSize = (Math.round(size / (1024 * 1024))).toString() + 'MB';
    } else {
        fileSize = (Math.round(size / 1024)).toString() + 'KB';
    }
    return fileSize;
}