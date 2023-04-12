var paddle = {'x':((window.innerWidth/2)-80)/4,'velocity':0},circle = {'y':0,'x':0,'use':false,'velocity':0},paused = false,pauseBtn,score = 0;

function createCanvas(){
	var c = document.createElement("CANVAS");
	c.id = "canvas";
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	document.body.appendChild(c);
	return [c.getContext('2d'),c];
}
function createPauseMenu(){
	var b = document.createElement("BUTTON");
	b.innerHTML = "PLAY";
	b.addEventListener("click",function(){
		document.body.requestPointerLock();
	})
	b.id = "pausebtn";
	document.body.appendChild(b);
	pauseBtn = b;
}
function pointerLockUpdate(){
	if(paused == "DONE") return;
	if(document.pointerLockElement == null){
		paused = true;
		createPauseMenu();
	}else{
		try {
			pauseBtn.remove();
			paused = false;		
		}catch(err){
			console.warn("Not Removeable")
		}
	}
}
function random(min,max){
	return Math.floor((Math.random() * max-min) + min);
}
function playNote(frequency,g = null,o = null,context = new AudioContext()) {
	o = context.createOscillator();
    g = context.createGain();
    o.connect(g);
    o.frequency.value = frequency;
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
}
document.body.addEventListener("mousemove",function(ev){
	paddle.velocity += ev.movementX/20;
});

document.addEventListener('pointerlockchange', pointerLockUpdate, false);
document.querySelector("div#giftbox").addEventListener("click",function(){
	this.remove();
	var lastCalledTime,fps,ctx;
	[ctx,canvas] = createCanvas();
	canvas.requestPointerLock();
	window.addEventListener("resize",function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;		
	});
	var p = document.createElement("P");
	p.id = "red";
	p.innerHTML = "Get Ready!";
	document.body.appendChild(p);
	setTimeout(function(){
		p.remove();
		setInterval(function(){
			if(paused) return;
			delta = (performance.now() - lastCalledTime)/1000;
			lastCalledTime = performance.now();
			ctx.fillStyle = "#eee"
			ctx.fillRect(0,0,canvas.width,canvas.height)
			// circle
			if(!circle.use){			
				circle.x = random(15,window.innerWidth-15);
				circle.velocity = 0;
				circle.use = true;
			}else{
				if(circle.x >= paddle.x && circle.x <= paddle.x+250 && circle.y >= canvas.height-80){
					circle.use = false;
					score++;
					playNote(1865)
					circle.y = 20;
					document.querySelector("#score").innerHTML = "Score: "+score;
				}
				if(circle.y > window.innerHeight){
					// Cleanup
					document.querySelector("#FPS").remove();
					canvas.remove();
					document.querySelector("#score").style = "left: 50%;top: 50%;transform:  translate(-50%,-50%);width: 200px;text-align: center;width: 400px;";
					document.querySelector("#score").innerHTML = "<button onclick='window.location.reload();'>Play Again</button><br>Your score is "+score+".";
					paused = "DONE";
					document.exitPointerLock()
					return false;
				}
				// implement some physics
				circle.velocity += 0.5;
				circle.y += circle.velocity;
			}
			ctx.beginPath();
			ctx.arc(circle.x,circle.y, 20, 0, 2 * Math.PI);
			ctx.fillStyle = "red"
			ctx.fill()
			ctx.stroke();
			circle.y -= 1;
			// paddle
			if((paddle.x > 0 && paddle.velocity < 0) || (paddle.x+250 < window.innerWidth && paddle.velocity > 0)){
				paddle.x += paddle.velocity;
			}else{
				paddle.velocity = 0;
			}
			if(paddle.velocity < 0){
				paddle.velocity = paddle.velocity*0.85;
			}else{
				paddle.velocity = paddle.velocity*0.85;
			}
			ctx.fillStyle = "green"
			ctx.fillRect(paddle.x,canvas.height-40,250,30);
		},16);
		setInterval(function(){
			try{			
				document.querySelector("p#FPS").innerHTML = "FPS : "+Math.round(1/delta);
			}catch(e){			
				clearInterval(this);
			}
		},500);
	},2000)
});
