// Setup

var phone = false;

function size() {
    if(window.innerWidth <= 800) {
        for(a of document.getElementById("nav").getElementsByTagName("a")) {
            a.style.display = "none";
        }
        for(a of document.getElementById("top-nav").getElementsByTagName("a")) {
            a.style.display = "none";
        }
        phone = true;
    }else{
        phone = false;
        for(a of document.getElementById("nav").getElementsByTagName("a")) {
            a.style.display = "";
        }
        for(a of document.getElementById("top-nav").getElementsByTagName("a")) {
            a.style.display = "";
        }
    }
}

// Hamburger menu
const hbme = document.getElementById("hamburger");
hbme.addEventListener("click", () => {
    document.getElementById("links").classList.toggle("close");
    hbme.classList.toggle("close");
    for(line of hbme.getElementsByTagName("div")) {
        line.classList.toggle("close");
    }
})

window.addEventListener('load', () => {
    window.scrollTo({top: 0});
    size();
});

window.addEventListener("resize", size);

// Code for scrolling down

var scrolledDown = false;
const sche = document.getElementById("search");
const shce = document.getElementById("works");
const mspe = document.getElementById("music-player");
const crde = document.getElementsByClassName("card");

mspe.style.top = "450vh";

window.addEventListener('scroll', () => {
    document.getElementById("text").style.opacity = 1-(window.scrollY/window.innerHeight);
    document.getElementById("text").style.top = `${(0.5-window.scrollY/window.innerHeight)*60}vh`;
});
window.addEventListener('scroll', () => {
    if(window.scrollY > window.innerHeight*0.9){
        document.getElementById("top-nav").style.display = "";
    }else{
        document.getElementById("top-nav").style.display = "none";
    }
    if(window.scrollY > window.innerHeight){
        sche.style.position = "fixed";
        sche.style.zIndex = -1;
        sche.style.top = 0;
    }else{
        sche.style.position = "absolute";
        sche.style.zIndex = 0;
        sche.style.top = "100vh";
    }
    if(window.scrollY > window.innerHeight*2){
        shce.style.position = "fixed";
        shce.style.zIndex = -1;
        shce.style.top = `${2*window.innerHeight - window.scrollY}px`;
    }else{
        shce.style.position = "absolute";
        shce.style.zIndex = 0;
        shce.style.top = "200vh";
    }
    if(window.scrollY > window.innerHeight*(phone ? 4.5 : 3.69)){
        mspe.style.position = "fixed";
        mspe.style.zIndex = -1;
        mspe.style.top = 0;
    }else{
        mspe.style.position = "absolute";
        mspe.style.zIndex = 0;
        mspe.style.top = phone ? "450vh" : "369vh";
    }
    for(var i = 0;i < crde.length;i++) {
        if(window.scrollY > window.innerHeight*(1.4+(0.15*i))) {
            crde[i].classList.remove('animate-card');
        }
    }
    if(window.scrollY < window.innerHeight*1.2){
        for(el of crde){
            el.classList.add("animate-card");
        }
    }
});

// Code for indexing each page of this website
// Data stored as xml on https://keshuook.github.io/sitemap.xml
// On a fast computer this shouldn't take more than 100ms
/**
 * 
 * @returns {Promise}
 */
function generateSearchArrayFromSitemap(){
    const array = [];
    return new Promise(function(resolve, reject){
        fetch("https://keshuook.github.io/sitemap.xml").then(data => {
            data.text().then(data => {
                const passer = new DOMParser();
                const links = passer.parseFromString(data, "application/xml").getElementsByTagName("url");
                for(var i = 0;i < links.length;i++) {
                    array.push(links[i].getElementsByTagName("loc").item(0).innerHTML);
                    resolve(array)
                }
            })
        }).catch((err) => {reject(err)})
    });
}
/**
 * 
 * @param {string} url 
 * @returns {Promise}
 */
