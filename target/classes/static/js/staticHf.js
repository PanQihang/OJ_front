
//注销功能
$('#a_logout').click(function () {
    $("#user_operate").click();
    swal({
            title: "确认注销?",
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
                window.location.href='/login/Logout';
            }else {
                 swal("已取消", "", "error");
            }
        });
});
$("#user_operate").click(function () {
    debugger
    if ($("#allUserOperate").css("display") == "none"){
        $("#allUserOperate").css("display", "block")
    } else{
        $("#allUserOperate").css("display", "none")
    }
})

//重置弹出框的内容
function formReset() {
    $("#user_operate").click();
    $("#resetPassword input").val("");
    $("#resetPassword input").removeClass("error");
    $("#resetPassword label.error").remove()
}

//保存重置的密码
function saveNewPassword() {
    if(validform().form()) {
        $.ajax({
            type: "POST",
            url: "/resetPassword",
            // contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data:{
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
            },
            error:function (e) {
                console.log(e)
            }
        })
    }
}

//对重置密码弹窗中的数据进行校验
function validform() {
    var icon = "<i class='fa fa-times-circle'></i>";
    return $("#resetPasswordForm").validate({
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
    });
}
//判断用户是否登陆，若已登陆返回true。若未登录弹出登陆弹窗，返回false（此功能全页面通用）
function isUserLogin(page) {
    var isLogin = false;
    $.ajax({
        type: "POST",
        url: "/login/checkLogin",
        dataType: "json",
        async:false,
        success:function (result){
            isLogin = result;
        }
    })
    if(!isLogin){
        openLoginPage(page)
    }
    return isLogin;
}
function openLoginPage(page) {
    $("#loginDialog input").val("");
    $('#skipPageUrl').val(page)
    $('#loginDialog').modal('show');
}
function openPage(page) {
    if ($("#allUserOperate").css("display") != "none"){
        $("#allUserOperate").css("display", "none")
    }
    if("/index/"!=page){
        if (isUserLogin(page)){
            window.location.href = page;
        }
    }else{
        window.location.href = page;
    }
}

function dialogLogin() {
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
    if($("#dialogUserName").val() == '' || $("#dialogUserPassword").val() == ''){
        toastr.warning("登陆信息不能为空","登陆警告")
        return;
    }
    $.ajax({
        type: "POST",
        url: "/login/UserLogin",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data:JSON.stringify({
            "username" : $("#dialogUserName").val(),
            "passwords" : $("#dialogUserPassword").val(),
        }),
        success:function (result){
            if (result){
                window.location.href = $("#skipPageUrl").val()
            } else{

                toastr.error("帐号密码错误","登陆失败！")
            }
        }
    })
}


// 回车事件绑定
$(document).keypress(function(e) {
    var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if (eCode == 13){
        if($('#loginDialog').css('display') == 'block'){
            dialogLogin();
        }
    }
});

function drawNavAct(index) {
    $(".OJnav").eq(index).addClass("act");
    $(".OJnav").eq(index).find('a').css("color","white")
}