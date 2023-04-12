const progress = document.getElementById("bar");
const volRange = document.getElementById("volume-range");
const sources = document.getElementsByTagName("audio");
const playbutton = document.getElementById("playbtn");
const volumeBtn = document.getElementById("volumebtn"),states = ["fa-volume-mute", "fa-volume-off", "fa-volume-low", "fa-volume-high"],nStates = [2, 30, 75, 100];
window.state = "fa-volume-high";
const playPause = document.getElementById("play-pause");
var songNo = 0,selec = false;

playbutton.addEventListener("click", () => {
	if(sources[songNo].paused) {
		sources[songNo].play();
	} else {
		sources[songNo].pause();
	}
});

Array.from(sources).forEach(source => {
	source.addEventListener("play", () => {
		playPause.classList.add("pause");
		playPause.classList.remove("play");
	});
	source.addEventListener("pause", () => {
		playPause.classList.add("play");
		playPause.classList.remove("pause");
	});
})

volRange.addEventListener("change", () => {
	var stateNo;
	if(volRange.value < 2) {
		stateNo = 0;
	} else if(volRange.value < 30) {
		stateNo = 1;
	} else if(volRange.value < 75) {
		stateNo = 2;
	} else {
		stateNo = 3;
	}
	volumeBtn.getElementsByTagName("i")[0].classList.remove(window.state);
	window.state = states[stateNo];
	volumeBtn.getElementsByTagName("i")[0].classList.add(window.state);
	sources[songNo].volume = volRange.value/100;
});
volumeBtn.addEventListener("click", () => {
	for(var i = 0;i < states.length;i++) {
		if(states[i] == window.state) {
			if(i == 3) {
				i = -1;
			}
			volumeBtn.getElementsByTagName("i")[0].classList.remove(window.state);
			window.state = states[i+1];
			volumeBtn.getElementsByTagName("i")[0].classList.add(window.state);
			volRange.value = nStates[i+1];
			sources[songNo].volume = volRange.value/100;
			break;
		}
	}
});
progress.addEventListener("mousedown", () => {
	selec = true;
});
window.addEventListener("mouseup", () => {
	selec = false;
	sources[songNo].currentTime = progress.value/1000000*sources[songNo].duration;
});

function setProgress(fraction) {
	if(selec) return;
	if(fraction > 1 || fraction < 0) return;
	progress.value = `${fraction*1000000}`;
}
function music() {
	window.removeEventListener("click", music);
	const context = new AudioContext();
	const ce = document.getElementsByTagName("canvas")[0];
	const cc = ce.getContext('2d');
	ce.width = window.innerWidth * 0.76;
	ce.height = 120;
	window.addEventListener("resize", () => {
		ce.width = window.innerWidth * 0.76;
	});
	const analyser = context.createAnalyser();
	
	Array.from(sources).forEach(source => {
		const esource = context.createMediaElementSource(source);
		esource.connect(analyser);
		analyser.connect(context.destination);
	});

	analyser.fftSize = 256;
	const dataArr = new Uint8Array(analyser.frequencyBinCount);
	

	function frame(){
		setProgress(sources[songNo].currentTime/sources[songNo].duration);
		analyser.getByteFrequencyData(dataArr);

		const ar = {x:ce.width, y:ce.height, width: ce.width/dataArr.length};
		
		cc.clearRect(0, 0, ar.x, ar.y);

		cc.fillStyle = "#fff";
		cc.strokeStyle = "#fefefe";
		for(var i = 0;i < dataArr.length;i++){
			cc.beginPath();
			cc.moveTo(i*ar.width, ar.y);
			cc.lineTo(i*ar.width, ar.y-dataArr[i]/2);
			cc.stroke();
		}
		requestAnimationFrame(frame);
	}
	frame();
};
function setSong(no) {
	sources[songNo].pause();
	document.getElementById("song-tit").innerHTML = sources[no].getAttribute("data-name");
	sources[no].volume = sources[songNo].volume;
	songNo = no;
}
window.addEventListener("click", music);