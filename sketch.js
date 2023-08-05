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
      background(0, 30);
  
      // Set stroke weight based on amplitude
      let rms = amplitude.getLevel();
      let strokeWeightVal = map(rms, 0, 1, 1, 5);
  
      // Create colorful and dynamic visuals
      let numShapes = spectrum.length / 2;
      let angleStep = TWO_PI / numShapes;
      let hue = 0;
  
      for (let i = 0; i < spectrum.length; i += 2) {
        let angle = i * angleStep;
        let radius = map(spectrum[i], 0, 255, 50, height / 3);
  
        let x1 = width / 2 + radius * cos(angle);
        let y1 = height / 2 + radius * sin(angle);
        let x2 = width / 2 + (radius + 100 * rms) * cos(angle);
        let y2 = height / 2 + (radius + 100 * rms) * sin(angle);
  
        // Set the stroke color based on the angle and amplitude
        let strokeColor = color(hue % 255, 255, 255);
        stroke(strokeColor);
        strokeWeight(strokeWeightVal);
  
        // Draw colorful shapes
        if (i % 4 === 0) {
          line(x1, y1, x2, y2);
        } else if (i % 4 === 1) {
          ellipse(x1, y1, 2 * rms * radius);
        } else if (i % 4 === 2) {
          beginShape();
          vertex(x1, y1);
          vertex(x2, y2);
          vertex(width / 2, height / 2);
          endShape(CLOSE);
        } else {
          let size = map(rms, 0, 1, 10, 50);
          fill(strokeColor);
          noStroke();
          ellipse(x2, y2, size);
        }
  
        hue += 3;
      }
    }
  }
  
  
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
function unhighlight() {
    introP.style('color', 'pink');
}

function highlight() {
    introP.style('color', 'blue');
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