function indexPage(url){
    return new Promise((resolve, reject) => {
        if(url == "https://keshuook.github.io") return;
        fetch(url).then((response) => {
            response.text().then(data => {
                const passer = new DOMParser();
                const body = passer.parseFromString(data, "text/html");
                try {
                    body.getElementById("icons").remove();
                }catch(err){}
                const title = body.getElementsByTagName("title").item(0).innerText.toUpperCase();
                function getWordsFrom(tagname){
                    const elements = [];
                    Array.from(body.getElementsByTagName(tagname)).forEach(element => {
                        element.innerText.split(" ").forEach(element => {
                            elements.push(element.replace(" ","").toUpperCase());
                        });
                    });
                    return elements;
                }
                function allTitles(){
                    const titles = [];
                    Array.from(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).forEach(tag => {
                        getWordsFrom(tag).forEach(element => {
                            titles.push(element);
                        });
                    });
                    return titles;
                }
                function allText(){
                    const text = [];
                    Array.from(['span', 'p','button', 'a']).forEach(tag => {
                        getWordsFrom(tag).forEach(element => {
                            text.push(element);
                        });
                    });
                    return text;
                }
                resolve({title: title, priorityA: allTitles(), priorityB: allText(), url: url});
            })
        })
    })
}

const dataarray = [];
var timeTakenToIndex = performance.now();
generateSearchArrayFromSitemap().then(data => {
    data.forEach(element => {
        indexPage(element).then((indexed) => {
            dataarray.push(indexed);
        });
    });
    timeTakenToIndex = performance.now() - timeTakenToIndex
    console.log(`%c[Time taken to index] %c${timeTakenToIndex.toPrecision(4)}ms`, "color: red;font-size: 16px", "color: black;font-size: 16px");
    console.log(`%c[Total Time] %c${performance.now().toPrecision(4)}ms`, "color: red;font-size: 16px", "color: black;font-size: 16px");
    console.log(`%c[Debug] %cIndexed Array:`, "color: red", "color: black;")
    console.log(dataarray);
}).catch((err) => {console.log(err)});

// Code for search displaying

const searchElement = document.getElementById("search-placeholder");

document.getElementsByTagName("form").item(0).addEventListener('submit', (event) => {
    event.preventDefault();
});
searchElement.addEventListener('keyup', () => {
    search(searchElement.value);
});
function search(text) {
    Array.from(document.getElementsByClassName('item')).forEach(element => {
        element.remove();
    });
    var count = 0;
    const done = [];
    dataarray.forEach(element => {
        if(count > 6) return;
        if(element.title.startsWith(text.toUpperCase())){
            createResultElement(element.title, element.url);
            count++;
            done.push(element.title);
        }else{
            var skip = false;
            element.priorityA.forEach(priyorityAText => {
                if(skip) return;
                if(priyorityAText.startsWith(text.toUpperCase())){
                    count++;
                    createResultElement(element.title, element.url);
                    skip = true;
                    done.push(element.title);
                }
            });
        }
    })
    dataarray.forEach(element => {
        if(count > 6) return;
        var skip = false;
        element.priorityB.forEach(priyorityBText => {
            if(skip) return;
            var s = false;
            done.forEach(item => {
                if(item == element.title){
                    s = true;
                }
            });
            if(s) return;
            if(priyorityBText.startsWith(text.toUpperCase())){
                count++;
                createResultElement(element.title, element.url);
                skip = true;
            }
        });
    });
}
/**
 * 
 * @param {string} title 
 * @param {string} url 
 * @returns {void}
 */
function createResultElement(title, url){
    const htmlelement = document.createElement("div");
    htmlelement.addEventListener('click', () => {
        window.open(url);
    })
    htmlelement.classList.add('item');
    htmlelement.innerText = title;
    document.getElementById("search").appendChild(htmlelement);
}

// Audio
const ce = document.getElementById("musical-canvas");
const element = document.getElementById("audio");
ce.width = window.innerWidth;
ce.height = window.innerHeight*0.85;
var audioinit = false;
var paused = true;

