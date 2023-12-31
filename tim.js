var div = document.createElement("div");
div.className = "container my-5";

var row1 = document.createElement("div");
row1.className = "row d-flex justify-content-center";

var inp = document.createElement("input");
inp.setAttribute("type","date");
inp.setAttribute("id","date");
inp.className = "col-6 mx-3"

var button = document.createElement("button");
button.setAttribute("id","btn");
button.innerHTML = "Display Data";
button.className = "col-2 bg-primary text-white btn"
button.addEventListener("click",()=>{
    var date = document.getElementById("date").value;
    var para1 = document.getElementById("para1");
    var para2 = document.getElementById("para2");
    var para3 = document.getElementById("para3");
    var para4 = document.getElementById("para4");
    var para5 = document.getElementById("para5");
    var para6 = document.getElementById("para6");
    var para7 = document.getElementById("para7");
    var para8 = document.getElementById("para8");

    var time_stamp = Date.parse(date);
    var inputdate = new Date(time_stamp);
    var currentdate = new Date();

    var millisecDiff = parseInt(currentdate.getTime()-inputdate.getTime());
    var secondsdiff = mathfloor(millisecDiff,1000);
    var minutesdiff = mathfloor(secondsdiff,60);
    var hoursdiff = mathfloor(minutesdiff,60);
    var daydiff = mathfloor(hoursdiff,24);
    var monthdiff = month_diff(inputdate,currentdate);
    var yeardiff = year_diff(inputdate,currentdate);

    para1.innerHTML = `Given input date is ${inputdate}`
    para2.innerHTML = `year ${yeardiff}`
    para3.innerHTML = `month ${monthdiff}`
    para4.innerHTML = `day ${daydiff}`
    para5.innerHTML = `hour ${hoursdiff}`
    para6.innerHTML = `minute ${minutesdiff}`
    para7.innerHTML = `second ${secondsdiff}`
    para8.innerHTML = `millisecond ${millisecDiff}`
})

row1.append(inp,button);

var divRows = document.createElement("div");

var row2 = row("row2");
var row3 = row("row3");
var row4 = row("row4");
var row5 = row("row5");
var row6 = row("row6");
var row7 = row("row7");
var row8 = row("row8");
var row9 = row("row9");

var para1 = para("para1");
var para2 = para("para2");
var para3 = para("para3");
var para4 = para("para4");
var para5 = para("para5");
var para6 = para("para6");
var para7 = para("para7");
var para8 = para("para8");

row2.append(para1);
row3.append(para2);
row4.append(para3);
row5.append(para4);
row6.append(para5);
row7.append(para6);
row8.append(para7);
row9.append(para8);

divRows.append(row2,row3,row4,row5,row6,row7,row8,row9);
div.append(row1,divRows);
document.body.append(div);

function para(id){
    var para1 = document.createElement("p");
    para1.setAttribute("id",id);
    para1.className = "col-12 m-0"
    return para1
}

function row(cls){
    var row2 = document.createElement("div");
    row2.className = "row text-center";
    row2.id = cls;
    return row2;
}

function mathfloor(value1,value2){
    return Math.floor(value1/value2);
}

function year_diff(value1,value2){
    var date1 = new Date(value1);
    var date2 = new Date(value2);
    return date2.getFullYear()-date1.getFullYear();
}

function month_diff(value1,value2){
    var year = year_diff(value1,value2);
    var month = (year*12)+(value2.getMonth()-value1.getMonth())
    return month
}





























