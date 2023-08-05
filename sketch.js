var t;
var fft;
var waveX;
var waveY;
var introP;
var helixNum = 0;
var uploadMusic;
var sound;
var soundPlaying;
var amplitude;
var bassVibrate = true;
let counter = 0;

$(document).ready(function () {
    // Check for vibration support
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

    // Determine if vibration is supported in this web browser
    if (!navigator.vibrate) {
        $('#supported').hide();
        return;
    }

    $('#unsupported').hide();

    const musicFileInput = document.getElementById('musicFile');
    musicFileInput.addEventListener('change', onMusicSelected);

    fft = new p5.FFT();
    soundPlaying = false;
});


function onMusicSelected(event) {
    const file = event.target.files[0];
    if (file.type.startsWith('audio/')) {
        sound = loadSound(URL.createObjectURL(file), onMusicLoaded, fileError);
    } else {
        console.error('Invalid file type. Please upload an audio file.');
    }
}

function onMusicLoaded() {
    sound.amp(0.2);
    sound.loop();
    sound.onended(musicFinishedPlaying);
    soundPlaying = true;
    // Start vibration when music starts playing
    navigator.vibrate(100);
}

function fileError() {
    console.log("The file you uploaded isn't a working sound file.");
    // Stop vibration if there was an error loading the music
    navigator.vibrate(0);
}

function musicFinishedPlaying() {
    soundPlaying = false;
    // Stop vibration when music finishes playing
    navigator.vibrate(0);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0, 20);
    noFill();
    t = 0;

    introP = createP("");
    introP.style("color", "#fff");
    introP.position(width / 1, height / 1);

    uploadMusic = select('#uploadMusicHere');
    uploadMusic.dragOver(highlight);
    uploadMusic.dragLeave(unhighlight);
    uploadMusic.drop(gotFile, unhighlight);

    amplitude = new p5.Amplitude();

}

function draw() {
    if (soundPlaying) {
      let spectrum = fft.analyze();
  
      // Clear the background to create a fading effect
      background(0, 10);
  
      // Set stroke color and weight based on amplitude
      let rms = amplitude.getLevel();
      let strokeColor = color(map(rms, 0, 1, 50, 255), map(rms, 0, 1, 100, 255), 255);
      stroke(strokeColor);
      strokeWeight(map(rms, 0, 1, 1, 5));
  
      // Create colorful and dynamic visuals
      for (let i = 0; i < spectrum.length; i += 10) {
        let angle = map(i, 0, spectrum.length, 0, TWO_PI);
        let radius = map(spectrum[i], 0, 255, 50, height / 2);
  
        let x1 = width / 2 + radius * cos(angle);
        let y1 = height / 2 + radius * sin(angle);
        let x2 = width / 2 + (radius + 100 * rms) * cos(angle);
        let y2 = height / 2 + (radius + 100 * rms) * sin(angle);
  
        line(x1, y1, x2, y2);
  
        // Draw colorful circles at the ends of the lines
        let circleSize = map(rms, 0, 1, 10, 50);
        let circleColor = color(map(angle, 0, TWO_PI, 0, 255), 255, 255);
        fill(circleColor);
        noStroke();
        ellipse(x1, y1, circleSize);
        ellipse(x2, y2, circleSize);
      }
    }
  }
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
function unhighlight() {
    introP.style('color', 'white');
}

function highlight() {
    introP.style('color', 'black');
}

function gotFile(file) {
    sound = loadSound(file.data, onMusicLoaded, fileError);
    fft = new p5.FFT();
    sound.amp(0.2);

    // create a new Amplitude analyzer
    amplitude = new p5.Amplitude();
    // Patch the input to an volume analyzer
    amplitude.setInput(sound);
}

function fileSuccess() {
    introP.hide();
    sound.play();
    soundPlaying = true;
    console.log("sound file uploaded");
    
}
