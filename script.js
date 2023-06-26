let stop_id = {
  "u1": [4190, 4189, 4188, 4187, 4186, 4102, 4104, 4106, 4108, 4110, 4112, 4114, 4116, 4118, 4120, 4122, 4124, 4126, 4128, 4129, 4130, 4131, 4132, 4141, 4134, 4135, 4136, 4137, 4138, 4101, 4103, 4105, 4120, 4111, 4113, 4115, 4118, 4119, 4121, 4123, 4125, 4127, 4181, 4182, 4183, 4184],
  "u2": [4275, 4274, 4272, 4271, 4270, 4269, 4267, 4268, 4266, 4265, 4264, 4263, 4262, 4214, 4212, 4203, 4201, 4261, 4260, 4259, 4258, 4257, 4255, 4256, 4254, 4253, 4252, 4251, 4279, 4278, 4277],
  "u3": [4931, 4932, 4933, 4926, 4927, 4921, 4922, 4923, 4909, 4910, 4911, 4912, 4913, 4914, 4915, 4916, 4917, 4934, 4935, 4936, 4938, 4939, 4940, 4941, 4900, 4901, 4902, 4903, 4904, 4905, 4906, 4907, 4908, 4918, 4919, 4920, 4924, 4925, 4928, 4929],
  "u4": [4401, 4403, 4405, 4407, 4409, 4411, 4413, 4437, 4415, 4417, 4419, 4421, 4423, 4425, 4427, 4429, 4431, 4433, 4439, 4402, 4440, 4404, 4406, 4408, 4410, 4412, 4414, 4416, 4418, 4420, 4422, 4438, 4424, 4426, 4428, 4430, 4432, 4434],
  "u6": [4646, 4647, 4648, 4649, 4650, 4651, 4603, 4604, 4605, 4606, 4607, 4608, 4609, 4610, 4611, 4612, 4613, 4614, 4629, 4630, 4631, 4632, 4633, 4635, 4636, 4637, 4638, 4639, 4640, 4615, 4616, 4617, 4618, 4619, 4620, 4621, 4622, 4623, 4624, 4625, 4626, 4627, 4641, 4642, 4643, 4644]
}



let stop_status = {}

for(let line in stop_id) {
  let id_list = stop_id[line]
  
  id_list.forEach(id => {
    stop_status[id] = -1;
  });
}



let url_beg = "https://cors-anywhere.herokuapp.com/https://www.wienerlinien.at/ogd_realtime/monitor?"
let url_end = ""

for(let line in stop_id) {
  let id_list = stop_id[line]
  url_end = url_end + id_list.map(String).join('&stopId=')
}

let url = url_beg + url_end.slice(1)




// ANIMATIONS

const delay = ms => new Promise(res => setTimeout(res, ms));

async function animate(className) {
  let obj = document.getElementsByClassName(className)[0]
  obj.classList.add("train")
  console.log("animate " + className)
  await delay(60000)
  obj.classList.remove("train")
}

async function live() {
  try {
    const response = await fetch(url);
    let data = await response.json();
    for(let i = 0; i < data.data.monitors.length; i++){
      let monitor = data.data.monitors[i.toString()]
      let rbl = monitor.locationStop.properties.attributes.rbl
      let dt = monitor.lines["0"].departures.departure["0"].departureTime
      if(dt.countdown == 0){
        stop_status[rbl] = 0
        console.log("cd0")
      }
      else{
        if(stop_status[rbl] == 0) {
          animate(rbl.toString())
          stop_status[rbl] = 1
        }
      }
    }
    document.body.classList.add("connected")
  }
  catch (error) {
    document.body.classList.remove("connected")
  }
  
}

async function main() {
  while(true) {
    await live()
    await delay(30000)
  }
}

main()







// MAP RESPONSIVNESS 

map = document.getElementsByTagName("svg")[0];

var mouseStartPosition = {x: 0, y: 0};
var mousePosition = {x: 0, y: 0};
var viewboxStartPosition = {x: 0, y: 0};
var viewboxPosition = {x: 129, y: 209};
var viewboxSize = {x: 10000, y: 10000};
var viewboxScale = 1./10.;

var mouseDown = false;

map.addEventListener("mousemove", mousemove);
map.addEventListener("mousedown", mousedown);
map.addEventListener("wheel", wheel);

function mousedown(e) {
  mouseStartPosition.x = e.pageX;
  mouseStartPosition.y = e.pageY;

  viewboxStartPosition.x = viewboxPosition.x;
  viewboxStartPosition.y = viewboxPosition.y;

  window.addEventListener("mouseup", mouseup);

  mouseDown = true;
}

