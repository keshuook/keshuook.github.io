class MusicPlayer {
    #dVol = 0.1;
    #dSeek = 5;
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {HTMLDivElement} controls 
     */
    constructor(canvas, controls) {
        const audioElement = document.getElementsByTagName("audio")[0];
        audioElement.volume = 0.8;

        // Setup controls
        controls.getElementsByClassName("vol-up").item(0).addEventListener("click", () => {
            if(audioElement.paused) return;
            try {
                audioElement.volume += this.#dVol;
            }catch(err){}
        });
        
        controls.getElementsByClassName("vol-down").item(0).addEventListener("click", () => {
            if(audioElement.paused) return;
            try {
                audioElement.volume -= this.#dVol;
            } catch(err){} 
        });

        controls.getElementsByClassName("seek-back").item(0).addEventListener("click", () => {
            if(audioElement.paused) return;
            audioElement.currentTime = audioElement.currentTime - this.#dSeek;
        });
        
        controls.getElementsByClassName("seek-forward").item(0).addEventListener("click", () => {
            if(audioElement.paused) return;
            audioElement.currentTime = audioElement.currentTime + this.#dSeek;
        });

        const playElement = controls.getElementsByClassName("play").item(0);
        playElement.addEventListener("click", () => {
            if(audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        });

        // Setup audio visualiser
        const ctx = canvas.getContext('2d');
        let analyser;
        let arr;
        let timeout = 0;
        let shouldRender;
        const RADIUS = 60;
        const MAX_LEN = 60;
        
        function render() {
            if(!shouldRender) return;
            canvas.width = document.getElementById("display").getBoundingClientRect().width;
            ctx.fillStyle = "#fde047"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(arr);
            const data = {mx: canvas.width/2, my: canvas.height/2};
            
            ctx.strokeStyle = "#CF5C36";
            ctx.lineWidth = 10;
            ctx.fillStyle = "#CF5C36";

            ctx.font = "18px Quicksand"
            ctx.fillText(`Now Playing: ${audioElement.title}`, 5, canvas.height-10);
            
            ctx.beginPath();
            ctx.arc(data.mx, data.my, RADIUS - 5, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.strokeStyle = "#fff";

            ctx.beginPath();
            ctx.arc(data.mx, data.my, RADIUS - 5, 0, 2 * Math.PI * audioElement.currentTime/audioElement.duration);
            ctx.stroke();

            ctx.strokeStyle = "#374151";
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.arc(data.mx, data.my, RADIUS - 10, 0, 2 * Math.PI * audioElement.volume);
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#374151";
            
            let nonZeroLen;
            for(nonZeroLen = arr.length;nonZeroLen > 0;nonZeroLen--) {
                if(arr[nonZeroLen] > 20) break;
            }
            ctx.beginPath();
            for(let i = 0;i < nonZeroLen;i++) {
                const angle =  i/nonZeroLen * 2 * Math.PI;
                ctx.moveTo(data.mx + RADIUS * Math.cos(angle), data.my + RADIUS * Math.sin(angle));
                ctx.lineTo(data.mx + (RADIUS + (MAX_LEN*arr[i]/255)) * Math.cos(angle), data.my + (RADIUS + (MAX_LEN*arr[i]/255)) * Math.sin(angle));
            }
            ctx.stroke();
            requestAnimationFrame(render);
        }

        window.addEventListener("mousedown", () => {
            const audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();
            const aSource = audioCtx.createMediaElementSource(audioElement);
            
            aSource.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = 512;
            arr = new Uint8Array(analyser.frequencyBinCount);
            render();
        }, {once: true});

        audioElement.addEventListener("play", () => {
            playElement.style.backgroundImage = `url("assets/icons/pause.svg")`;
            clearTimeout(timeout);
            shouldRender = true;
            render();
        });
        audioElement.addEventListener("pause", () => {
            playElement.style.backgroundImage = `url("assets/icons/play.svg")`;
            timeout = setTimeout(() => {
                shouldRender = false;
            }, 1000);
        });
    }
}

export {MusicPlayer};