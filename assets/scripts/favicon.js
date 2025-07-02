// This script handles the funny little animated favicon
let TH = 30; // Top Height
let BH = 70;  // Bottom Height
let R = 45; // Radius
let ER = 16; // Eye Radius
const blinkFrames = [];
const eyeMoveFrame = [];
const favicon = document.getElementsByTagName("link")[0];

function computeSVG() {
    return `<svg width="96" height="96" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g>
    <path d="M10 ${TH} Q50 ${50 - R}, 90 ${TH}" stroke="#374151" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M10 ${BH} Q50 ${50 + R}, 90 ${BH}" stroke="#374151" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="50" cy="50" r="${ER}" fill="#374151" />
    </g>
    </svg>`;
}

function computeBlinkFrames() {
    let frame = 1;
    while(frame < 21) {
        R = 45 - (frame * 2);
        BH = 70 - (frame * 1);
        TH = 30 + (frame * 1);
        ER = 16 - (frame * 0.8);
        frame++;
        const blob = new Blob([computeSVG()], {type:'image/svg+xml'});
        blinkFrames.push(URL.createObjectURL(blob));
    }
}

function closeEye() {
    for(let frame = 0;frame < 20;frame++) {
        setTimeout((frame) => {
            favicon.href = blinkFrames[frame];
        }, 50*frame, frame);
    }
}
function openEye() {
    for(let frame = 0;frame < 20;frame++) {
        setTimeout((frame) => {
            favicon.href = blinkFrames[frame];
        }, 50*(20-frame), frame);
    }
}

computeBlinkFrames();
window.addEventListener("load", openEye);
setInterval(() => {
    if(Math.floor(Math.random() * 400) != 0) return;
    closeEye();
    setTimeout(openEye, 1000);
}, 100);