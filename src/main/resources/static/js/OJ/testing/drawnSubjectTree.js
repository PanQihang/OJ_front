$(function () {
    $("#id_label_single").select2();
});
var datas=[];
var data=[];
var callback=function(result,param){
    datas=result;
    for(var i in datas){
        // console.log(result[i].description);
        if (datas[i].description==""){
            p={};
            p["text"]=datas[i]["name"];
            q=[]
            for(var j in datas){
                t={}
                if(parseInt(datas[j].description)==datas[i].id){
                    t["id"]=datas[j].id;
                    t["text"]=datas[j].name;
                    q.push(t);
                }

            }
            p["children"]=q;
            data.push(p);
        }
    }
   // console.log(data);
    draw(param);
    // $("#id_label_single").select2({
    //     data: data,
    //     placeholder:'请选择',
    //     allowClear:true
    //
    // });
}
function draw(param){
    $("#"+param).select2({
        data: data,
        placeholder:'请选择',
        allowClear:true

    });
}
 function SubjectTree(param){
    $.ajax({
        type: "POST",
        url: "/subjectsMn/getSubjectMaplist",
        dataType: "json",
        success:function (result) {
            console.log(result)

            callback(result,param);
            debugger
        }
    })


}

var data1 =  [
    {
        "text": "Group 1",
        "children" : [
            {
                "id": 1,
                "text": "Option 1.1"
            },
            {
                "id": 2,
                "text": "Option 1.2"
            }
        ]
    },
    {
        "text": "Group 2",
        "children" : [
            {
                "id": 3,
                "text": "Option 2.1"
            },
            {
                "id": 4,
                "text": "Option 2.2"
            }
        ]
    }
];