function setviewbox()
{
  var vp = {x: 0, y: 0};
  var vs = {x: 0, y: 0};
  
  vp.x = viewboxPosition.x;
  vp.y = viewboxPosition.y;
  
  vs.x = viewboxSize.x * viewboxScale;
  vs.y = viewboxSize.y * viewboxScale;

  map = document.getElementsByTagName("svg")[0];
  map.setAttribute("viewBox", vp.x + " " + vp.y + " " + vs.x + " " + vs.y);

}

function mousemove(e)
{
  mousePosition.x = e.offsetX;
  mousePosition.y = e.offsetY;
  
  if (mouseDown)
  {
    viewboxPosition.x = viewboxStartPosition.x + (mouseStartPosition.x - e.pageX) * viewboxScale;
    viewboxPosition.y = viewboxStartPosition.y + (mouseStartPosition.y - e.pageY) * viewboxScale;

    setviewbox();
  }
}

function mouseup(e) {
  window.removeEventListener("mouseup", mouseup);
  
  mouseDown = false;
}

function wheel(e) {
  var scale = (e.deltaY < 0) ? 0.8 : 1.2;
  
  // if ((viewboxScale * scale < 1./3.) && (viewboxScale * scale > 1./20.)) {
    if (true) {

    if(viewboxScale * scale > 1./6.) {
      document.body.classList.add('hideLabel');
      // document.body.classList.add('hideStation');
    }
    else {
      document.body.classList.remove('hideLabel');
      // document.body.classList.remove('hideStation');
    }

    var mpos = {x: mousePosition.x * viewboxScale, y: mousePosition.y * viewboxScale};
    var vpos = {x: viewboxPosition.x, y: viewboxPosition.y};
    var cpos = {x: mpos.x + vpos.x, y: mpos.y + vpos.y}

    viewboxPosition.x = (viewboxPosition.x - cpos.x) * scale + cpos.x;
    viewboxPosition.y = (viewboxPosition.y - cpos.y) * scale + cpos.y;
    viewboxScale *= scale;
  
    setviewbox();
  }
}



// INTERACTIVE LEGEND

Array.from(document.getElementsByClassName("line")).forEach(function(el) {
  for(line_name of ["u1", "u2", "u3", "u4", "u6"]) {
    if(el.classList.contains(line_name)){
      if(el.classList.contains("closed")){
        el.addEventListener("mouseover", legendHighlight(line_name, "Closed section"))
        el.addEventListener("mouseout", legendReset(line_name))
      }
      else {
        el.addEventListener("mouseover", legendHighlight(line_name, ""))
        el.addEventListener("mouseout", legendReset(line_name))
      }
    }
  }
})

function legendHighlight(line, text) {
  return function() {
    button = document.getElementsByClassName("button " + line)[0]
    button.classList.add("big")
    if(text.length > 0){
      more = document.getElementsByClassName("more " + line)[0]
      more.innerHTML = "&nbsp;&nbsp;" + text
      more.classList.add("show")
    }
  }
}

function legendReset(line) {
  return function() {
    button = document.getElementsByClassName("button " + line)[0]
    button.classList.remove("big")
    more = document.getElementsByClassName("more " + line)[0]
    more.innerHTML = ""
    more.classList.remove("show")
  }
}











let canvas = document.getElementById("clock");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let secondLength = width / 2 -10;
let minuteLength = width / 2 -10;
let hourLength = width / 2 -20;

function drawLine(x1, y1, x2, y2, lineWidth, color) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawHand(angle, length, lineWidth, color) {
    let x = width/2 + Math.cos(angle) * length;
    let y = height/2 + Math.sin(angle) * length;
    drawLine(width/2, height/2, x, y, lineWidth, color);
}

function drawBackground() {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle);
    ctx.arc(width/2, height/2, width/2, 0, Math.PI*2);
    ctx.stroke();
    
    // TODO: add "ticks"
}

function drawClock() {

    ctx.clearRect(0,0,width,height);

    let time = new Date();
    
    let second = time.getSeconds();
    // 0 degrees on the clock would be "up", but in coordinate system is "right"
    // so subtract a quarter rotation to get correct angle
    let secondAngle = (second / 60 - 0.25) * 2 * Math.PI;
    
    // we want the hand to be positioned exactly,
    // so we have to take minutes AND seconds into account
    let minute = time.getMinutes() + second / 60;
    let minuteAngle = (minute / 60 - 0.25) * 2 * Math.PI;
    
    // we want the hand to be positioned exactly,
    // so we have to take hours AND minutes into account
    let hour = time.getHours() + minute / 60;
    let hourAngle = (hour / 12 - 0.25) * 2 * Math.PI;
    
    console.log(second);
    
    ctx.lineWidth = 0.5;
    ctx.lineCap = "round";
    
    drawBackground();
    
    drawHand(secondAngle, secondLength, 2, "red");
    drawHand(minuteAngle, minuteLength, 2, "black");
    drawHand(hourAngle, hourLength, 4, "black");  
}

window.setInterval(drawClock, 1000);