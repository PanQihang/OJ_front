$(function() {
    queryIpInfo();
});
function resetIpInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 textarea").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 textarea").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryIpInfo() {
    $.ajax({
        type: "POST",
        url: "/ipMn/getIpMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "ip" : $('#userAccount').val(),
        }),
        success:function (result) {
            var dataTable = $('#ipInfoTable');
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
                    "data" : "ip"
                },{
                    "data" : "location"
                },{
                    "data" : "content"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='showEditIP(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑IP' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteIP(\""+row.id+"\")' title='删除IP' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        return a;
                    },
                    "targets" :4
                }]
            });
        }
    })
}
//重置输入框
function resetForm() {
    $(".form-horizontal input").val("");
    queryIpInfo();
}
//展示IP编辑详情模态窗口
function showEditIP(id) {
    resetIpInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑IP")
        $("#dialogIpId").val(id)
        $.ajax({
            type: "POST",
            url: "/ipMn/getIpById",
            dataType: "json",
            data:{
                "id" : id
            },
            success:function (result){
                $("#dialogIp").val(result.ip)
                $("#dialogIplocation").val(result.location)
                $("#dialogIpcontent").val(result.content)
            }
        })
    }else{
        $("#dialogTitle").html("添加IP")
    }
}
function deleteIP(id) {
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
                    url: "/ipMn/ipDelete",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == 1){
                            queryIpInfo();
                            swal("删除成功！", "IP已被删除", "success");
                        }else{
                            swal("删除失败！", "IP暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除IP操作", "error");
            }
        });
}
//新增或更新IP信息
function saveOrUpdateIpInfo() {
    if(validform().form()) {
        $.ajax({
            type: "POST",
            url: "/ipMn/ipSaveOrUpdate",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogIpId").val(),
                "location" : $("#dialogIplocation").val(),
                "ip" : $("#dialogIp").val(),
                "content" : $("#dialogIpcontent").val()
            }),
            success:function (result){
                if(result.flag == 1){
                    queryIpInfo();
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
    return $("#dialogIpForm").validate({
        rules: {
            dialogIp: {
                required: true,
                maxlength: 16
            },
            dialogIplocation: {
                required: true,
                maxlength: 60
            }
        },
        messages: {
            dialogIp: {
                required: icon + "IP不能为空",
                maxlength: icon + "IP最大长度为16"
            },
            dialogIplocation: {
                required: icon + "IP位置不能为空",
                maxlength: icon + "IP位置最大长度为60"
            }
        }
    });
}