$(document).ready(function () {
    queryUserInfo();
});
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    queryUserInfo();
}
function resetUserInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 select").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryUserInfo() {
    $.ajax({
        type: "POST",
        url: "/demo/SlectMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "userName" : $('#userName').val(),
            "sex" : $('#userSex').val(),
            "userPhone" : $('#userPhone').val(),
            "userMail" : $('#userMail').val()
        }),
        success:function (result) {
            var dataTable = $('#userInfoTable');
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
                    "data" : "user_name"
                },{
                    "data" : "user_sex"
                },{
                    "data" : "user_phone"
                },{
                    "data" : "user_mail"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='删除用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showEditUser(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        return a;
                    },
                    "targets" :5
                },
                {
                    "render" : function(data, type, row) {
                        var a = ""
                        if(row.user_sex == "2"){
                            a += "女"
                        }else{
                            a += "男"
                        }
                        return a;
                    },
                    "targets" :2
                }]
            });
        }
    })
}
function deleteUser(id) {
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
                    url: "/demo/UserDelete",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data:JSON.stringify({
                        "id" : id
                    }),
                    success:function (result){
                        if(result.flag == "1"){
                            queryUserInfo();
                            swal("删除成功！", "用户已被删除", "success");
                        }else{
                            swal("删除失败！", "用户暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                 swal("已取消", "你取消了删除用户操作", "error");
            }
        });
}
//展示用户编辑详情模态窗口
function showEditUser(id) {
    resetUserInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑用户")
        $("#dialogUserName").attr("readonly",true)
        $("#dialogUserId").val(id)
        $.ajax({
            type: "POST",
            url: "/demo/GetUserById",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : id
            }),
            success:function (result){
                $("#dialogUserName").val(result.user_name)
                $("#dialogUserSex").val(result.user_sex)
                $("#dialogUserPhone").val(result.user_phone)
                $("#dialogUserMail").val(result.user_mail)
            }
        })
    }else{
        $("#dialogUserName").attr("readonly",false)
        $("#dialogTitle").html("添加用户")
    }

}
//新增或更新用户信息
function saveOrUpdateUserInfo() {
    $.ajax({
        type: "POST",
        url: "/demo/SaveOrUpdateUser",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "id" : $("#dialogUserId").val(),
            "userName" : $("#dialogUserName").val(),
            "sex" : $("#dialogUserSex").val(),
            "userPhone" : $("#dialogUserPhone").val(),
            "userMail" : $("#dialogUserMail").val()
        }),
        success:function (result){
            if(result.flag == 1){
                queryUserInfo();
                //关闭模态窗口
                $('#myModal5').modal('hide');
                swal("保存成功！", result.message, "success");
            }else{
                swal("保存失败！", result.message, "error");
            }
        }
    })
}

