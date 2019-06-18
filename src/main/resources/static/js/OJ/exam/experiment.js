$(document).ready(function () {
    getExperInfo();
});
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    getExperInfo();
}
function getExperInfo() {
    $.ajax({
        type: "POST",
        url: "/experimentMn/getExperInfo",
        dataType: "json",
        data:{
            "experName" : $('#experName').val()
        },
        success:function (result) {
            $.each(result,function(index,value){
                value.start_time = formatTime(value.start_time)
                value.end_time = formatTime(value.end_time)
            })
            var dataTable = $('#experInfoTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "data" : result,
                "columns" : [{
                    "data" : "name"
                },{
                    "data" : "kind"
                },{
                    "data" :"start_time"
                },{
                    "data" : "end_time"
                },],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='IP' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-eject'></i>&nbsp;IP</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='openAddExper(\""+row.id+"\")' title='编辑' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-pencil'></i>&nbsp;编辑</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='判分' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-refresh'></i>&nbsp;判分</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='成绩' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-search'></i>&nbsp;成绩</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='相似' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-eye'></i>&nbsp;相似</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteExper(\""+row.id+"\")' title='删除' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-trash'></i>&nbsp;删除</button>"
                        a += "<button type='button' class='btn btn-primary' onclick='deleteUser(\""+row.id+"\")' title='复制' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-copy'></i>&nbsp;复制</button>"
                        return a;
                    },
                    "targets" :4
                }]
            });
        }
    })

}

function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}

function openAddExper(id) {
    window.location.href = "/experimentMn/addExper/"+id;
}

function deleteExper(id) {
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
                    url: "/experimentMn/experDelete",
                    dataType: "json",
                    data:{
                        "id" : id
                    },
                    success:function (result){
                        if(result.flag == "1"){
                            getExperInfo();
                            swal("删除成功！", "实验已被删除", "success");
                        }else{
                            swal("删除失败！", "实验暂时不能被删除", "error");
                        }

                    }
                })
            }else {
                swal("已取消", "你取消了删除实验操作", "error");
            }
        });
}