var list=[];
list=rankinfo.rank;
console.log(list);
$(document).ready(function () {
    drawNavAct(2);
    laodpage("rankList",0);
    showrank();
});
function showrank() {
    var page=list.length;
    if(page>30){
        page=page/30;
        console.log(page);
        nTest="";
        var start=0;
        var end=0;
        for(var i=1;i<=page;i++){
            start=i*30+1;
            end=(i+1)*30;
            nTest+='<li class=""><a data-toggle="tab" href="#tab-'+i+ '" '+
                'aria-expanded="false">'+start+'~'+end+'</a>\n' +
                '                        </li>';
        }
        $('#Chose').append(nTest);
        for(var i=1;i<=page;i++){
            PageList(i);
        }
    }
}
function PageList(page){
    test="";
    test+=' <div id="tab-'+page+'" class="tab-pane">\n' +
        '                            <div class="panel-body">\n' +
        '                            <div class="ibox-content">\n' +
        '                                <table class="table">\n' +
        '                                    <thead>\n' +
        '                                    <tr>\n' +
        '                                        <th>排名</th>\n' +
        '                                        <th>姓名</th>\n' +
        '                                        <th>班级</th>\n' +
        '                                        <th>AC题数</th>\n' +
        '                                        <th>参加竞赛次数</th>\n' +
        '\n' +
        '                                    </tr>\n' +
        '                                    </thead>\n' +
        '                                    <tbody id="rankList'+page+'">\n' +

        '                                    </tbody>\n' +
        '                                </table>\n' +
        '                            </div>\n' +
        '                    </div>\n' +
        '                        </div>';
    $('#acc').append(test);
    laodpage("rankList"+page,page);
}
function laodpage(id,page) {
    console.log(page);
    var test="";
    var start=page*30;
    var end=(page+1)*30-1;
    if(end>=list.length){
        end=list.length-1;
    }
    console.log(end);
    test+=f(start,end);
    $('#'+id).append(test)
}
function f(start,end) {
    newTest="";

    var k=0;
    for(var i=start;i<=end;i++){
        k=i+1;
        newTest+='<tr>\n'+
            '<td>'+k+'</td>\n'+
        '<td>'+list[i].name+'</td>\n'+
            '<td>'+list[i].className+'</td>\n'+
            '<td>'+list[i].ac+'</td>\n'+
            '<td>'+list[i].num+'</td>';
    }
    return newTest;
}