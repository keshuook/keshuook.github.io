// Hamburger Menu
const navLinks = Array.from(document.getElementsByClassName("title-show-turn"));
const branding = document.getElementById("branding");
const hamButton = document.getElementById("ham-button");
const hamButtonRects = Array.from(hamButton.getElementsByTagName("rect"));
hamButton.addEventListener("click", () => {
    if(window.innerWidth > 768) return;
    hamButtonRects.forEach(hamButtonRect => {
        hamButtonRect.classList.toggle("ham-close-state");
    });
    branding.classList.toggle("links-show-turn");
    navLinks.forEach(navLink => {
        navLink.classList.toggle("title-show-turn");
    });
});