element.addEventListener('pause', () => {
    pbe.classList.add("play-state");
    pbe.classList.remove("pause-state");
    setTimeout(() => {
        paused = false;
    }, 700);
});
element.addEventListener('play', () => {
    pbe.classList.remove("play-state");
    pbe.classList.add("pause-state");
    paused = false;
})
window.addEventListener('click', () => {
    if(audioinit) return;
    audioinit = true;

    const ac = new AudioContext();
    const cc = ce.getContext('2d');
    
    const source = ac.createMediaElementSource(element);
    
    const analyser = ac.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(ac.destination);

    var dataArr = new Uint8Array(analyser.frequencyBinCount);

    function frame(){
        if(paused || window.scrollY < window.innerHeight*2.2 || window.scrollY > window.innerHeight*4.85) return requestAnimationFrame(frame);

        analyser.getByteFrequencyData(dataArr);

        var color = [0, 0, 0];
        for(var i = 0;i < dataArr.length/3;i++) color[0] += dataArr[i];
        for(var i = Math.round(dataArr.length/3);i < 2*dataArr.length/3;i++) color[1] += dataArr[i];
        for(var i = Math.round(2*dataArr.length/3);i < dataArr.length;i++) color[2] += dataArr[i];
        
        cc.fillStyle = `rgb(${color[2]/255}, ${color[1]/255}, ${color[0]/255})`;
        cc.fillRect(0, 0, window.innerWidth, window.innerHeight*0.85);
        
        cc.fillStyle = "#fff";
        for(var x = 0;x < window.innerWidth;x+=32) {
            for(var y = 0;y < window.innerHeight;y+=32){
                cc.fillRect(x+(0.5-Math.random())*(dataArr[(x/16)%dataArr.length]*0.025), y+(0.5-Math.random())*(dataArr[(y/16)%dataArr.length]*0.025), 1, 1);
            }
        }

        const c = {x:window.innerWidth*0.5, y:window.innerHeight*0.425}
        cc.strokeStyle = "#fefefe";
        for(var i = 0;i < dataArr.length;i++){
            cc.beginPath();
            const a = Math.PI+(Math.PI*1.3*(i/dataArr.length));
            cc.moveTo(c.x, c.y);
            cc.lineTo(c.x+Math.cos(a)*dataArr[i], c.y+Math.sin(a)*dataArr[i]);
            cc.stroke();
        }
        requestAnimationFrame(frame);
    }
    frame();
});
window.addEventListener('resize', () => {
    ce.width = window.innerWidth;
    ce.height = window.innerHeight;
});
const pbe = document.getElementById("play-button");
pbe.addEventListener('click', () => {
    if(element.paused) element.play();
    else element.pause();
});
document.getElementById("big-play").addEventListener('click', () => {
    pbe.classList.toggle("play-state");
    pbe.classList.toggle("pause-state");
    element.play();
    paused = false;
    removeBigPlay();
});
pbe.addEventListener('click', removeBigPlay);
function removeBigPlay(){
    pbe.removeEventListener('click', removeBigPlay);
    document.getElementById("big-play").remove();
}
setInterval(() => {
    try {
        document.getElementById("time-remaining").value = element.currentTime/element.duration;
    }catch(err){}
}, 200);

// Scroll Tell element code (prone to bugs)

const ste = document.getElementById("scroll-tell");
const sts = "Scroll Down";

function scrollrepeater(){
    ste.innerHTML = "";
    var i = 0;
    const sid = setInterval(() => {
        if(i > sts.length) clearInterval(sid);
        ste.innerHTML += sts.charAt(i);
        i++;
    }, 75);
}
var rid = setInterval(scrollrepeater, 2500);
window.addEventListener('blur', () => {
    clearInterval(rid);
});
window.addEventListener('focus', () => {
    rid = setInterval(scrollrepeater, 2500);
})