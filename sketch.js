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

        // Map the amplitude to a color range (e.g., from blue to red)
        let mappedAmplitude = map(amplitude.getLevel(), 0, 0.3, 0, 1);
        let r = map(mappedAmplitude, 0, 1, 0, 255);
        let b = map(mappedAmplitude, 0, 1, 255, 0);
        let g = 100;

        // Set stroke color based on the mapped amplitude
        stroke(r, g, b, 100);

        var x1 = width * noise(t + 20);
        var x2 = width * noise(t + 30);
        var x3 = width * noise(t + 40);
        var x4 = width * noise(t + 50);
        var x5 = width * noise(t + 60);
        var y1 = height * noise(t + 70);
        var y2 = height * noise(t + 80);
        var y3 = height * noise(t + 90);
        var y4 = height * noise(t + 100);
        var y5 = height * noise(t + 110);

        bezier(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5);

        let rms = amplitude.getLevel();
        t += rms / 10;

        if (frameCount % 500 == 0) {
            background(255);
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
