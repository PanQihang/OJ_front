$(document).ready(function () {
    $('#makeTime').daterangepicker();
    queryRoleInfo()
});
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    queryRoleInfo();
}
function resetRoleInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 textarea").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 textarea").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryRoleInfo() {
    $.ajax({
        type: "POST",
        url: "/roleMn/getRoleMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "role_name" : $('#roleName').val(),
            "role_code" : $('#roleCode').val()
        }),
        success:function (result) {
            var dataTable = $('#roleInfoTable');
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
                    "data" : "role_name"
                },{
                    "data" : "role_code"
                },{
                    "data" : "role_desc"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "<button type='button' class='btn btn-primary'  onclick='deleteRole(\""+row.id+"\")' title='删除角色' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-trash-o'></i>&nbsp;删除</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showEditRole(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑角色' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showAuthTree(\""+row.id+"\")' data-toggle='modal' data-target='#myModal6' title='配置权限' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-tag'></i>&nbsp;配置</button>"
                        return a;
                    },
                    "targets" :4
                }]
            });
        }
    })
}
function deleteRole(id) {
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
                    url: "/roleMn/roleDelete",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == 1){
                            queryRoleInfo();
                            swal("删除成功！", "角色已被删除", "success");
                        }else{
                            swal("删除失败！", "角色暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                 swal("已取消", "你取消了删除角色操作", "error");
            }
        });
}
//展示用户编辑详情模态窗口
function showEditRole(id) {
    resetRoleInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑角色")
        $("#dialogRoleId").val(id)
        $.ajax({
            type: "POST",
            url: "/roleMn/getRoleById",
            dataType: "json",
            data:{
                "id" : id
            },
            success:function (result){
                $("#dialogRoleName").val(result.role_name)
                $("#dialogRoleCode").val(result.role_code)
                $("#dialogRoleDesc").val(result.role_desc)
            }
        })
    }else{
        $("#dialogTitle").html("添加角色")
        $.ajax({
            type: "POST",
            url: "/roleMn/getcode",
            dataType: "json",
            success:function (result){
                $("#dialogRoleCode").val(result)
            }
        })
    }

}
//新增或更新用户信息
function saveOrUpdateRoleInfo() {
    if(validform().form()) {
        $.ajax({
            type: "POST",
            url: "/roleMn/roleSaveOrUpdate",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogRoleId").val(),
                "role_name" : $("#dialogRoleName").val(),
                "role_code" : $("#dialogRoleCode").val(),
                "role_desc" : $("#dialogRoleDesc").val()
            }),
            success:function (result){
                if(result.flag == 1){
                    queryRoleInfo();
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
    return $("#dialogRoleForm").validate({
        rules: {
            dialogRoleName: {
                required: true,
                maxlength: 32
            },
            dialogRoleDesc: {
                required: true,
                maxlength: 32
            }
        },
        messages: {
            dialogRoleName: {
                required: icon + "角色名称不能为空",
                maxlength: icon + "角色名称最大长度为32"
            },
            dialogRoleDesc: {
                required: icon + "角色详情不能为空",
                maxlength: icon + "角色详情最大长度为32"
            }
        }
    });
}
