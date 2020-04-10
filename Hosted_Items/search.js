function outd() {
document.getElementById('output').style.display = 'block';
}
function search() {
document.getElementById('no').innerHTML = 'Search made by keshuook';
var search = document.getElementById('search').value;
if (search == "game") {
outd();
document.getElementById('result').href = "https://sushantan.github.io/game";
}
else if (search == "music") {
outd();
document.getElementById('result').href = "https://sushantan.github.io/music";
} else if (search == "youtube") {
outd();
document.getElementById('result').href = "https://sushantan.github.io/youtube";
} 
else if (search == "comments") {
outd();
document.getElementById('result').href = "https://sushantan.github.io/comments";
} else {
document.getElementById('no').innerHTML = 'no result';
setTimeout(function(){
document.getElementById('no').innerHTML = '';
}
,3000)
}
}
