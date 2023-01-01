const holoMeshList = [{
    mesh: FACEMESH_LEFT_EYE.concat(FACEMESH_RIGHT_EYE),
    color: "#555"
},{
    mesh: FACEMESH_LEFT_IRIS.concat(FACEMESH_RIGHT_IRIS),
    color: "#aaa"
}];

const ears = new Image();
ears.src = "./lib/user/dog/ears.png";
const nose = new Image();
nose.src = "./lib/user/dog/nose.png";
const face = new Image();
face.src = "./lib/user/dog/face.png";

function image(landmarks) {
    const width = opt.width;
    const height = opt.height;

    const avg = [getAverage(FACEMESH_RIGHT_EYEBROW, landmarks), getAverage(FACEMESH_LEFT_EYEBROW, landmarks), getAverage(FACEMESH_LIPS, landmarks), getAverage(FACEMESH_LEFT_IRIS, landmarks), getAverage(FACEMESH_RIGHT_IRIS, landmarks)];

    const earrSize = FACEMESH_LEFT_EYEBROW.length*4;
    const marrSize = FACEMESH_LIPS.length*4;
    const ex = (avg[0].x+avg[1].x)/(earrSize);
    const ey = (avg[0].y+avg[1].y)/(earrSize);
    const mx = (avg[2].x/marrSize)*width;
    const my = (avg[2].y/marrSize)*height;
    const bsize = ((avg[0].x - avg[1].x)/1.8)*260;
    const esize = ((avg[3].x - avg[4].x)/0.8)*65;
    const bangle = Math.atan((avg[0].y - avg[1].y)/(avg[0].x - avg[1].x));
    const eangle = Math.atan((avg[3].y - avg[4].y)/(avg[3].x - avg[4].x));
    
    ctx.save();
    ctx.translate(ex*width, ey*height);
    ctx.rotate(bangle);
    ctx.drawImage(face, -esize*1.1, -esize*0.3, esize*2.2, esize*2.2);
    ctx.drawImage(ears, -(bsize/2), -(bsize/2), bsize, bsize);
    ctx.restore();
    ctx.save();
    ctx.translate((2*mx)-(esize/2), (2*my)-(esize/2));
    ctx.rotate(eangle);
    ctx.drawImage(nose, 0, 0, esize, esize*0.65);
    ctx.restore();

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

function getAverage(array, landmarks) {
    const avg = {x: 0,y: 0}
    array.forEach(segmentIndex => {
        segmentIndex.forEach(index => {
            avg.x += landmarks[index].x;
            avg.y += landmarks[index].y;
        });
    });
    return avg;
}

export {image};