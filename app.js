var scheduleForEachStop = {
  "Start": {
    "Barona street" : 5,
    "Valdemara street" : 10,
    "Marijas street" : 12,
    "Finish" : 20
  },
  "Barona street" : {
    "Valdemara street" : 5,
    "Marijas street" : 8,
    "Finish" : 15
  },
  "Valdemara street" : {
    "Barona street" : 8,
    "Marijas street" : 3,
    "Finish" : 20
  },
  "Marijas street" : {
    "Barona street" : 10,
    "Valdemara street" : 3,
    "Finish" : 5
  }
}


class Path {
  constructor(from,x,y,to,w,z){
    this.x = x;
    this.y = y;
    this.w = w;
    this.z = z;
    this.from = from;
    this.to = to;
  }
  drawPath(){

    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.w, this.z);
    context.stroke();
  }
}

class Route {
  constructor(paths){
    this.paths = paths;

  }
  combinePaths(){
    let arr =[];
    this.paths.forEach((el)=> arr.push(el));
    return arr
  }
  getSequence(){
    let arr = this.combinePaths();
    let seqArr = [];
    arr.forEach(function(el){
      let obj = {};
      obj.from = el.from;
      obj.to = el.to;
      seqArr.push(obj);
    });
    return seqArr;
  }
  getTime(){
    let arr = this.getSequence();
    let arrTimetable = [];
    let minutes = 0;
    arr.forEach(function(el){
      let obj = {};
      let time = new Time(el.from,el.to);
      minutes = minutes + time.getMinutes();

      obj.minutes = minutes;
      obj.to = el.to;
      arrTimetable.push(obj);
    });

    return arrTimetable;
  }
  get totalTime(){
    let arr = this.getTime();
    let sum = 0;
    arr.forEach(function(el){
      sum = sum + el.minutes;
    });
    return "Total Time: " + sum + " minutes";
  }
  displayTime(){
    let stops = document.getElementsByClassName("busStop");
    let timeTable = this.getTime(); //array
    let nodesArr = Array.from(stops);
    let d = new Date(); // for now
    let formattedTime = d.toISOString().slice(11,16);
    nodesArr.forEach(function(node){
      timeTable.forEach(function(el){
        if(node.getAttribute("data-stopname") == el.to){
          $(node).children(".stopname").children(".scheduleInfo").css("opacity", 1);
          $("#first").css("opacity", 1);
          $("#first").text(addMinutes(d,0).toString().slice(15,21));
          $(node).children(".stopname").children(".scheduleInfo").text(addMinutes(d,el.minutes).toString().slice(15,21));
        }
      });
    });
  }

}

class Time{
  constructor(from,to){
    this.from = from;
    this.to = to;
    this.minutes = this.setMinutes(scheduleForEachStop);
  }
  getMinutes(){
    return this.minutes;
  }
  setMinutes(scheduleForEachStop){
    let minutes;

    for (var key in scheduleForEachStop) {
          for(var k in scheduleForEachStop[key]){
            if(key == this.from){
              if(k == this.to){
                minutes = scheduleForEachStop[key][k];
              }
            }
          }
       }
       return minutes;
    }

}



function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

// Get the canvas element form the page
var canvas = document.getElementById("myCanvas");
var busStops = document.getElementsByClassName("busStop");
var context=canvas.getContext("2d");
let attribute = "data-stopname";

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
context.lineWidth=3;

let top1;
let left1;
let top2;
let left2;
let attrCounter = 0;
let from;
let to;
let paths = [];



$(".busStop").on("click",function(e){
  if(attrCounter<1){
    top1 = e.target.offsetTop +25;
    left1 = e.target.offsetLeft+25;
    from = $(this).attr("data-stopname");
    $(this).css("backgroundColor","red");


}

  $(this).attr("data-active","true");

});

$(".busStop").on("click",function(e){
  $(".busStop").each(function(busStop){
    if( $(this).attr('data-active')) {
      attrCounter++;
    }
  });
});

$(".busStop").on("click",function(e){
  $(this).css("backgroundColor","red");
  if(attrCounter>1){
    top2 = e.target.offsetTop + 25;
    left2 = e.target.offsetLeft + 25;
    to = $(this).attr("data-stopname");

    let path = new Path(from,left1,top1,to,left2,top2);
    path.drawPath();
    paths.push(path);




    $(this).attr("data-active","true");
    $(".busStop").each(function(busStop){
      $(this).removeAttr('data-active');
      setTimeout(function(){$(".busStop").css("backgroundColor","white")},200);
    });
    attrCounter = 0;
  }
  if(e.target.getAttribute(attribute) == "Finish"){
    let route = new Route(paths);
    route.displayTime();
    $("#totalTime").text(route.totalTime);

  }

});
