var p = true,d = 0,i = 0;
var songs = ["hyper","footsteps","chiller","retro","thriller","ringtone1","ringtone2"];
var songname = "ring1";
document.getElementById("playpause").onclick = function(){
	this.classList.toggle("pause");
	if(p){
		document.getElementById(songname).play();
		p = false;
	}else{
		document.getElementById(songname).pause();
		p = true;
	}
}
document.getElementById("volume").onmousedown = function(){
	this.nextSibling.nextSibling.style.opacity = "1";
}
document.getElementById("seek").onmousedown = function(){
	d = this.value;
}
document.getElementById("seek").onmouseup = function(){
	document.getElementById(songname).currentTime = this.value;
	d = 0;
}
document.getElementById("volume").onmouseup = function(){
	this.nextSibling.nextSibling.style.opacity = "0";
}
setInterval(function(){	
	if(i > songs.length-1){
		i = 0;
	}else if(i < 0){
		i = songs.length-1;
	}
		songname = songs[i];
	document.getElementById("val").innerHTML = document.getElementById("volume").value;
	document.getElementById("val").style.top = -document.getElementById("volume").value+5+"px";
	document.getElementById(songname).volume = document.getElementById("volume").value/100;
	document.getElementById("stitle").innerHTML = songname;
	document.getElementById("seek").max = document.getElementById(songname).duration;
	if(d == 0){
		document.getElementById("seek").value = document.getElementById(songname).currentTime;
	}
},0);
function setSong(ipt){
	if(!p){
		document.getElementById('playpause').classList.remove("pause");
		document.getElementById(songname).pause();
		p = true;
	}
	i = ipt;
}
var div = document.createElement("DIV");
div.id = "suggested";
div.innerHTML = "<center><h1>Select a song</h1></center>";
for(var i = 0;i < songs.length;i++){
	div.innerHTML += "<button onclick='setSong("+i+");'>"+songs[i]+"</button>";
	div.innerHTML += "<hr>";
}
document.getElementById("middle").appendChild(div);
document.body.onkeyup = function(ev){
	if(ev.keyCode == 32){
		document.getElementById("playpause").click();
	}else if(ev.keyCode == 77){
		document.getElementById("volume").value = 0;
	}else if(ev.keyCode == 85){
		document.getElementById("volume").value = 80;
	}
}
document.onkeydown = function(ev){
	if(ev.keyCode == 38){
		ev.preventDefault();
		document.getElementById("volume").value++;
	}else if(ev.keyCode == 40){
		ev.preventDefault();
		document.getElementById("volume").value--;
	}
}