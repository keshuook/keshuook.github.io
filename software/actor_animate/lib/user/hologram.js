const holoMeshList = [{
    mesh: FACEMESH_TESSELATION,
    color: "#f2a441"
},{
    mesh: FACEMESH_FACE_OVAL,
    color: "#000"
},{
    mesh: FACEMESH_LEFT_EYEBROW.concat(FACEMESH_RIGHT_EYEBROW),
    color: "#222"
},{
    mesh: FACEMESH_LEFT_EYE.concat(FACEMESH_RIGHT_EYE),
    color: "#555"
},{
    mesh: FACEMESH_LEFT_IRIS.concat(FACEMESH_RIGHT_IRIS),
    color: "#aaa"
},{
    mesh: FACEMESH_LIPS,
    color: "#ff0000",
}];

function hologram(landmarks) {
    const width = opt.width;
    const height = opt.height;
    holoMeshList.forEach(({mesh, color}) => {
        for(var i = 0;i < mesh.length;i++) {
            ctx.strokeStyle = color;
            const p1 = landmarks[mesh[i][0]];
            const p2 = landmarks[mesh[i][1]];
            ctx.beginPath();
            ctx.moveTo(p1.x*width, p1.y*height);
            ctx.lineTo(p2.x*width, p2.y*height);
            ctx.stroke();
        }
    });
}

export {hologram};