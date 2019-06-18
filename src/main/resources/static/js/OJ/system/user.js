$(document).ready(function () {
    queryUserInfo();
    indexRoleSelect();
});
var icon = "<i class='fa fa-times-circle'></i>";
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
        url: "/userMn/getUserMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "account" : $('#userAccount').val(),
            "name" : $('#userName').val(),
            "role" : $('#userRole').val()
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
                    "data" : "account"
                },{
                    "data" : "name"
                },{
                    "data" : "course_num"
                },{
                    "data" : "role_name"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='showEditUser(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='删除用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='reSetPassord(\""+row.id+"\")' data-toggle='modal' data-target='#resetPassword' title='重置密码' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-refresh'></i>&nbsp;重置密码</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='courseList(\""+row.id+"\")' data-toggle='modal' data-target='#courseListDialog' title='课程列表' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;课程列表</button>"
                        return a;
                    },
                    "targets" :5
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
                    url: "/userMn/userDelete",
                    // contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
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
        $("#dialogUserAccount").attr("readonly",true)
        $("#dialogUserId").val(id)
        $.ajax({
            type: "POST",
            url: "/userMn/getUserMapList",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : id
            }),
            success:function (result){
                $("#dialogUserAccount").val(result[0].account)
                $("#dialogUserName").val(result[0].name)
                $("#dialogUserRole").val(result[0].role)
            }
        })
    }else{
        $("#dialogUserAccount").attr("readonly",false)
        $("#dialogTitle").html("添加用户")
    }

}
//新增或更新用户信息
function saveOrUpdateUserInfo() {
    if($("#dialogUserInfo").validate({
        rules: {
            dialogUserAccount: {
                required: true,
                maxlength: 32
            },
            dialogUserName: {
                required: true,
                maxlength: 32
            },
            dialogUserRole: {
                required: true
            }
        },
        messages: {
            dialogUserAccount: {
                required: icon + "登录名不能为空",
                minlength: icon + "登录名最长为32"
            },
            dialogUserName: {
                required: icon + "姓名不能为空",
                equalTo: icon + "姓名最长为32"
            },
            dialogUserRole: {
                required: icon + "角色不能为空"
            }
        }
    }).form()){
        $.ajax({
            type: "POST",
            url: "/userMn/saveOrUpdateUser",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogUserId").val(),
                "account" : $("#dialogUserAccount").val(),
                "name" : $("#dialogUserName").val(),
                "role" : $("#dialogUserRole").val()
            }),
            success:function (result){
                if(result.flag == 1){
                    queryUserInfo();
                    //关闭模态窗口
                    $('#myModal5').modal('hide');
                    swal("保存成功！", "success");
                }else{
                    swal("保存失败！", result.message, "error");
                }
            }
        });
    }
}
function indexRoleSelect() {
    $.ajax({
        type: "POST",
        url: "/userMn/getRoleSelectInfo",
        dataType: "json",
        success:function (result){
            var roleSelectInfo = "";
            for (var i=0; i<result.length; i++){
                roleSelectInfo += "<option value='"+result[i].id+"'>"+result[i].role_name+"</option>"
            }
            $("#userRole").append(roleSelectInfo);
            $("#dialogUserRole").append(roleSelectInfo);
        }
    })
}

//重置弹出框的内容
function rePwdformReset() {
    $("#resetPassword input").val("");
    $("#resetPassword input").removeClass("error");
    $("#resetPassword label.error").remove()
}

function reSetPassord(id) {
    rePwdformReset();
    $("#resetPasswordUserId").val(id)
}

//保存重置的密码
function saveNewPassword() {
    if($("#resetPasswordForm").validate({
        rules: {
            newPassword: {
                required: true,
                minlength: 6
            },
            verifyPassword: {
                required: true,
                equalTo: "#newPassword"
            }
        },
        messages: {

            newPassword: {
                required: icon + "请填写新密码",
                minlength: icon + "密码最少为6位"
            },
            verifyPassword: {
                required: icon + "请再次输入新密码",
                equalTo: icon + "两次密码输入不一致"
            }
        }
    }).form()) {
        $.ajax({
            type: "POST",
            url: "/resetPassword",
            // contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data:{
                "id" : $("#resetPasswordUserId").val(),
                "newPassword" : $("#newPassword").val()
            },
            success:function (result){
                if(result){
                    //关闭模态窗口
                    $('#resetPassword').modal('hide');
                    swal("修改成功！", "密码已成功修改", "success");
                }else{
                    swal("修改失败！", "密码修改失败", "error");
                }

            }
        })
    }
}

function courseList(id) {
    $('#CLDuserId').val(id);
    $('#CLDtbody').html("");
    $.each(document.getElementsByName("CLDselect"),function (index,vaule,arr) {vaule.checked = false});
    document.getElementsByName("btSelectAll")[0].checked = false;
    $.ajax({
        type: "POST",
        url: "/userMn/getCourseList",
        dataType: "json",
        data: {
            "id": id
        },
        success: function (result) {
            var innerHtml = ''
            var isSelectAll = true
            for (i = 0; i < result.length; i++){
                innerHtml += "<tr><td>"
                if(result[i].admin_id == null){
                    innerHtml += "<input name='CLDselect' onclick='checkSelectAll()' type='checkbox' value='"+result[i].id+"'>"
                    isSelectAll = false
                }else{
                    innerHtml += "<input name='CLDselect' onclick='checkSelectAll()' type='checkbox' checked value='"+result[i].id+"'>"
                }
                innerHtml += "</td><td>"+result[i].name+"</td></tr>"
            }
            if(isSelectAll){
                document.getElementsByName("btSelectAll")[0].checked = true
            }
            $('#CLDtbody').append(innerHtml)
        }
    });
}

//绑定全选按钮事件
$("#btSelectAll").click(function(){
    if(document.getElementsByName("btSelectAll")[0].checked){
        $.each(document.getElementsByName("CLDselect"),function (index,vaule,arr) {
            vaule.checked = true
        })
    }else{
        $.each(document.getElementsByName("CLDselect"),function (index,vaule,arr) {
            vaule.checked = false
        })
    }
});

function checkSelectAll() {
    if($("input[name='CLDselect']:checked").length == $("input[name='CLDselect']").length){
        document.getElementsByName("btSelectAll")[0].checked = true;
    }else{
        document.getElementsByName("btSelectAll")[0].checked = false;
    }
}

function saveCld() {
    var checkedIds = []
    $.each($("input[name='CLDselect']:checked"),function (index,vaule,arr) {
        checkedIds.push(vaule.value)
    })
    if(checkedIds.length == 0){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": false,
            "positionClass": "toast-top-center",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "2500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr.error("请选择一门课程！", "无效操作")
        return
    }
    $.ajax({
        type: "POST",
        url: "/userMn/saveCourseList",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
            "user_id": $("#CLDuserId").val(),
            "course_list": checkedIds
        }),
        success: function (result) {
            if(result.flag == 1){
                //关闭模态窗口
                $('#courseListDialog').modal('hide');
                queryUserInfo();
                swal("保存成功！", "success");
            }else{
                swal("保存失败！", "error");
            }
        }
    });
}