document.getElementsByTagName('input')[0].addEventListener("keyup", function(event) {
	if(event.keyCode === 13){
		event.preventDefault();
		this.nextElementSibling.click()
	}
});
document.getElementsByTagName('button')[1].addEventListener("click", function(){
	if(this.previousElementSibling.value != ""){
		var note = document.createElement("DIV");
		note.classList.add('note');
		note.innerText = this.previousElementSibling.value;
		note.onclick = function(){
			this.classList.toggle('del');
			save();
		}
		
		var cb = document.createElement("BUTTON");
		cb.classList.add('cb');
		cb.onclick = function(){
			this.parentElement.remove();
			save();
		}
		
		document.getElementById('apnotes').appendChild(note);
		note.appendChild(cb);
		save();
		this.previousElementSibling.value = "";
	}
});

function save(){
	var elmnts = document.getElementsByTagName("div");
	var save = "";
	for(var i = 1;i < elmnts.length;i++){
		save += encodeURIComponent(elmnts[i].innerText)+";";
		save += elmnts[i].classList.length+",";
	}
	localStorage.setItem("note",save);
}

window.onload = function(){
	if(localStorage.getItem("note") != undefined){
		var c = localStorage.getItem("note");
		var data = "",el;
		for(var i = 0;i < c.length;i++){
			if(c.charAt(i) == ";"){
				el = document.createElement("div");
				el.innerText = decodeURIComponent(data);
				el.classList.add("note");
				data = "";
				el.onclick = function(){
					this.classList.toggle('del');
					save();
				}
			}else if(c.charAt(i) == ","){
				if(data == "2"){
					el.classList.add("del");
				}
				var cb = document.createElement("BUTTON");
				cb.classList.add('cb');
				cb.onclick = function(){
					this.parentElement.remove();
					save();
				}
				el.appendChild(cb);
				document.getElementById("apnotes").appendChild(el);
				data = "";
			}else{				
				data += c.charAt(i);
			}
		}
	}
}
function help(){
	var overlay = document.createElement("DIV");
	overlay.style = "width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.65);color: #fff;font-size: 24px;";
	var btn = document.createElement("BUTTON");
	btn.innerHTML = "Next";
	btn.style = "border: none;right: 160px;top: 420px;position: absolute;font-size: 48px;background-color: #dddbb0;"
	overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>Type your note in the input field and hit Add to get it added to the list.<p>";
	overlay.appendChild(btn);
	document.body.appendChild(overlay);
	var i = 0;
	btn.onclick = function(){
		if(i == 0){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>You can mark a note as done by clicking on it.<p>";
			overlay.appendChild(btn);
		}else if(i == 1){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>If you hit the cross button on a note, the note will be deleted forever.<p>";
			overlay.appendChild(btn);
		}else if(i == 2){
			overlay.innerHTML = "<p style='position: absolute;left: 40px;top: 30%;'>We store your notes in cookies. If you clear your cookies, your notes will also be cleared.<p>";
			overlay.appendChild(btn);
			this.innerHTML = "Close";
		}
		else{
			overlay.remove();
		}
		i++;
	}
}