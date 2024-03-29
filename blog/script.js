const blogsPath = "./posts/"
const listOfBlogs = ["post1.encrypted"];
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

        document.getElementById("entries").appendChild(blogElement);
    });
});