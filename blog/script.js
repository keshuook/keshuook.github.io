const blogsPath = "./posts/"
const listOfBlogs = ["post2.encrypted", "post1.encrypted"];
const aboutPath = "./about.encrypted"

window.addEventListener("load", () => {
    const key = window.location.href.split("\?").pop();

    (async () => {
        const request = await fetch(aboutPath);
        const encryptedData = await request.text();
        const decryptedData = new CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
        document.getElementById("about").innerHTML = decryptedString;
    })();

    listOfBlogs.forEach(async blogPath => {
        const request = await fetch(blogsPath.concat(blogPath));
        const encryptedData = await request.text();
        const decryptedData = new CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);

        const blogElement = document.createElement("div");
        blogElement.classList = "w3-card-4 w3-margin w3-white";
        blogElement.innerHTML = decryptedString;

        const commentsForm = document.getElementById("form").cloneNode(true);
        commentsForm.querySelector("input[type='hidden']").value = blogPath;
        commentsForm.getElementsByTagName("form")[0].addEventListener("submit", () => {
            
            commentsForm.getElementsByTagName("textarea")[0].value = "";
            for(element of commentsForm.getElementsByTagName("input")) {
                if(element.type == "hidden" || element.type == "submit") continue;
                element.value = "";
            }
        });
        commentsForm.style.display = "";
        blogElement.appendChild(commentsForm);

        const entries = document.getElementById("entries");
        entries.appendChild(blogElement);
    });
});

// Sticky Navigation
const navigationElement = document.getElementById("nav");
window.addEventListener("scroll", () => {
    if(window.scrollY > 100) {
        navigationElement.classList.add("sticky");
        navigationElement.classList.remove("w3-yellow");
    }else{
        navigationElement.classList.remove("sticky");
        navigationElement.classList.add("w3-yellow");
    }
})