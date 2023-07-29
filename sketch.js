var t;
var fft;
var waveX;
var waveY;
var introP;
var helixNum = 0;
var uploadMusic;
var sound;
var soundPlaying;

let counter = 0;


$(document).ready(function () {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    // Determine if vibration is supported in this web browser
    if (!navigator.vibrate) {
        $('#supported').hide();
        return;
    }

    $('#unsupported').hide();

    // One second vibration
    $('#one').click(function () {
        navigator.vibrate(1000);
    });

    // Vibration pattern
    $('#pattern').click(function () {
        navigator.vibrate([500, 100, 250, 100, 1000]);
    });

    // 10 second vibration
    $('#ten').click(function () {
        navigator.vibrate(10000);
    });

    // Stop all vibrations
    $('#stop').click(function () {
        navigator.vibrate(0);
    });

    const musicFileInput = document.getElementById('musicFile');
    musicFileInput.addEventListener('change', onMusicSelected);

    fft = new p5.FFT();
});

function onMusicSelected(event) {
    const file = event.target.files[0];
    if (file.type.startsWith('audio/')) {
        sound = loadSound(URL.createObjectURL(file), onMusicLoaded);
    } else {
        console.error('Invalid file type. Please upload an audio file.');
    }
}

function onMusicLoaded() {
    sound.amp(0.2);
    sound.loop();
    soundPlaying = true;
}

function setup() {
    createCanvas(400, 400);
    stroke(0, 18);
    noFill();
    t = 0;
  
    introP = createP("Drag and drop a sound file to start");
    introP.style("color", "#fff");
    introP.position(width / 2, height / 2);
  
    uploadMusic = select('#uploadMusicHere');
    uploadMusic.dragOver(highlight);
    uploadMusic.dragLeave(unhighlight);
    uploadMusic.drop(gotFile, unhighlight);
  
    setInterval(increment, 1000);
  }

function draw() {
    if (soundPlaying) {
        let spectrum = fft.analyze();
        var x1 = width * noise(t + 15);
        var x2 = width * noise(t + 25);
        var x3 = width * noise(t + 35);
        var x4 = width * noise(t + 45);
        var y1 = height * noise(t + 55);
        var y2 = height * noise(t + 65);
        var y3 = height * noise(t + 75);
        var y4 = height * noise(t + 85);
      
        bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    
        let test = spectrum[counter]/10000;
        t += test;

        if (frameCount % 500 == 0) {
            background(255);
        }
    }
}

function unhighlight() {
    introP.style('color', 'white');
  }
  
  function highlight() {
    introP.style('color', 'magenta');
  }
  function gotFile(file) {
    sound = loadSound(file.data, fileSuccess, fileError);
    fft = new p5.FFT();
    sound.amp(0.2);
  }
  
  function fileSuccess() {
    introP.hide();
    sound.play();
    soundPlaying = true;
    console.log("sound file uploaded");
  }
  
  function fileError() {
    console.log("The file you uploaded isn't a working sound file. Nuts!");
  }
  
  function increment() {
    counter++;
  }
