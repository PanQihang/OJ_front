
//全局变量
var NewStudentNum =0; //批量增加学生时，学生的总数


$(document).ready(function () {
    queryStudentInfo();
    indexClassNameSelect();

});
var icon = "<i class='fa fa-times-circle'></i>";
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    queryStudentInfo();
}
function resetStudentInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 select").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryStudentInfo() {
    $.ajax({
        type: "POST",
        url: "/studentMn/getTargetStudentList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "account" : $('#Account').val(),
            "student_name" : $('#studentName').val(),
            "class_id" : $('#classId').val()
        }),
        success:function (result) {
            var dataTable = $('#stuInfoTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "data" : result,
                "columns" : [ {
                    "data" : "account"
                },{
                    "data" : "student_name"
                },{
                    "data" : "class_name"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='showEditStudent(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteStudent(\""+row.id+"\")' title='删除用户' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='reSetPassord(\""+row.id+"\")' data-toggle='modal' data-target='#resetPassword' title='重置密码' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-refresh'></i>&nbsp;重置密码</button>"
                        //a += "<button type='button' class='btn btn-primary' onclick='courseList(\""+row.id+"\")' data-toggle='modal' data-target='#courseListDialog' title='课程列表' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;课程列表</button>"
                        return a;
                    },
                    "targets" :3
                }]
            });
        }
    })
}
function deleteStudent(id) {
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
                    url: "/studentMn/deleteTheStudent",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data:JSON.stringify({
                        "id" : id
                    }),
                    success:function (result){
                        if(result.result == "succeed"){
                            queryStudentInfo();
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
function showEditStudent(id) {
    resetStudentInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑用户")
        $("#dialogStudentId").attr("readonly",true)
        $("#dialogStudentId").val(id)
        $.ajax({
            type: "POST",
            url: "/studentMn/getTargetStudentList",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : id
            }),
            success:function (result){
                $("#dialogStuAccount").val(result[0].account)
                $("#dialogStudentName").val(result[0].student_name)
                $("#dialogClassName").val(result[0].class_id)
            }
        })
    }else{
        $("#dialogStudentId").attr("readonly",true)
        $("#dialogTitle").html("添加用户")
    }
}
function resetAddMoreStudentDialog(){
    $("#myModal5B select").val("");
    $('#upFileX').val('');
}
function showAddMoreStudent(){
    resetAddMoreStudentDialog();
    $("#dialogTitleB").html("批量添加用户");

}
//新增或更新用户信息
function saveOrUpdateStudentInfo() {
    if($("#dialogStudentInfo").validate({
        rules: {
            dialogStuAccount: {
                required: true,
                maxlength: 32
            },
            dialogStudentName: {
                required: true,
                maxlength: 32
            },
            dialogClassName: {
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
            url: ($("#dialogStudentId").val()==''?"/studentMn/addNewStudent":"/studentMn/changeTheStudent"),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogStudentId").val(),
                "account" : $("#dialogStuAccount").val(),
                "name" : $("#dialogStudentName").val(),
                "class_id" : $("#dialogClassName").val()
            }),
            success:function (result){
                if(result.result == "succeed"){
                    queryStudentInfo();
                    //关闭模态窗口
                    $('#myModal5').modal('hide');
                    swal("保存成功！", "success");
                }else{
                    swal("保存失败！", result.message);
                }
            }
        });
    }
}
//获取所有班级信息
function indexClassNameSelect() {
    $.ajax({
        type: "POST",
        url: "/studentMn/getClassList",
        dataType: "json",
        success:function (result){
            var roleSelectInfo = "";
            for (var i=0; i<result.length; i++){
                roleSelectInfo += "<option value='"+result[i].id+"'>"+result[i].name+"</option>"
            }
            $("#classId").append(roleSelectInfo);
            $("#dialogClassName").append(roleSelectInfo);
            $("#dialogClassNameB").append(roleSelectInfo);
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
            url: "/studentMn/changeTheStudentPW",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data:JSON.stringify({
                "id" : $("#resetPasswordUserId").val(),
                "password" : $("#newPassword").val()
            }),
            success:function (result){
                if(result.result=='succeed'){
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
//批量添加学生时，展示预览信息
function showStudentInfList() {
    $('#CLDtbody').html("");
    var className = $('#dialogClassNameB').find('option:selected').text();
    var obj = document.getElementById('upFileX')//$('#upFileX');
    if($('#upFileX').val()==''){
        swal('未选择文件','请选择要读取的excel文件');
        return ;
    }
    console.log($('#upFileX').val());

    $('#CLDuserId').val( className );

    var str='';
    str="<thead>" + "<tr>" + "<th width=\"30%\">学号</th>\n" + "<th width=\"30%\">姓名</th>\n" + "<th width=\"30%\">班级</th>\n" + "<th width=\"10%\">状态</th>\n" + "</tr>\n" + "</thead>";
    $('#CLDtbody').append(str);
    if(!obj.files) {
        return;
    }
    var f = obj.files[0];
    var reader = new FileReader();
    var wb;
    reader.onload = function(e) {

        var data = e.target.result;
        wb = XLSX.read(data, {
            type: 'binary'
        });
        //wb.SheetNames[a]表示读取的是excel中的第几张表(下标从0开始)
        var JData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        NewStudentNum = JData.length; //全局变量NewStudentNum 保存着当前学生集的数量
        var Taccount, Tname;
        for(var i=0; i<JData.length; i++){
            Taccount = (JData[i]['account']==undefined?'':JData[i]['account']);
            Tname = (JData[i]['name']==undefined?'':JData[i]['name']);
            str="<tr>"
            str+="<td><input type='text' id='nStuAccount"+i+"' value='"+Taccount+"' /></td>";
            str+="<td><input type='text' id='nStuName"+i+"' value='"+Tname+"' /></td>";
            str+="<td><span id='nStuClass"+i+"' >"+className+" </span></td>";
            str+="<td><span id='nStuState"+i+"' >"+'待确定'+"</span></td>";
            str+="</tr>"
            //console.log(str);
            $('#CLDtbody').append(str);
        }
    }
    reader.readAsBinaryString(f);
}
//批量添加学生账号
function saveStudentList(){
    var classId = $('#dialogClassNameB').val();
    if(classId == ''){
        swal('未选择班级','请先选择班级');
        return ;
    }
    var i, cell, strName, strAccount;
    cell = [];
    for(i=0; i<NewStudentNum; i++){
        strAccount='#nStuAccount'+ i; strName = '#nStuName'+i;
        cell[i]={
            'account' : $(strAccount).val(),
            'name' : $(strName).val(),
            'class_id' : classId,
            'elementId' : i
        }
        console.log(JSON.stringify(cell[i]));
        $.ajax({
            type: "POST",
            url: "/studentMn/addNewStudent",
            async:false,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify(cell[i]),
            success:function (result){
                var strState;
                strState = '#nStuState'+result.elementId;
                if(result.result == "succeed"){
                    $(strState).text("添加成功");
                    //关闭模态窗口
                    //$('#myModal5').modal('hide');
                }else{
                    $(strState).text(result.message); //显示后台对错误的判断结果
                    //swal("保存失败！", result.message);
                }
            }
        });
    }

}

//excel文件上传的调用(暂废)
function upFile() {
    var formData = new FormData();
    formData.append('file', $('#upFileX')[0].files[0]);
    $.ajax({
        url: "/studentMn/upFile",
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
        },
        success: function (data) {
            if (data.result == 'succeed') {
                swal("批量添加成功！", "success");
            } else {
                swal("批量添加失败！", data.message);
            }
        }
    });
}

