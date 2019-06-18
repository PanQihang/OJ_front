var $table = $('#authTable');
function showAuthTree(id) {
    $('#RCAroleId').val(id)
    queryAuthInfo(id)
}
function queryAuthInfo(id){
    $.ajax({
        type: "POST",
        url: "/roleMn/authQuery",
        dataType: "json",
        data: {'id': id},
        success:function (result) {
            //对已经选中的数据为result["auths"]中的check属性添加true
            var role_auth_ids = result.role_auth_ids
            for (i = 0; i < result["auths"].length; i++){
                for (j = 0; j < role_auth_ids.length; j++){
                    if(result["auths"][i].id==role_auth_ids[j]){
                        result["auths"][i].check = true
                    }
                }
            }
            $table.bootstrapTable('destroy');
            $table.bootstrapTable({
                data:result["auths"],
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
                    { field: 'auth_name',  title: '权限名称' },
                    { field: 'auth_code',  title: '权限编码' }
                ],
                //在哪一列展开树形
                treeShowField: 'auth_name',
                //指定父id列
                parentIdField: 'auth_parent',
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
                    selectChilds(datas,row,"id","auth_parent",true);
                    // 勾选父类
                    selectParentChecked(datas,row,"id","auth_parent")
                    // 刷新数据
                    $table.bootstrapTable('load', datas);
                },
                onUncheck:function(row){
                    var datas = $table.bootstrapTable('getData');
                    selectChilds(datas,row,"id","auth_parent",false);
                    $table.bootstrapTable('load', datas);
                },
            });
        }
    });
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

function saveRCA() {
    var selRows = $table.bootstrapTable("getSelections");
    if(selRows.length == 0){
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
        toastr.error("请至少选择一行权限！", "无效操作")
        return
    }
    var postData = [];
    $.each(selRows,function(i) {
        postData.push(this.id)
    });
    $.ajax({
        type: "POST",
        url: "/roleMn/roleAuthSave",
        dataType: "json",
        data: {
            "role_id": $("#RCAroleId").val(),
            "postData": JSON.stringify(postData)
        },
        success: function (result) {
            if(result.flag == 1){
                //关闭模态窗口
                $('#myModal6').modal('hide');
                swal("保存成功！", result.message, "success");
            }else{
                swal("保存失败！", result.message, "error");
            }
        }
    });
}