window.ipt = document.getElementsByClassName("input-video")[0];
window.opt = document.getElementsByClassName("output-video")[0];
window.ctx = opt.getContext('2d');

import {hologram} from './lib/user/hologram.js';
import {image} from './lib/user/image.js';

const stream = opt.captureStream();
var mediaChunks = [];
var mediaRecorder = null;

const button = document.getElementById("start");
button.addEventListener("click", () => {
    if(button.innerText == "Start Recording") {
        mediaRecorder.start();
        button.innerText = "Stop Recording";
    }else{
        mediaRecorder.stop();
        button.innerText = "Start Recording";
    }
});

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `./lib/@mediapipe/face_mesh/${file}`
    }
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults((results) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 1000, 1000);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            window.renderC(landmarks);
        }
    }
});

var cameraStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(mediaStream => {
    window.mediaStream = mediaStream;
    const selects = document.getElementsByTagName("select");
    navigator.mediaDevices.enumerateDevices().then(devices => {
        var counter = {audio: 0, video: 0};
        devices.forEach(device => {
            if(device.kind == "audioinput") {
                const op = document.createElement("option");
                op.innerText = device.label;
                selects[1].append(op);
                op.value = counter.audio;
                counter.audio++;
            }else if(device.kind == "videoinput") {
                const op = document.createElement("option");
                op.innerText = device.label;
                selects[0].append(op);
                op.value = counter.video;
                counter.video++;
            }
        });

    });
});
/**
 * 
 * @param {SubmitEvent} ev 
 */
function formSubmitted(ev) {
    ev.preventDefault();
    setupStream(ev.target[0].value, ev.target[1].value);
    window.renderC = ev.target[2].value == 0 ? hologram : image;
    ev.target.remove();
    document.getElementById("app-elements").style.display = "";
}

function startSending() {
    faceMesh.send({image: ipt}).then(() => {
        requestAnimationFrame(startSending);
    });
}
function setupStream(audioDeviceID, videoDeviceID) {
    stream.addTrack(mediaStream.getAudioTracks()[audioDeviceID]);
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (chunk) => {
        mediaChunks.push(chunk.data);
    });
    mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(mediaChunks, {
            type: "video/webm"
        });
        window.url = URL.createObjectURL(blob);
        const download = document.getElementById("download");
        download.href = url;
        mediaChunks = [];
        download.onclick =  () => {
            setTimeout(() => URL.revokeObjectURL(url), 200);
        };
    });
    

    cameraStream = new MediaStream(mediaStream.getVideoTracks());
    ipt.srcObject = cameraStream;
    ipt.play();
    const settings = cameraStream.getTracks()[videoDeviceID].getSettings();
    opt.width = settings.width;
    opt.height = settings.height;

    ctx.font = "48px Arial";
    ctx.fillText("Loading!", opt.width/2-96, opt.height/2);

    startSending();
}

window.formSubmitted = formSubmitted;