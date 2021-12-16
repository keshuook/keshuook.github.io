var down = document.getElementById('down');
var x = 0;
var inter = setInterval(function(){
	x++;
	if(x == 0){
		down.innerHTML = "👇👇";
	}else if(x == 1){
		down.innerHTML = "<br>👇👇";
		
	}else{
		down.innerHTML = "<br><br>👇👇";
		x = 0;
	}
},400);
window.onscroll = function() {
	isSticky()
	document.getElementById('down').style.display = "none";
};

var head = document.getElementById("top-nav");
var sticky = head.offsetTop;

function isSticky() {
  if (window.pageYOffset > sticky) {
    head.classList.add("sticky");
  } else {
    head.classList.remove("sticky");
  }
}
function leave(x){
	document.getElementById('iframe').style.display = "block";
	setTimeout(function(){
		window.location.href = x;
	},800);
}
function feed(x){
	if(x == 'like'){
		localStorage.setItem('feed','like');
	}else if (x == 'dis i like'){
		localStorage.setItem('feed','dis i like');		
	}
}
setInterval(function(){
var feed = localStorage.getItem('feed');
if (feed == "like"){
	document.getElementById('like').style.backgroundColor = "red";
	document.getElementById('dis i like').style.backgroundColor = "";
}else if (feed == 'dis i like'){
	document.getElementById('dis i like').style.backgroundColor = "red";
	document.getElementById('like').style.backgroundColor = "";
}
},50);