import {LetterLoader} from './LetterLoader.js';
import {MusicPlayer} from './MusicPlayer.js';

window.addEventListener("DOMContentLoaded", async () => {
    const bannerHeaderLoader = await LetterLoader.createObject("./assets/scripts/letters.json", document.getElementById("banner-title-text"), 0.96);

    Array.from("HELLO").map((l, i) => {return {'letter': l, 'index': i}}).forEach(obj => {
        bannerHeaderLoader.addLetter(obj.letter, 10 + obj.index * 40, 20, 30, 35);
    });

    function updateLetters() {
        bannerHeaderLoader.render();
        bannerHeaderLoader.update();
        if(window.innerWidth < 768) return requestAnimationFrame(updateLetters); // Don't update letters unless the canvas is showing (it won't because of the css rule).
        requestAnimationFrame(updateLetters);
    }
    updateLetters();

    new MusicPlayer(document.getElementById("music-canvas"), document.getElementById("controls"));
}, {once: true});

// Scroll effects

const navElement = document.getElementById("nav");
const projectElements = document.getElementsByClassName("project-card");
const socialSVGElements = document.getElementsByClassName("social-svg");

window.addEventListener("scroll", () => {
    if(window.scrollY <= 20) {
        navElement.classList.add("nav-top");
        navElement.classList.remove("nav-normal");
    } else {
        navElement.classList.add("nav-normal");
        navElement.classList.remove("nav-top");
    }
});

Array.from(projectElements).concat([document.getElementById("player")]).forEach(hiddenElement => {
    if(hiddenElement.getBoundingClientRect().top < window.innerWidth) {
        hiddenElement.classList.remove("hidden");
        return;
    }
    const controller = new AbortController();
    window.addEventListener("scroll", () => {
        if(hiddenElement.getBoundingClientRect().top < window.innerHeight) {
            hiddenElement.classList.remove("hidden");
            controller.abort();
        }
    }, {signal: controller.signal});
});

Array.from(socialSVGElements).forEach(objElement => {
    const controller = new AbortController();
    window.addEventListener("scroll", () => {
        if(objElement.getBoundingClientRect().top < window.innerHeight) {
            // "Reload" object element
            const data = objElement.getAttribute("data");
            objElement.setAttribute("data", "");
            objElement.setAttribute("data", data);
            controller.abort();
        }
    }, {signal: controller.signal});
});