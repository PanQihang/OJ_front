
var selectedQueList = [];
var selectedClassList = [];
var selectedJroomList = [];
if (experInfo.id != 'add'){
    selectedQueList = experInfo.selectedQueList;
    selectedClassList = experInfo.selectedClassList;
    selectedJroomList = experInfo.selectedJroomList;
    experInfo.experInfo.start = formatTime(experInfo.experInfo.start);
    experInfo.experInfo.end = formatTime(experInfo.experInfo.end);
}
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
$(document).ready(function () {
    // 加载时间选择器
    loadLayerDate();
    //加载富文本编辑器
    loadSummernote();
    if (experInfo.id != 'add'){
        //加载实验信息
        loadExpreInfo();
    }
    //加载待选择题目列表
    loadPreSelectQuestion();
    // 加载已选择题目列表
    loadSelectedQuestion();
    // 加载待选择班级列表
    loadPreSelectClass();
    // 加载已选择班级列表
    loadSelectedClass();
    // 加载待选择机房列表
    loadPreSelectJroom();
    // 加载已选择机房列表
    loadSelectedJroom();
    debugger
});

function loadLayerDate() {
    var startTime;
    var endTime;
    if (experInfo.id != 'add'){
        startTime = experInfo.experInfo.start;
        endTime = experInfo.experInfo.end;
        $('#experStartTime').val(startTime);
        $('#experEndTime').val(endTime);
    }else{
        startTime = laydate.now();
        endTime = laydate.now();
        $('#experStartTime').val(laydate.now(0, 'YYYY-MM-DD hh:mm:ss'));
        $('#experEndTime').val(laydate.now(7, 'YYYY-MM-DD hh:mm:ss'));
    };

    //日期范围限制
    var start = {
        elem: '#experStartTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        start:startTime,
        min: startTime, //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istime: true,
        istoday: false,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };

    var end = {
        elem: '#experEndTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        start:endTime,
        min: startTime,
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: false,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    laydate(start);
    laydate(end);

}



function loadSummernote() {
    $("#experDesc").summernote({
        height: 200,
        minHeight: 200,
        maxHeight: 200,
        lang: 'zh-CN',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['view', ['fullscreen', 'codeview']]
        ]

    })
}

function loadExpreInfo() {
    $("#experName").val(experInfo.experInfo.name);
    $("#experName").attr("disabled","disabled");
    $('#experDesc').code(experInfo.experInfo.description);
    if ("" == experInfo.experInfo.is_ip){
        $("[name='is_ip']").removeAttr("checked");
    }
    if ("" == experInfo.experInfo.only_ip){
        $("[name='only_ip']").removeAttr("checked");
    }
}

function loadPreSelectQuestion() {
    $.ajax({
        type: "POST",
        url: "/experimentMn/loadPreSelectQuestion",
        dataType: "json",
        success:function (result) {
            var dataTable = $('#preSelectQuestionTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "paging": false,
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "scrollY": "300px",
                "scrollCollapse": "true",
                "data" : result,
                "columns" : [{
                    "data" : "id"
                },{
                    "data" :"name"
                },{
                    "data" : "isShow"
                },],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a+="<i style=\"cursor:pointer\" onclick='preSelect(this, \""+row.id+"\", \""+row.name+"\")' class='fa fa-check'></i>"
                        return a;
                    },
                    "targets" :3
                }]
            });
        }
    })
}

function loadSelectedQuestion() {
    var dataTable = $('#selectedQuestionTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "paging": false,
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "scrollY": "300px",
        "scrollCollapse": "true",
        "data" : selectedQueList,
        "columns" : [{
            "data" : "id"
        },{
            "data" :"name"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                var a = "";
                a+="<input type='text' value='"+row.score+"' class='form-control'>"
                return a;
            },
            "targets" :2
        },{
            "render" : function(data, type, row) {
                var a = "";
                a+="<i style='cursor:pointer' onclick='deleteSelectedQue(\""+row.id+"\")' class='fa fa-close'></i>"
                return a;
            },
            "targets" :3
        }]
    });
}


function preSelect(radio, id, name) {
    var isSelected = false
    for (var i=0; i<selectedQueList.length; i++){
        if(id == selectedQueList[i].id){
            isSelected = true
            toastr.warning("","该题目已经被选择")
            break
        }
    }
    if (!isSelected) {
        var addQue = {};
        addQue.id = id;
        addQue.name = name;
        addQue.score = 0;
        refreshScore();
        selectedQueList.push(addQue);
        loadSelectedQuestion();
    }

}

function refreshScore () {
    var inputList = $("#selectedQuestionTable input")
    for (var i=0; i<inputList.length; i++){
        selectedQueList[i].score = inputList[i].value;
    }
}

function deleteSelectedQue(id) {
    for (var i=0; i<selectedQueList.length; i++){
        if(id == selectedQueList[i].id){
            selectedQueList.splice(i, 1);
        }
    }
    loadSelectedQuestion();
}

