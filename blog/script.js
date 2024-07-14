const blogsPath = "./posts/"
const listOfBlogs = ["post11.encrypted", "post10.encrypted", "post9.encrypted", "post8.encrypted", "post7.encrypted", "post6.encrypted", "post5.encrypted", "post4.encrypted", "post3.encrypted", "post2.encrypted", "post1.encrypted"];
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

    Promise.all(listOfBlogs.map(async blogPath => {
        const request = await fetch(blogsPath.concat(blogPath));
        const encryptedData = await request.text();
        const decryptedData = new CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);

        const blogElement = document.createElement("div");
        blogElement.classList = "w3-card-4 w3-margin w3-white";
        blogElement.innerHTML = decryptedString;

        const commentsForm = document.getElementById("form").cloneNode(true);
        commentsForm.querySelector("input[type='hidden']").value = blogPath;
        // Form submission
        const form = commentsForm.getElementsByTagName("form")[0];
        form.addEventListener("submit", (ev) => {
            ev.preventDefault();
            var submissionString = "https://docs.google.com/forms/u/1/d/e/1FAIpQLSc-VUQCfheeo0UMi4Zwg1p-3ooaXlYA78IYZHoau8NPaqmiMA/formResponse?"
            const formData = new FormData(form);
            window.formData = formData;
            for(const entry of formData.entries()) {
                submissionString += `${entry[0]}=${entry[1]}&`
            }
            submissionString = submissionString.slice(0, -1);

            const win = window.open(submissionString);
            window.win = win;
            commentsForm.getElementsByTagName("textarea")[0].value = "";
            for(element of commentsForm.getElementsByTagName("input")) {
                if(element.type == "hidden" || element.type == "submit") continue;
                element.value = "";
            }
        });
        commentsForm.style.display = "";
        blogElement.appendChild(commentsForm);
        return blogElement;
    })).then(blogElements => {
        blogElements.forEach(blogElement => {
            document.getElementById("entries").appendChild(blogElement);
        });
    })
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
});