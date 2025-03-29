// Shader Constants
const vertexShaderSource = `
attribute vec2 position;
varying vec2 texCoords;
        
void main() {
    texCoords = vec2((1.0+position.x)/2.0, (1.0-position.y)/2.0); // Compute texture coordinates
    gl_Position = vec4(position, 0.0, 1.0);
}
`
const fragmentShaderSource = `
precision highp float;
uniform sampler2D textureSampler;
uniform float filterAmount;
varying vec2 texCoords;

const mat3 greenCorrection = 0.75 * mat3(
    -4.000000, 5.000000, 0.000000,
    9.333333, -8.333333, 0.000000,
    -4.000000, 3.571429, 1.428571
);
const mat3 redCorrection = 0.25 * mat3(
    49.111111, -48.111111, 0.000000,
    -62.000000, 63.000000, 0.000000,
    19.794195, -20.113456, 1.319261
);

void main() {
    vec4 color = texture2D(textureSampler, texCoords);
    vec3 colorBlindCorrected = color.rgb*redCorrection + color.rgb*greenCorrection;
    gl_FragColor = vec4(filterAmount*colorBlindCorrected+(1.0-filterAmount)*color.xyz, color.a);
}
`

// Logic for accessing user camera

// First list all the devices and let the user select the preferred device

window.addEventListener("load", async () => {
    try {
        await navigator.mediaDevices.getUserMedia({video: true}); // Request video permission
    } catch (err) {
        alert("An error has occured. Please note that this app will not work without access to your camera.\n"+err);
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    // Find all video devices and add them as an option
    const deviceSelector = document.getElementById("device-selector");
    devices.forEach(device => {
        if(device.kind == 'videoinput') {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.innerHTML = device.label;
            deviceSelector.appendChild(option);
        }
    });
});

const deviceForm = document.getElementById("device-form");
const contrastControls = document.getElementById("contrast-controls");
contrastControls.style.display = "none";
const video = document.getElementById("camera");

deviceForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const data = new FormData(deviceForm);
    // Set up a video tag which plays the video from the video stream
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: data.get("device-selector")}});
        video.srcObject = stream;
        video.play();
        setCanvasSize(stream.getVideoTracks()[0].getSettings().width, stream.getVideoTracks()[0].getSettings().height);
        deviceForm.remove();
        contrastControls.style.display = "";
        render();
    } catch(err) {
        alert("We're sorry, an error seems to have occured. Try a different camera.\n"+err);
    }
});

function getCamera() {
    return new Promise(async resolve => {
        const videos = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    });
}

// WebGL Logic
const canvas = document.getElementById("output");
const gl = canvas.getContext('webgl');

if(!gl) {
    alert("This device does not support WebGL. Unfortunately, you cannot run the program without WebGL.")
}

function setCanvasSize(width, height) {
    console.log(width);
    console.log(height);
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

// Load program
function compileShadersAndRunProgram(vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log("Vertex shader failed to compile.");
        console.error(gl.getShaderInfoLog(fragmentShader));
    }
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log("Fragment shader failed to compile.");
        console.error(gl.getShaderInfoLog(fragmentShader));
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Program failed to link.");
        console.error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);
    return program;
}

function drawPoints(program) {
    const positions = new Float32Array([
        -1.0, -1.0, // Bottom-left
         1.0, -1.0, // Bottom-right
        -1.0,  1.0, // Top-left
        -1.0,  1.0, // Top-left
         1.0, -1.0, // Bottom-right
         1.0,  1.0  // Top-right
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Set and enable the array buffer as the 'position' variable
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
}

function setFloat(program, name, value) {
    const location = gl.getUniformLocation(program, name);
    gl.uniform1f(location, value);
}

function createTexture() {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

function updateTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
}

function render() {
    updateTexture(texture);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}

const program = compileShadersAndRunProgram(vertexShaderSource, fragmentShaderSource);
const texture = createTexture();
drawPoints(program);

// Filter controls
const filterAmount = document.getElementById("filter-amount");
setFloat(program, "filterAmount", 0.075);
filterAmount.addEventListener("change", () => {
    setFloat(program, "filterAmount", filterAmount.value);
});