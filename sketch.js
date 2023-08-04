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
    createCanvas(windowwidth, windowheight);
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
        var x1 = width * noise(t + 15);
        var x2 = width * noise(t + 25);
        var x3 = width * noise(t + 35);
        var x4 = width * noise(t + 45);
        var y1 = height * noise(t + 55);
        var y2 = height * noise(t + 65);
        var y3 = height * noise(t + 75);
        var y4 = height * noise(t + 85);

        bezier(x1, y1, x2, y2, x3, y3, x4, y4);

        let rms = amplitude.getLevel();
        t += rms/10;

        if (frameCount % 500 == 0) {
            background(255);
        }



        // if(rms > 0.1 && bassVibrate){
        //     navigator.vibrate(200);
        //     //console.log(rms)
        //     bassVibrate = false;
        // }
        // else {
        //     bassVibrate = true;
        // }
    }
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
