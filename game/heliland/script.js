const FPS = 1000/60;
var scale,heliMin = 65,heliY = 65,heliVel = 0,key = {up: false,right: false},relY = 0,heliRot = 0,heliX = 0,heliVelX = 0,paused = false,heliSkin = './blue-helicopter.png';
const cache = {};
const cloudPos = [];

const canvas = document.createElement("canvas");
const resize = () => {
    scale = {
        x: window.innerWidth/100,
        y: window.innerHeight/100
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resize();
window.addEventListener('resize', resize);
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
/**
 * @param {string} src
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} rotation
*/
const drawImage = (src, x, y, w, h, rotation = 0, relative = false) => {
    var img;
    if(relative) {
        x -= heliX;
        y += relY;
    }
    rotation*= Math.PI/180;
	if(cache[src]){
		img = cache[src];
	}else{
		img = new Image()
		img.src = src;
		cache[src] = img;
        img.addEventListener('load',() => {
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.drawImage(img, 0, 0, w, h);
            ctx.rotate(0-rotation);
            ctx.translate(0-x, 0-y);
        });
        return;
    }
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.rotate(0-rotation);
    ctx.translate(0-x, 0-y);
}
const clearScreen = () => {
    const ogfs = ctx.fillStyle;
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = ogfs;
}
/**
 * @param {string} color
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
*/
const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect((x-heliX)*window.innerWidth/100, (y+relY)*window.innerHeight/100, (w)*window.innerWidth/100, (h+relY)*window.innerHeight/100);
}
/**
 * @param {string} text
 * @param {string} color
 * @param {Number} x
 * @param {Number} y
*/
ctx.font = "30px Arial";
const text = (text, x, y, color) => {
    ctx.font = "50px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x*window.innerWidth/100, y*window.innerHeight/100);
    ctx.font = "30px Arial";
}
setInterval(() => {
    if(paused) return;
    clearScreen();
    drawScene();
    if(heliY < window.innerHeight/2){
        relY = 0;
        drawImage(heliSkin, (window.innerWidth-76)/2, window.innerHeight-heliY, 76, 34, heliRot);
    }else{
        relY = heliY-window.innerHeight/2;
        drawImage(heliSkin, (window.innerWidth-76)/2, (window.innerHeight-34)/2, 76, 34, heliRot);
    }
    ctx.fillStyle = "#000";
    ctx.fillText(`Alititude: ${Math.round(heliY-65)}`, 0, 30);
    ctx.fillText(`Velocity: ${Math.round(heliVel*10)}`, 0, 60);
    ctx.fillText(`Distance: ${Math.round(heliX)}`, 0, 90);
    if(key.up) {
        heliVel+= heliVel < 10 ? 0.05 : 0;
        heliRot+= heliRot < 5 ? 0.1 : 0;
    }else {
        heliRot-= heliRot > 0 ? 0.2 : 0;
        heliVel -= heliVel > -10 ? 0.1 : 0;
    }
    if(key.right){
        heliRot += heliRot < 7 ? 0.25 : 0;
        heliVelX+= heliVel > 0 ? 0.2 : 0;
        heliVel+= heliVel < -1 ? 1.05 : 0;
    }
    heliVelX+= heliVel > 0.05 ? 0.01 : -0.005;
    if(heliVelX < 0){
        heliVelX = 0;
    }else if(heliVelX > 4){
        heliVelX = 2;
    }
    heliX+=heliVelX
    heliY += heliVel;
    if(heliY <= 65 && heliVel < 0){
        if(heliVel < -4 || notInBounds()) {
            drawImage('./try_again.png', (window.innerWidth-1000)/2, 147, 1000, 247);
            paused = true;
            restart();
            setTimeout(() => {
                paused = false;
            }, 2000);
        }
        heliVel = 0;
        heliY = 65;
    }
    if(heliY == 65){}
    else if(heliX > 6000){
        text("OUT OF FUEL!", 8, 40, 'red');
        heliVelX = 0;
        heliVel-= heliVel > -15 ? 0.5 : 0;
        key.right = false;
        key.up = false;
    }else if(heliX > 4947){
        text("PASSED HELIPORT!", 8, 40, 'red');
    }else if(heliX > 3200){
        text("Aproaching Heliport!", 8, 40, 'green');
    }else if(heliVel < -6){
        text("YOU ARE LOSING ALITIUDE TO FAST!", 8, 40, 'red');
    }else if(heliY > 1200){
        text("YOU ARE GOING TOO HIGH!", 8, 40, 'red');
    }
    if((heliX > 3950 && heliX < 4948) && heliY == 65){
        drawImage('./gift.png', (window.innerWidth-1000)/2, 147, 1000, 247);
        paused = true;
        restart();
        setTimeout(() => {
            paused = false;
        }, 2000);
    }
}, FPS);
window.addEventListener('keydown', ev => {
    switch(ev.key){
        case 'ArrowUp':
            key.up = true;
            break;
        case 'ArrowRight':
            key.right = true;
    }
});
window.addEventListener('keyup', ev => {
    switch(ev.key){
        case 'ArrowUp':
            key.up = false;
            break;
        case 'ArrowRight':
            key.right = false;
    }
});
function notInBounds(){
    return !(heliX < 448 || (heliX > 3950 && heliX < 4948));
}
function drawScene(){
    drawImage('./airport-overlay.png', 25, 100, 1275, 524, 0, true);
    drawImage('./airport2-overlay.png', 4525, 100, 1275, 524, 0, true);
    drawImage('./building-overlay.png', 225, window.innerHeight-130, 293.5, 100, 0, true);
    ctx.fillStyle = '';
    drawClouds();
    rect(0, 95, 20000, 5, 'lightblue');
    rect(0, 95, 500, 10, 'brown');
    rect(4000, 95, 1000, 10, 'brown');
}
function drawClouds(){
    cloudPos.forEach(element => {
        drawImage(element.type, element.x, element.y, 471, 232, element.r, true);
    });
}
function setupClouds(){
    for(var i = 0;i < 70;i++) {
        r = Math.floor(Math.random()*2)+1;
        cloudPos.push({x: Math.round(7000*Math.random())+225, y: Math.round(-1200*Math.random())-100, type: `./cloud${r}.png`,r: Math.round(Math.random()*10)-5})
    }
    for(var i = 0;i < 35;i++){
        cloudPos.push({x: Math.round(7000*Math.random())+225, y: Math.round(-1200*Math.random())-900, type: `./cloud3.png`,r: Math.round(Math.random()*10)-5})
    }
}
setupClouds();
function restart(){
    heliMin = 65;
    heliY = 65;
    heliVel = 0;
    key = {up: false,right: false};
    relY = 0;
    heliRot = 0;
    heliX = 0;
    heliVelX = 0;
}
window.addEventListener('load', () => {
    const pausePlay = document.getElementsByClassName("pause-play")[0];
    const switchButton = document.getElementsByClassName("switch-button")[0];
    const pausePlayBtn = document.getElementsByClassName("pause-play-button")[0];
    pausePlayBtn.addEventListener('click', () => {
        pausePlay.classList.toggle('pause-play-switch');
        paused = paused ? false : true;
    });
    switchButton.addEventListener('click', () => {
        switchButton.classList.toggle('switch-switch');
        heliSkin = heliSkin == "./blue-helicopter.png" ? "./red-helicopter.png" : "./blue-helicopter.png";
    })
})