function loadPreSelectClass() {
    $.ajax({
        type: "POST",
        url: "/experimentMn/loadPreSelectClass",
        dataType: "json",
        success:function (result) {
            var dataTable = $('#preSelectClassTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "paging": false,
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "scrollY": "300px",
                "scrollCollapse": "true",
                "data" : result,
                "columns" : [{
                    "data" :"name"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a+="<i style=\"cursor:pointer\" onclick='preSelectClass(this, \""+row.id+"\", \""+row.name+"\")' class='fa fa-check'></i>"
                        return a;
                    },
                    "targets" :1
                }]
            });
        }
    })
}

function loadSelectedClass() {
    var dataTable = $('#selectedClassTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "paging": false,
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "scrollY": "300px",
        "scrollCollapse": "true",
        "data" : selectedClassList,
        "columns" : [{
            "data" :"name"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                var a = "";
                a+="<i style='cursor:pointer' onclick='deleteSelectedClass(\""+row.id+"\")' class='fa fa-close'></i>"
                return a;
            },
            "targets" :1
        }]
    });
}


function preSelectClass(radio, id, name) {
    var isSelected = false
    for (var i=0; i<selectedClassList.length; i++){
        if(id == selectedClassList[i].id){
            isSelected = true
            toastr.warning("","该班级已经被选择")
            break
        }
    }
    if (!isSelected) {
        var addClass = {};
        addClass.id = id;
        addClass.name = name;

        selectedClassList.push(addClass);
        loadSelectedClass();
    }

}

function deleteSelectedClass(id) {
    for (var i=0; i<selectedClassList.length; i++){
        if(id == selectedClassList[i].id){
            selectedClassList.splice(i, 1);
        }
    }
    loadSelectedClass();
}


function loadPreSelectJroom() {
    $.ajax({
        type: "POST",
        url: "/experimentMn/loadPreSelectJroom",
        dataType: "json",
        success:function (result) {
            var dataTable = $('#preSelectJroomTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }
            dataTable.DataTable({
                "paging": false,
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "scrollY": "300px",
                "scrollCollapse": "true",
                "data" : result,
                "columns" : [{
                    "data" :"location"
                },{
                    "data" :"ip"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a+="<i style=\"cursor:pointer\" onclick='preSelectJroom(\""+row.id+"\", \""+row.location+"\", \""+row.ip+"\")' class='fa fa-check'></i>"
                        return a;
                    },
                    "targets" :2
                }]
            });
        }
    })
}

function loadSelectedJroom() {
    var dataTable = $('#selectedJroomTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "paging": false,
        "serverSide": false,
        "autoWidth" : false,
        "bSort": false,
        "scrollY": "300px",
        "scrollCollapse": "true",
        "data" : selectedJroomList,
        "columns" : [{
            "data" :"location"
        },{
            "data" :"ip"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                var a = "";
                a+="<i style='cursor:pointer' onclick='deleteSelectedJroom(\""+row.id+"\")' class='fa fa-close'></i>"
                return a;
            },
            "targets" :2
        }]
    });
}

function preSelectJroom(id, location, ip) {
    var isSelected = false
    for (var i=0; i<selectedJroomList.length; i++){
        if(id == selectedJroomList[i].id){
            isSelected = true
            toastr.warning("","该机房已经被选择")
            break
        }
    }
    if (!isSelected) {
        var addJroom = {};
        addJroom.id = id;
        addJroom.location = location;
        addJroom.ip = ip;
        selectedJroomList.push(addJroom);
        loadSelectedJroom();
    }

}

function deleteSelectedJroom(id) {
    for (var i=0; i<selectedJroomList.length; i++){
        if(id == selectedJroomList[i].id){
            selectedJroomList.splice(i, 1);
        }
    }
    loadSelectedJroom();
}

function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}
//更新或新增实验
function saveOrUpdateExper() {
    refreshScore();
    if($("#experName").val() == ""){
        toastr.error("","实验名称不能为空");
        return;
    }
    if($("#experStartTime").val() == ""){
        toastr.error("","实验开始时间不能为空");
        return;
    }
    if($("#experEndTime").val() == ""){
        toastr.error("","实验结束时间不能为空");
        return;
    }
    if(selectedQueList.length == 0){
        toastr.error("","请选择题目");
        return;
    }else{
        for(var i=0; i<selectedQueList.length; i++){
            if(selectedQueList[i].score==0){
                toastr.error("","已选择的第"+(i+1)+"条试题分数必须大于0");
                return;
            }
        }
    }
    if(selectedClassList.length == 0){
        toastr.error("","请选择班级");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/experimentMn/saveOrUpdateExper",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({
            "id":experInfo.id,
            "experInfo":{
                "name":$("#experName").val(),
                "start":$("#experStartTime").val(),
                "end":$("#experEndTime").val(),
                "description":$("#experDesc").code(),
                "onlyIp":$("[name='only_ip']:checked").val() == undefined?"" : "on",
                "isIp":$("[name='is_ip']:checked").val() == undefined?"" : "on"

            },
            "selectedQueList":selectedQueList,
            "selectedClassList":selectedClassList,
            "selectedJroomList":selectedJroomList
        }),
        success: function (result) {
            if(result.flag == 1){
                swal("保存成功！","", "success");
                $(".confirm").click(function(){history.back(-1)})

            }else{
                swal("保存失败！","", "error");
            }
        }
    });
}