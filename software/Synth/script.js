const troot = 1.0594630943592953;

var sine = new Pizzicato.Sound({
	source: 'wave',
	options: {
        type: 'sine'
	}
});
var saw = new Pizzicato.Sound({
	source: 'wave',
	options: {
        type: 'sawtooth'
	}
});
var square = new Pizzicato.Sound({
	source: 'wave',
	options: {
        type: 'square'
	}
});
var triangle = new Pizzicato.Sound({
	source: 'wave',
	options: {
        type: 'triangle'
	}
});
var whiteNoise = new Pizzicato.Sound(function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < e.outputBuffer.length; i++)
        output[i] = Math.random();
});
var t;
var sound = new Pizzicato.Group();
var reverb = new Pizzicato.Effects.Reverb({
    time: 0.01,
    decay: 0.01,
    reverse: false,
    mix: 0.5
});
var distortion = new Pizzicato.Effects.Distortion({
    gain: 1
});
var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
    lowGain: 0,
    midLowGain: 0,
    midHighGain: 0,
    highGain: 0,
    mix: 1
});
var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0.5
});
var flanger = new Pizzicato.Effects.Flanger({
    time: 0.45,
    speed: 0.2,
    depth: 0.1,
    feedback: 0.1,
    mix: 0.5
});
var compressor = new Pizzicato.Effects.Compressor();
sound.addSound(sine);
sound.addEffect(stereoPanner);
var fin = {'attack':0,'release':0,'freq': 440};
setInterval(function(){
	fin.attack = document.getElementById('atk').value/1000;
	fin.release = document.getElementById('rel').value/1000;
	saw.attack = fin.attack;
	sine.attack = fin.attack;
	square.attack = fin.attack;
	triangle.attack = fin.attack;
	whiteNoise.attack = fin.attack;
	
	saw.release = fin.release;
	sine.release = fin.release;
	square.release = fin.release;
	triangle.release = fin.release;
	whiteNoise.release = fin.release;
	
	saw.frequency = fin.freq;
	sine.frequency = fin.freq;
	square.frequency = fin.freq;
	whiteNoise.frequency = fin.freq;
	

	if(!document.getElementById('infdec').checked){
		document.getElementById('dec').style.display = "block";
		t = document.getElementById('dec').value;
	}else{
		document.getElementById('dec').style.display = "none";
		t = 10000000000;
	}
	sound.on('play',function(){
		setTimeout(function(){
			sound.stop();
		},t);
	});
	
	reverb.mix = document.getElementById('revmix').value/1000;
	reverb.decay = document.getElementById('revdec').value/1000;
	reverb.time = document.getElementById('revti').value/1000;
	reverb.reverse = document.getElementById('revrev').checked;

	distortion.gain = document.getElementById("disgain").value/1000;
	
	quadrafuzz.mix = document.getElementById("qfmix").value/1000;
	quadrafuzz.lowGain = document.getElementById("qflg").value/1000;
	quadrafuzz.midLowGain = document.getElementById("qfmlg").value/1000;
	quadrafuzz.midHighGain = document.getElementById("qfmhg").value/1000;
	quadrafuzz.highGain = document.getElementById("qfhg").value/1000;
	
	whiteNoise.volume = document.getElementById("wngain").value/1000;

	stereoPanner.pan = document.getElementById("volp").value/1000;
	sound.volume = document.getElementById("volg").value/1000;
	
	compressor.threshold = document.getElementById("comt").value;
	compressor.knee = document.getElementById("comk").value;
	compressor.ratio = document.getElementById("comra").value;
	compressor.release = document.getElementById("comr").value/1000;
	compressor.attack = document.getElementById("coma").value/1000;

	flanger.time = document.getElementById("flati").value/1000;
	flanger.speed = document.getElementById("flasp").value/1000;
	flanger.depth = document.getElementById("flade").value/1000;
	flanger.feedback = document.getElementById("flafe").value/1000;
	flanger.mix = document.getElementById("flami").value/1000;
},20);

document.getElementById('wave').addEventListener("change",function(){
	sound.removeSound(saw);
	sound.removeSound(square);
	sound.removeSound(triangle);
	sound.removeSound(sine);
	if(this.value == "sine"){
		sound.addSound(sine);
	}else if(this.value == "sawtooth"){
		sound.addSound(saw);
	}else if(this.value == "square"){
		sound.addSound(square);
	}else if(this.value == "triangle"){
		sound.addSound(triangle);
	}else{
		console.error("Unidentifiable type of wave");
		document.write("Error please reload the page.");
	}
});
document.getElementById('onrev').onchange = function(){
	if(this.checked){
		sound.addEffect(reverb);
	}else{
		sound.removeEffect(reverb);
	}
}
document.getElementById('ondis').onchange = function(){
	if(this.checked){
		sound.addEffect(distortion);
	}else{
		sound.removeEffect(distortion);
	}
}
document.getElementById('onqf').onchange = function(){
	if(this.checked){
		sound.addEffect(quadrafuzz);
	}else{
		sound.removeEffect(quadrafuzz);
	}
}
document.getElementById('onwn').onchange = function(){
	if(this.checked){
		sound.addSound(whiteNoise);
	}else{
		sound.removeSound(whiteNoise);
	}
}
document.getElementById('oncom').onchange = function(){
	if(this.checked){
		sound.addEffect(compressor);
	}else{
		sound.removeEffect(compressor);
	}
}
document.getElementById('onfla').onchange = function(){
	if(this.checked){
		sound.addEffect(flanger);
	}else{
		sound.removeEffect(flanger);
	}
}

