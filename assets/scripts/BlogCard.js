class BlogCard {
    constructor(banner, title, content, url) {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");
        blogCard.appendChild(banner);
        
        const contentElement = document.createElement("div");
        contentElement.classList.add("blog-content");
        contentElement.innerHTML = `<h1>${title}</h1><p>${content}</p>`;
        blogCard.appendChild(contentElement);

        const viewArticle = document.createElement("a");
        viewArticle.classList.add("stylised-a");
        viewArticle.innerHTML = "Read Full Article";
        viewArticle.href = url;
        blogCard.appendChild(viewArticle); 

        document.getElementById("content").appendChild(blogCard);
    }
    static async createObjectFromURL(url) {
        const req = await fetch(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(await req.text(), "text/html");
        const title = doc.getElementById("blog-title").innerText;
        const banner = doc.getElementsByClassName("banner")[0];
        const content = doc.getElementById("content").innerText;

        return new BlogCard(banner, title, content, url);
    }
}

export {BlogCard};