const blogsPath = "./posts/"
const listOfBlogs = {'v1': ["v1/post22.encrypted", "v1/post21.encrypted", "v1/post20.encrypted", "v1/post19.encrypted", "v1/post18.encrypted", "v1/post17.encrypted", "v1/post16.encrypted", "v1/post15.encrypted", "v1/post14.encrypted", "v1/post13.encrypted", "v1/post12.encrypted", "v1/post11.encrypted", "v1/post10.encrypted", "v1/post9.encrypted", "v1/post8.encrypted", "v1/post7.encrypted", "v1/post6.encrypted", "v1/post5.encrypted", "v1/post4.encrypted", "v1/post3.encrypted", "v1/post2.encrypted", "v1/post1.encrypted"]};

window.addEventListener("load", () => {
    const data = window.location.href.split("\?").pop().split(".");
    const key = data[2];

    let numID = window.localStorage.getItem("numID");
    let isNew = false;
    if(!numID) {
        numID = Math.floor(Math.random() * 100000);
        window.localStorage.setItem("numID", numID);
        isNew = true;
    }

    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSfO7KmEXCPVAGDvy98xMei40FKRBCiYRwY603gdCxUzHkSU9g/formResponse", {
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",

        },
        "mode": "cors",
        "body": `entry.953606067=${data[0]}&entry.1123295783=${numID}&entry.1415633528=${isNew ? 'New' : ''}`
    });

    (async () => {
        const request = await fetch(`./posts/${data[1]}/index.encrypted`);
        const encryptedData = await request.text();
        const decryptedData = new CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
        document.getElementById("about").innerHTML = decryptedString;
    })();

    Promise.all(listOfBlogs[data[1]].map(async blogPath => {
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