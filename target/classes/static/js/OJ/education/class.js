$(document).ready(function () {
    queryClassInfo();
    indexMajorSelect();
    indexGradeSelect();
});
var icon = "<i class='fa fa-times-circle'></i>";
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    queryClassInfo();
}
function resetClassInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 select").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryClassInfo() {
    //alert("come in here");
    $.ajax({
        type: "POST",
        url: "/classMn/getClassMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "id" : $('#classId').val(),
            "name" : $('#className').val(),
            "major_id" : $('#majorName').val(),
            "grade_id" : $('#gradeName').val()
        }),
        success:function (result) {
            //var ans = JSON.stringify(result);
            //alert(ans);
            var dataTable = $('#classInfoTable');
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
                    "data" : "major_name"
                },{
                    "data" : "grade_name"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='classStudentShow(\""+row.id+"\")' data-toggle='modal' data-target='#classStudentShowDialog' title='学生列表' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;学生列表</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showEditClass(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑班级' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteClass(\""+row.id+"\")' title='删除班级' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        return a;
                    },
                    "targets" :4
                }]
            });
        }
    })
}
//展示班级编辑详情模态窗口
function showEditClass(id) {
    //alert("1231231");
    resetClassInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑班级")
        $("#dialogClassId").val(id)
        $.ajax({
            type: "POST",
            url: "/classMn/getClassMapList",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : id
            }),
            success:function (result){
                //alert(JSON.stringify(result));
                $("#dialogClassName").val(result[0].name);
                $("#dialogMajorName").val(result[0].major_id);
                $("#dialogGradeName").val(result[0].grade_id);
                if(result[0].major_id == 0)
                {
                    $("#dialogMajorName").val(0)
                }
                if(result[0].grade_id == 0)
                {
                    $("#dialogGradeName").val(0)
                }
            }
        })
    }else{
        $("#dialogTitle").html("添加班级");
        $("#dialogMajorName").val(0);
        $("#dialogGradeName").val(0)
    }
}
function indexMajorSelect() {
    $.ajax({
        type: "POST",
        url: "/classMn/getMajorSelectInfo",
        dataType: "json",
        success:function (result){
            //alert(JSON.stringify(result));
            var roleSelectInfo = "";
            for (var i=0; i<result.length; i++){
                roleSelectInfo += "<option value='"+result[i].id+"'>"+result[i].name+"</option>"
            }
            $("#majorName").append(roleSelectInfo);
            $("#dialogMajorName").append(roleSelectInfo);
        }
    })
}
function indexGradeSelect() {
    $.ajax({
        type: "POST",
        url: "/classMn/getGradeSelectInfo",
        dataType: "json",
        success:function (result){
            //alert(JSON.stringify(result));
            var roleSelectInfo = "";
            for (var i=0; i<result.length; i++){
                roleSelectInfo += "<option value='"+result[i].id+"'>"+result[i].name+"</option>"
            }
            $("#gradeName").append(roleSelectInfo);
            $("#dialogGradeName").append(roleSelectInfo);
        }
    })
}
//新增或更新班级信息
function saveOrUpdateClassInfo() {
    if($("#dialogClassInfo").validate({
        rules: {
            dialogCourseName: {
                required: true,
                maxlength: 32
            },
        },
        messages: {
            dialogUserName: {
                required: icon + "班级名不能为空",
                equalTo: icon + "班级名最长为32"
            },
        }
    }).form()){
        $.ajax({
            type: "POST",
            url: "/classMn/saveOrUpdateClass",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogClassId").val(),
                "name" : $("#dialogClassName").val(),
                "major_id" : $("#dialogMajorName").val(),
                "grade_id" : $("#dialogGradeName").val(),
                "class_id" : $("#dialogClassidId").val()
            }),
            success:function (result){
                if(result.flag == 1){
                    queryClassInfo();
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

function deleteClass(id) {
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
                    url: "/classMn/classDelete",
                    // contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == "1"){
                            queryClassInfo();
                            swal("删除成功！", "班级已被删除", "success");
                        }else{
                            swal("删除失败！", "班级暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除班级操作", "error");
            }
        });
}

function classStudentShow(id) {
    $('#CLDclassId').val(id);
    $('#CLDtbody').html("");
    $.ajax({
        type: "POST",
        url: "/classMn/getStudentMapByClassList",
        dataType: "json",
        data: {
            "id": id
        },
        success: function (result) {
            //alert(JSON.stringify(result));
            //alert(JSON.stringify(result[0].name));
            var innerHtml = ''
            for (i = 0; i < result.length; i++){
                innerHtml += "<tr><td>"
                innerHtml += result[i].student_account+"</td>"
                innerHtml += "</td><td>"+result[i].student_name+"</td></tr>"
            }
            $('#CLDtbody').append(innerHtml)
        }
    });
}