function hint(str){
	document.getElementById('hint').innerHTML = str;
}
function fineTune(elem,type){
	var div = document.createElement("div");
	div.style = "width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.95);";
	document.body.appendChild(div);
	var input = document.createElement("INPUT");
	input.style = "top: 45%;left: 50%;position: absolute;transform: translate(-50%, -50%);width: 20%;height: 5%;font-size: 24px;";
	input.type = type;
	input.value = elem.value;
	div.appendChild(input);
	var ok = document.createElement("BUTTON");
	ok.style = "top: 50%;left: 50%;position: absolute;transform: translate(-50%, -50%);width: 20%;";
	ok.innerHTML = "ok";
	ok.onclick = function(){
		elem.value = input.value;
		div.remove();
	}
	div.appendChild(ok);
}
var keyname = ["c","c#","d","d#","e","f","f#","g","g#","a","a#","b"];
var keys = document.getElementById('keys');
var defocus = document.getElementById('defocus');
for (var i = 0;i < 3;i++){
	for(var j = 0;j < 12;j++){
		var button =  document.createElement("BUTTON");
		button.innerHTML = keyname[j]
		if(keyname[j].length == 2){
			button.classList.add('blacknote')
		}else{
			button.classList.add('whitenote')
		}
		button.classList.add('no-select')
		button.meta = i*12+j+40;
		button.addEventListener("click",function(){
			fin.freq = freqCompute(this.meta);
			sound.play();
			setTimeout(function(){
				defocus.focus();
			},1000);
		});
		keys.appendChild(button);
	}
}


keys.style.top = window.innerHeight - 200 + "px";

function freqCompute(freq){
	return (troot**(freq-49))*document.getElementById('freq').value;
}
function help(){
	var overlay = document.createElement("DIV");
	overlay.style = "width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.65);color: #fff;font-size: 24px;";
	var btn = document.createElement("BUTTON");
	btn.innerHTML = "Next";
	btn.style = "border: none;right: 160px;top: 420px;position: absolute;font-size: 48px;"
	overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>Adjust the various controls by dragging the scrollbars and checking the checkboxes. After adjusting the controls to your liking, play the keyboard. Alternatively, you can hit the play button to play the default note.<p>";
	overlay.appendChild(btn);
	document.body.appendChild(overlay);
	var i = 0;
	btn.onclick = function(){
		if(i == 0){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>Hover over various controls and you can see what they are for in the yellow box.<p>";
			overlay.appendChild(btn);
		}else if(i == 1){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>If you double click the sliders, you can finetune the slider in the popup that appears.<p>";
			overlay.appendChild(btn);
		}else if(i == 2){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>You can save the state of the various controls in a .ssf file (synth state file) using the file save option. You can later load it back in using the file load option.<p>";
			overlay.appendChild(btn);
			this.innerHTML = "Close";
		}
		else{
			overlay.remove();
		}
		i++;
	}
}
function download(){
	var a = document.createElement("A");
	a.download = "song.ssf";
	var r = document.getElementsByTagName("input");
	var d = "";
	for(var i = 0;i < r.length;i++){
		if(r[i].type == "checkbox"){
			d += r[i].checked+",";
		}else{
			d += r[i].value+",";
		}
	}
	a.href = "data:text/plain;charset=utf-8,"+d+document.getElementById("wave").value;
	a.click();
	a.remove();
}
var re;
function load(){
	var input,e;
	const reader = new FileReader();
	var f = document.createElement("INPUT");
	f.type = "file";
	f.click();
	f.onchange = function(ev) {
		reader.onload =	function(ev){
			re = event.target.result;
				var r = document.getElementsByTagName("input");
				var i2 = 0,d = "";
				for(var i = 0;i < re.length;i++){
					if(re.charAt(i) == ","){
						if(d == "true" || d == "false"){
							r[i2].checked = (d == 'true');
							if(i2 != 4 && i2 != 6){
								r[i2].onchange();
							}
						}else{
							r[i2].value = d;
						}
						d = "";
						i2++;
					}else{
						d += re.charAt(i);
					}
				}
				document.getElementById("wave").value = d;
		}
		reader.readAsText(event.target.files[0])
	}
}