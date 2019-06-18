$(document).ready(function () {
    queryCourseInfo();
});
var icon = "<i class='fa fa-times-circle'></i>";
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    queryCourseInfo();
}
function resetCourseInfoDialog() {
    $("#myModal5 input").val("");
    $("#myModal5 select").val("");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 select").removeClass("error");
    $("#myModal5 label.error").remove()
}
function queryCourseInfo() {
    $.ajax({
        type: "POST",
        url: "/courseMn/getCourseMapList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "id" : $('#courseId').val(),
            "name" : $('#courseName').val(),
        }),
        success:function (result) {
            //var ans = JSON.stringify(result);
            //alert(ans);
            var dataTable = $('#courseInfoTable');
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
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='courseClassShow(\""+row.id+"\")' data-toggle='modal' data-target='#courseClassShowDialog' title='班级绑定' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;班级绑定</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='showEditCourse(\""+row.id+"\")' data-toggle='modal' data-target='#myModal5' title='编辑课程' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil-square-o'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteCourse(\""+row.id+"\")' title='删除课程' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-user-times'></i>&nbsp;删除</button>"
                        return a;
                    },
                    "targets" :2
                }]
            });
        }
    })
}
function deleteCourse(id) {
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
                    url: "/courseMn/courseDelete",
                    // contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == "1"){
                            queryCourseInfo();
                            swal("删除成功！", "课程已被删除", "success");
                        }else{
                            swal("删除失败！", "课程暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除课程操作", "error");
            }
        });
}
//展示课程编辑详情模态窗口
function showEditCourse(id) {
    resetCourseInfoDialog();
    if(id!=''){
        $("#dialogTitle").html("编辑课程")
        $("#dialogCourseId").val(id)
        $.ajax({
            type: "POST",
            url: "/courseMn/getCourseMapList",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : id
            }),
            success:function (result){
                $("#dialogCourseName").val(result[0].name)
            }
        })
    }else{
        $("#dialogTitle").html("添加课程")
    }

}
//新增或更新课程信息
function saveOrUpdateCourseInfo() {
    if($("#dialogCourseInfo").validate({
        rules: {
            dialogCourseName: {
                required: true,
                maxlength: 32
            },
        },
        messages: {
            dialogUserName: {
                required: icon + "课程名不能为空",
                equalTo: icon + "课程名最长为32"
            },
        }
    }).form()){
        //alert($("#dialogCourseId").val());
        //alert($("#dialogCourseName").val());
        $.ajax({
            type: "POST",
            url: "/courseMn/saveOrUpdateCourse",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({
                "id" : $("#dialogCourseId").val(),
                "name" : $("#dialogCourseName").val(),
            }),
            success:function (result){
                if(result.flag == 1){
                    queryCourseInfo();
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

function courseClassShow(id) {
    $('#CLDcourseId').val(id);
    $('#CLDtbody').html("");
    $.each(document.getElementsByName("CLDselect"),function (index,vaule,arr) {vaule.checked = false});
    document.getElementsByName("btSelectAll")[0].checked = false;
    $.ajax({
        type: "POST",
        url: "/courseMn/getClassMapByCourseList",
        dataType: "json",
        data: {
            "id": id
        },
        success: function (result) {
            //alert(JSON.stringify(result[0].id));
            //alert(JSON.stringify(result[0].name));
            var innerHtml = ''
            var isSelectAll = true
            for (i = 0; i < result.length; i++){
                innerHtml += "<tr><td>"
                if(result[i].course_id == null){
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
        toastr.error("请选择一个班级！", "无效操作")
        return
    }
    $.ajax({
        type: "POST",
        url: "/courseMn/saveCourseClassList",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
            "course_id": $("#CLDcourseId").val(),
            "class_list": checkedIds
        }),
        success: function (result) {
            if(result.flag == 1){
                //关闭模态窗口
                $('#courseClassShowDialog').modal('hide');
                queryCourseInfo();
                swal("保存成功！", "success");
            }else{
                swal("保存失败！", "error");
            }
        }
    });
}