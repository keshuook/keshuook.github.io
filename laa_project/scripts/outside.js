const speech = document.getElementById("speech");

speech.style.display = "none";

function initPersonData(id) {
    const p = document.getElementById(`p${id}`);
    p.addEventListener("click", () => {
        localStorage.setItem(`person${id}`, true);
        localStorage.setItem(`lastClick`, id);
        p.style.filter = "sepia(100%)";
        speech.innerHTML = `<img src="assets/speech${id}.png">`
        speech.style.display = "";

        const d = document.createElement("div");
        d.classList.add("back");
        d.innerHTML = "<a id='next' href='./'>Continue</a>";
        document.body.appendChild(d);
        d.addEventListener("click", () => {
            window.location.href = "./"
        })
    });
    if(localStorage.getItem(`person${id}`)) {
        p.style.filter = "sepia(100%)";
    }
}

[1, 2, 3, 4].forEach(i => {
    initPersonData(i);
});