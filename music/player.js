const progress = document.getElementById("bar");
const volRange = document.getElementById("volume-range");
const sources = document.getElementsByTagName("audio");
const playbutton = document.getElementById("playbtn");
const volumeImg = document.getElementById("volume-img"),states = ["volume-mute.svg", "volume-low.svg", "volume-medium.svg", "volume-high.svg"],nStates = [5, 35, 70, 100];
window.state = "volume-medium.svg";
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
		playPause.src = "../assets/icons/pause.svg";
	});
	source.addEventListener("pause", () => {
		playPause.src = "../assets/icons/play.svg";
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
	window.state = states[stateNo];
	volumeImg.src = `../assets/icons/${window.state}`;
	sources[songNo].volume = volRange.value/100;
});
volumeImg.addEventListener("click", () => {
	for(var i = 0;i < states.length;i++) {
		if(states[i] == window.state) {
			const stateNo = (i+1)%4;
			window.state = states[stateNo];
			volRange.value = stateNo == 0 ? 0 : nStates[stateNo];
			volumeImg.src = `../assets/icons/${window.state}`;
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
	});
	analyser.connect(context.destination);

	analyser.fftSize = 256;
	const dataArr = new Uint8Array(analyser.frequencyBinCount);
	

	function frame(){
		setProgress(sources[songNo].currentTime/sources[songNo].duration);
		analyser.getByteFrequencyData(dataArr);

		const ar = {x:ce.width, y:ce.height, width: ce.width/dataArr.length};
		
		cc.clearRect(0, 0, ar.x, ar.y);

		cc.fillStyle = "#374151";
		cc.strokeStyle = "#374151";
		cc.lineWidth = 4;
		for(var i = 0;i < dataArr.length;i++){
			cc.beginPath();
			cc.moveTo(2 + i*ar.width, ar.y);
			cc.lineTo(2 + i*ar.width, ar.y-dataArr[i]/2);
			cc.stroke();
		}
		requestAnimationFrame(frame);
	}
	frame();
};
function setSong(no) {
	Array.from(document.getElementsByClassName("active")).forEach(element => {
		element.classList.remove("active");
	});
	document.getElementById("song-list").getElementsByTagName("button")[no].classList.add("active");
	sources[songNo].pause();
	document.getElementById("song-tit").innerHTML = sources[no].getAttribute("data-name");
	sources[no].volume = sources[songNo].volume;
	songNo = no;
}
window.addEventListener("click", music);