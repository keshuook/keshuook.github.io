var search = document.getElementById('search').value;
function search(item,out){
if (search == item){
document.getElementById('result').href = out;
}
}
search("game","https://sushantan.github.io/game");