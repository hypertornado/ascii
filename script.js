window.onload = function() {
  window.vid = document.getElementById("video");
  start();
}

function start() {


  console.log(navigator.mozGetUserMedia);

  navigator.getUserMedia = (navigator.getUserMedia || 
                            navigator.webkitGetUserMedia || 
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

  navigator.getUserMedia = navigator.webkitGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
       {
          video:true,
          audio:false
       },        
       function(stream) {
        messageHide();
        window.vid.src = window.URL.createObjectURL(stream);
        window.vid.play();
        draw();
       },
       function(error) {
        messageShow('Some error occured. You either not allow usage of your camera, or your browser is not supported :(');
        console.log(error);
       }
    );
  }else {
    messageShow('Sorry, the browser you are using doesn\'t support webkitGetUserMedia');
    return;
  }
}

function messageShow(text) {
  document.getElementById("h1").style.display = "block";
  document.getElementById("h1").textContent = text;
}

function messageHide() {
  document.getElementById("h1").style.display = "none";
}

function draw() {
  write();
  requestAnimationFrame(draw);
}

function write() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var stepsX = 150;
  var stepsY = 60;

  var w = canvas.width;
  var h = canvas.height;

  context.drawImage(window.vid ,0,0,w,h);

  var stepSizeX = Math.floor(w / stepsX);
  var stepSizeY = Math.floor(h / stepsY);

  var brightness;

  var maxBrightness = 0;

  var total = 0;

  var results = [];

  for (var i = 0; i < stepsX; i++) {
    results[i] = [];
    for (var j = 0; j < stepsY; j++) {
      var brightness = getBrightnessAtPosition(context, i * stepSizeX, j * stepSizeY, stepSizeX, stepSizeY);
      results[i][j] = brightness;
      maxBrightness = Math.max(maxBrightness, brightness);
      total += brightness;
    }
  }

  var average = total / (stepsX * stepsY);

  var text = "";

  for (var i = 0; i < stepsY; i++) {
    for (var j = 0; j < stepsX; j++) {
      text += getChar(maxBrightness, results[stepsX - j - 1][i]);
    }
    text += "\n";
  }

  text += "created by Ondřej Odcházel\n";

  var data = document.getElementById("data");
  data.textContent = text;

}

function getChar(max, value) {
  var chars = ["#", "$", "X", "-", ".", " "];
  chars = [" ", " ","-","X","$","#"];
  var string;
  string = " .,;!lXMW@";
  chars = string.split("");

  var step = max / chars.length
  for (var i = 0; i < chars.length; i++) {
    if (value < (i + 1) * step) {
      return chars[i];
    }
  }
  return "@";

}

function getBrightnessAtPosition(ctx, x, y, w, h) {

  var idata = ctx.getImageData(x,y,w,h);
  var data = idata.data;


  var totalBrightness = 0;

  for(var i = 0; i < data.length; i+=4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var brightness = (3*r+4*g+b)>>>3;
    data[i] = brightness;
    data[i+1] = brightness;
    data[i+2] = brightness;
    totalBrightness += brightness;
  }
  return totalBrightness

}


