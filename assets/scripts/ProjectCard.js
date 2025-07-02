class ProjectCard {
    #color;
    #bgSRC;
    #text;
    #tags;
    #title;
    #src;
    #cardElement;
    constructor(title, color, bgSRC, text, tags, src) {
        this.#title = title;
        this.#color = color;
        this.#bgSRC = "../assets/cards/".concat(bgSRC);
        this.#text = text;
        this.#tags = tags;
        this.#src = src;
    }
    appendCard() {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");

        this.#cardElement = projectCard;

        projectCard.addEventListener('click', () => {
            window.open(this.#src, "_blank");
        });

        const image = document.createElement("div");
        image.classList.add("project-image");
        image.style.backgroundColor = this.#color;
        image.style.backgroundImage = `url('${this.#bgSRC}')`;
        projectCard.appendChild(image);

        const content = document.createElement("div");
        content.classList.add("project-content");
        projectCard.appendChild(content);

        const title = document.createElement("h1");
        title.classList.add("project-title");
        title.innerHTML = this.#title;
        content.appendChild(title);

        const tags = document.createElement("div");
        tags.classList.add("project-tags");
        content.appendChild(tags);

        this.#tags.forEach(tag => {
            const tElement = document.createElement("span");
            tElement.innerHTML = tag;
            tElement.classList.add("project-tag");
            tags.appendChild(tElement);
        });

        const info = document.createElement("p");
        info.innerHTML = this.#text;
        content.appendChild(info);

        document.getElementById("projects").appendChild(projectCard);
    }
    updateForRelevance(search, enabledTags) {
        search = search.toLowerCase();
        if((this.#title.toLowerCase().includes(search) || this.#tags.join(' ').toLowerCase().includes(search) || this.#text.toLowerCase().includes(search)) && (enabledTags.some(element => this.#tags.includes(element)) || enabledTags.length == 0)) {
            this.#cardElement.style.display = "";
        } else {
            this.#cardElement.style.display = "none";
        }
    }
}

export {ProjectCard};