var word,chance,solvedword;

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

window.startGame = () => {
    document.getElementById("game-container").style.display = "none";
    window.isGameBeingPlayed = false;
    document.getElementById("choose-word").style.display = "";
    chance = 10;
    setShoeHeight(0);
};

window.addEventListener('load', startGame);

window.addEventListener('submit', data => {
    data.preventDefault();
    if(data.target[0].name == "word_submit"){
        if(!data.target[1].value) return;
        word = data.target[1].value.toUpperCase();
        data.target[1].value = '';
        document.getElementById("choose-word").style.display = "none";
        document.getElementById("game-container").style.display = "";
        var str = "";
        window.isGameBeingPlayed = true;
        solvedword = "";
        for(var i = 1;i <= word.length;i++) {
            str += " ";
            solvedword += " ";
        }
        setDisplayWord(str);
    }
});

window.addEventListener('keydown', event => {
    if(!window.isGameBeingPlayed) return;
    if(!(event.keyCode >= 65 && event.keyCode <= 90)) return;
    console.log(word);
    if(word.includes(event.key.toUpperCase())){
        for(var i = 0;i < word.length;i++){
            if(event.key.toUpperCase() == word[i]){
                solvedword = solvedword.replaceAt(i, word[i]);
            }
        }
        setDisplayWord(solvedword);
        if(word == solvedword){
            setTimeout(() => {
                alert("YOU WON");
                window.startGame();
            }, 1000);
        }
    }else{
        chance--;
    }
    if(chance <= 0) {
        alert("YOU LOSE");
        window.startGame();
    }
    document.getElementById("remainder").innerText = chance;
    setShoeHeight(30-(3*chance));
})

document.getElementById('show-word-button').addEventListener('click', event => {
    event.preventDefault();
    var inputBox = document.getElementById('choose-word-input');
    if(inputBox.type == "password"){
        inputBox.type = "";
        inputBox.innerText = "Hide Word";
    }else{
        inputBox.type = "password";
        inputBox.innerText = "Show Word";
    }
});

function setShoeHeight(height){
    document.getElementById('height-fix').innerHTML = `:root {
        --shoe-hower: ${height}vh;
    }`
}
function setDisplayWord(word){
    word = word.toUpperCase();
    var words = "";
    for(var i = 0;i < word.length;i++) {
        words += `<div class="word-char" style="left: ${12*i}vh;">${word[i]}</div>`
    }
    document.getElementById("words").innerHTML = words;
}
function isDisplayWordSolved(){
    return word == solvedword;
}