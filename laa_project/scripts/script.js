let mouseX = 0;
let mouseY = 0;
let flashlight = document.getElementById('flashlight');
let next = document.getElementById('next');
let crimeScene = document.getElementById("crime-scene");
let lastClick = localStorage.getItem("lastClick");
let spotNo = 0;

spotDict = {
    "0": {
        x: 0,
        y: 0,
        s: 0
    },
    "1": {
        x: 41,
        y: 81,
        s: 45
    },
    "2": {
        x: 77,
        y: 56,
        s: 35
    },
    "3": {
        x: 38,
        y: 58,
        s: 40
    },
    "4": {
        x: 72,
        y: 67,
        s: 100
    }
}

const done = ([1, 2, 3, 4].map(x => {
    return localStorage.getItem(`person${x}`) ? 1 : 0;
}).reduce((p, c) => p + c, 0)) == 4;

const isTouchDevice = () => {
    try {
        document.createEvent('TouchEvent');
        return true;
    } catch (e) {
        return false;
    }
}

function getMousePosition(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;

    flashlight.style.setProperty("--Xpos", mouseX + "px");
    flashlight.style.setProperty("--Ypos", mouseY + "px");
}

next.addEventListener('mouseenter', () => {
    flashlight.classList.add('nolight');
});


next.addEventListener('mouseleave', () => {
    flashlight.classList.remove('nolight');
});

document.addEventListener('mousemove', getMousePosition);
document.addEventListener('touchmove', getMousePosition);

if (done) {
    next.innerHTML = "Reveal";
    next.href = "./reveal.html"
    next.style.backgroundColor = "blue"
}

crimeScene.width = window.innerWidth;

window.addEventListener("resize", () => {
    crimeScene.width = window.innerWidth;
    renderSpot(flashlight, spotNo);
});

function renderSpot(flashlight, spotNo) {
    const x = spotDict[spotNo].x;
    const y = spotDict[spotNo].y;
    const s = spotDict[spotNo].s;

    const imgW = crimeScene.width;
    const imgH = crimeScene.height;
    const top = (window.innerHeight - imgH)/2;
    const left = (window.innerWidth - imgW)/2;


    // flashlight.style.setProperty("--SpotSize", `${top + (y * (imgH/100))}px`);
    flashlight.style.setProperty("--SpotX", `${left + (x * (imgW/100))}px`);
    flashlight.style.setProperty("--SpotY", `${top + (y * (imgH/100))}px`);
    flashlight.style.setProperty("--SpotSize", `${s * imgH/380}px`);
    flashlight.style.setProperty("--size", `${0.32 * imgH}px`);
}

if (lastClick) {
    spotNo = lastClick;
    renderSpot(flashlight, spotNo);
} else {
    if (isTouchDevice()) {
        alert("Our project is best experienced on a laptop. Please make sure you're using a laptop to view our project. Thank you!");
    }
    alert("Take your time to examine everythong. To interact with one of the four people (later on), simply click on them. Press continue after you speak to them. Reload if the screen is black. If you have connectivity issues, wait a few seconds the first time for everything to load. You can reset the project at the end. Please read the credits for extra information!");
}
