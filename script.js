
// MAP RESPONSIVNESS 

map = document.getElementsByTagName("svg")[0];

var mouseStartPosition = {x: 0, y: 0};
var mousePosition = {x: 0, y: 0};
var viewboxStartPosition = {x: 150, y: 200};
var viewboxPosition = {x: 150, y: 200};
var viewboxSize = {x: 250, y: 250};
var adjust = {x: viewboxSize.x/2000, y: viewboxSize.y/2000}
var viewboxScale = 1.;

var mouseDown = false;

map.addEventListener("mousemove", mousemove);
map.addEventListener("mousedown", mousedown);
map.addEventListener("wheel", wheel);

function mousedown(e) {
  mouseStartPosition.x = e.pageX * adjust.x;
  mouseStartPosition.y = e.pageY * adjust.y;

  viewboxStartPosition.x = viewboxPosition.x;
  viewboxStartPosition.y = viewboxPosition.y;

  window.addEventListener("mouseup", mouseup);

  mouseDown = true;
}

function setviewbox()
{
  var vs = {x: 0, y: 0};

  vs.x = viewboxSize.x * viewboxScale;
  vs.y = viewboxSize.y * viewboxScale;

  if(viewboxPosition.x < 0) {
    viewboxPosition.x = 0;
  }

  if(viewboxPosition.y < 0) {
    viewboxPosition.y = 0;
  }

  map = document.getElementsByTagName("svg")[0];
  map.setAttribute("viewBox", viewboxPosition.x + " " + viewboxPosition.y + " " + vs.x + " " + vs.y);

}

function mousemove(e)
{
  mousePosition.x = e.offsetX * adjust.x;
  mousePosition.y = e.offsetY * adjust.y;
  
  if (mouseDown)
  {
    viewboxPosition.x = viewboxStartPosition.x + (mouseStartPosition.x - e.pageX * adjust.x) * viewboxScale;
    viewboxPosition.y = viewboxStartPosition.y + (mouseStartPosition.y - e.pageY * adjust.y) * viewboxScale;

    setviewbox();
  }
}

function mouseup(e) {
  window.removeEventListener("mouseup", mouseup);
  
  mouseDown = false;
}

function wheel(e) {
  var scale = (e.deltaY < 0) ? 0.8 : 1.2;
  
  if ((viewboxScale * scale < 2.) && (viewboxScale * scale > 1./3.)) {

    var mpos = {x: mousePosition.x * viewboxScale, y: mousePosition.y * viewboxScale};
    var vpos = {x: viewboxPosition.x, y: viewboxPosition.y};
    var cpos = {x: mpos.x + vpos.x, y: mpos.y + vpos.y}

    viewboxPosition.x = (viewboxPosition.x - cpos.x) * scale + cpos.x;
    viewboxPosition.y = (viewboxPosition.y - cpos.y) * scale + cpos.y;
    viewboxScale *= scale;
  
    setviewbox();
  }
}







// MAP ANIMATIONS

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

const delay = ms => new Promise(res => setTimeout(res, ms));

async function animate(className) {
  let obj = document.getElementsByClassName(className)[0]
  obj.classList.add("animate")
  console.log("animate " + className)
  await delay(60000)
  obj.classList.remove("animate")
}

async function request() {

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

    if(server.className != "connected") {
      server.className = "connected"
      if(inter != null) {
        clearInterval(inter);
      }
      inter = window.setInterval(request, 30000);
    }
    
  }
  catch (error) {
    
    if(server.className != "disconnected") {
      server.className = "disconnected"
      if(inter != null) {
        clearInterval(inter);
      }
      inter = window.setInterval(request, 3000);
    }

  }

}

async function live() {
  inter = null;
  request();
}





// TOOLTIP

body = document.querySelector('body');

lastMove = 0;
body.addEventListener("mousemove", (e) => {
  lastMove = 0;
  tooltip.style.display = "none";
});

function timer() {
  lastMove = lastMove + 1;
  if(lastMove >= 5) {
    tooltip.style.display = "block";
  }
}

setInterval("timer()", 70);

Array.from(document.getElementsByClassName("geometry line u1")).forEach(function(el) {
  el.addEventListener("mousemove", (e) => {
    tooltip.style.visibility = "visible";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    Tu1.style.display = "block";

  });
  el.addEventListener("mouseout", (e) => {
    tooltip.style.visibility = "hidden";
    Tu1.style.display = "none";
  });
});

Array.from(document.getElementsByClassName("geometry line u2")).forEach(function(el) {
  el.addEventListener("mousemove", (e) => {
    tooltip.style.visibility = "visible";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    Tu2.style.display = "block";

  });
  el.addEventListener("mouseout", (e) => {
    tooltip.style.visibility = "hidden";
    Tu2.style.display = "none";
  });
});

Array.from(document.getElementsByClassName("geometry line u3")).forEach(function(el) {
  el.addEventListener("mousemove", (e) => {
    tooltip.style.visibility = "visible";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    Tu3.style.display = "block";

  });
  el.addEventListener("mouseout", (e) => {
    tooltip.style.visibility = "hidden";
    Tu3.style.display = "none";
  });
});

Array.from(document.getElementsByClassName("geometry line u4")).forEach(function(el) {
  el.addEventListener("mousemove", (e) => {
    tooltip.style.visibility = "visible";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    Tu4.style.display = "block";

  });
  el.addEventListener("mouseout", (e) => {
    tooltip.style.visibility = "hidden";
    Tu4.style.display = "none";
  });
});

Array.from(document.getElementsByClassName("geometry line u6")).forEach(function(el) {
  el.addEventListener("mousemove", (e) => {
    tooltip.style.visibility = "visible";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    Tu6.style.display = "block";

  });
  el.addEventListener("mouseout", (e) => {
    tooltip.style.visibility = "hidden";
    Tu6.style.display = "none";
  });
});




// ON START
live();