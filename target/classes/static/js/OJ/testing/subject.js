var $table = $('#subjectTable');
$(function() {
    querySubjectInfo();
});
function querySubjectInfo(){
    $.ajax({
        type: "POST",
        url: "/subjectsMn/getSubjectMaplist",
        dataType: "json",
        success:function (result) {
           for(var i in result){
               if(result[i].description==null){
                   delete(result[i].description);
               }
               result[i].description=parseInt(result[i].description);
           }
            debugger
            $table.bootstrapTable('destroy');
            $table.bootstrapTable({
                data:result,
                idField: 'id',
                dataType:'json',
                columns: [
                    { field: 'check', hidden:true, checkbox: true, formatter: function (value, row, index) {
                            if (row.check == true) {
                                // console.log(row.serverName);
                                //设置选中
                                return {  checked: true };
                            }
                        }
                    },
                    { field: 'name',  title: '主题名称' },
                    // { field: 'auth_code',  title: '权限编码' },
                    // { field: 'auth_url', title: 'URL' },
                    { field: 'operate', title: '操作', align: 'center', formatter: 'operateFormatter' },
                ],
                //在哪一列展开树形
                treeShowField: 'name',
                //指定父id列
                parentIdField: 'description',
                onResetView: function(data) {
                    //console.log('load');
                    $table.treegrid({
                        initialState: 'expanded',// 所有节点都折叠
                        treeColumn: 1,
                        onChange: function() {
                            $table.bootstrapTable('resetWidth');
                        }
                    });
                    //只展开树形的第一级节点
                    //$table.treegrid('getRootNodes').treegrid('expand');
                },
                onCheck:function(row){
                    var datas = $table.bootstrapTable('getData');
                    // 勾选子类
                    selectChilds(datas,row,"id","description",true);
                    // 勾选父类
                    selectParentChecked(datas,row,"id","description")
                    // 刷新数据
                    $table.bootstrapTable('load', datas);
                },
                onUncheck:function(row){
                    var datas = $table.bootstrapTable('getData');
                    selectChilds(datas,row,"id","auth_parent",false);
                    $table.bootstrapTable('load', datas);
                },
            });
            $('#subjectTable input').attr("disabled", "true")
        }
    });
}
// 格式化按钮
function operateFormatter(value, row, index) {
    a = '';
     if (isNaN(row.description)){
        debugger
        a += '<button type="button" class="btn btn-primary" data-toggle="modal" onclick="add(\''+row.id+'\', \''+row.name+'\')" data-target="#myModal5" style="margin-right:15px; margin-bottom: -1px;"><i class="fa fa-plus" ></i>&nbsp;新增</button>'
     }
     a += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal6" onclick="update(\''+row.id+'\')" style="margin-right:15px; margin-bottom: -1px;"><i class="fa fa-pencil-square-o" ></i>&nbsp;修改</button>'
    a += '<button type="button" class="btn btn-primary" onclick="del('+row.id+')" style="margin-right:15px; margin-bottom: -1px;"><i class="fa fa-trash-o" ></i>&nbsp;删除</button>'
    return a
}

/**
 * 选中父项时，同时选中子项
 * @param datas 所有的数据
 * @param row 当前数据
 * @param id id 字段名
 * @param pid 父id字段名
 */
function selectChilds(datas,row,id,pid,checked) {
    for(var i in datas){
        if(datas[i][pid] == row[id]){
            datas[i].check=checked;
            selectChilds(datas,datas[i],id,pid,checked);
        };
    }
}

function selectParentChecked(datas,row,id,pid){
    for(var i in datas){
        if(datas[i][id] == row[pid]){
            datas[i].check=true;
            selectParentChecked(datas,datas[i],id,pid);
        };
    }
}

// function test() {
//     var selRows = $table.bootstrapTable("getSelections");
//     if(selRows.length == 0){
//         alert("请至少选择一行");
//         return;
//     }
//
//     var postData = "";
//     $.each(selRows,function(i) {
//         postData +=  this.id;
//         if (i < selRows.length - 1) {
//             postData += "， ";
//         }
//     });
//     alert("你选中行的 id 为："+postData);
//
// }
function resetAuthInfoDialog() {
    $("#myModal5 input").val("");
    $('#dialogAuthGroup').css("display", "block");
    $("#myModal5 input").removeClass("error");
    $("#myModal5 label.error").remove()
}
function add(id,name) {
    debugger;
    resetAuthInfoDialog();
    if(id!=''){
        $('#dialogPAuthName').val(name)
        $('#dialogAuthParentId').val(id)
    }else{


         $('#dialogAuthGroup').css("display", "none");
    }
}
function del(id) {
    swal({
            title: "将删除该权限和下属权限，确认删除?",
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
                    url: "/subjectsMn/subjectDelete",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == 1){
                            querySubjectInfo();
                            swal("删除成功！", "该权限已被删除", "success");
                        }else{
                            swal("删除失败！", "该权限暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除权限操作", "error");
            }
        });
}
function resetAuthInfoEditDialog() {
    $("#myModal6 input").val("");
   // $("#dialogEditAuthUrl").removeAttr("readonly");
    $("#myModal6 input").removeClass("error");
    $("#myModal6 label.error").remove()
}
function update(id) {
    resetAuthInfoEditDialog();
    $('#dialogEditAuthId').val(id);
    $.ajax({
        type: "POST",
        url: "/subjectsMn/getSubjectById",
        dataType: "json",
        data: {
            id: id
        },
        success: function (result) {
            $("#dialogEditAuthName").val(result.name);
           // $("#dialogEditAuthCode").val(result.auth_code);
           // $("#dialogEditAuthUrl").val(result.auth_url);
           // $("#dialogEditAuthIco").val(result.auth_ico);
            if(result.auth_parent == undefined){
                debugger
                $("#dialogEditAuthUrl").attr("readonly", "true")
            }
        }
    });
}
function saveSubjectInfo() {
    if(validform().form()) {
        $.ajax({
            type: "POST",
            url: "/subjectsMn/subjectSave",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify({

                subject_name:$("#dialogAuthName").val(),
                subject_parent:$("#dialogAuthParentId").val()
            }),
            success: function (result) {
                if(result.flag == 1){
                    querySubjectInfo();
                    //关闭模态窗口
                    $('#myModal5').modal('hide');
                    swal("保存成功！", result.message, "success");
                }else{
                    swal("保存失败！", result.message, "error");
                }
            }
        });
    }
}
function validform() {
    var icon = "<i class='fa fa-times-circle'></i>";
    return $("#dialogAuthForm").validate({
        rules: {
            dialogAuthName: {
                required: true,
                maxlength: 32
            }
        },
        messages: {
            dialogAuthName: {
                required: icon + "权限名称不能为空",
                maxlength: icon + "权限名称最大长度为32"
            }
        }
    });
}
function validformEdit() {
    var icon = "<i class='fa fa-times-circle'></i>";
    return $("#dialogEditAuthForm").validate({
        rules: {
            dialogEditAuthName: {
                required: true,
                maxlength: 32
            }
        },
        messages: {
            dialogEditAuthName: {
                required: icon + "权限名称不能为空",
                maxlength: icon + "权限名称最大长度为32"
            }
        }
    });
}
function saveEditSubjectInfo() {
    if(validformEdit().form()) {
        $.ajax({
            type: "POST",
            url: "/subjectsMn/subjectUpdate",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify({
                id: $("#dialogEditAuthId").val(),
                subject_name:$("#dialogEditAuthName").val()
            }),
            success: function (result) {
                if(result.flag == 1){
                    querySubjectInfo();
                    //关闭模态窗口
                    $('#myModal6').modal('hide');
                    swal("保存成功！", result.message, "success");
                }else{
                    swal("保存失败！", result.message, "error");
                }
            }
        });
    }
}