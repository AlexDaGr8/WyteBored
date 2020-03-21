let canvas = document.getElementById('canvas');
canvas.setAttribute('width', document.body.getBoundingClientRect().width)
let ctx = canvas.getContext('2d');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

let width = canvas.width, height = canvas.height;
let randRange = (min,max) => (Math.random() * (max - min)) + min;
let anim;

let mousedown = false;
let pointsList = [];
let points = [];
let lineWidth = 1;
let strokeColor = '#333';

let lineWidthEl = document.getElementById('line-width');
lineWidthEl.oninput = () => lineWidth = lineWidthEl.value;
let strokeColorEl = document.getElementById('stroke-color');
strokeColorEl.oninput = () => strokeColor = strokeColorEl.value;

let clear = document.getElementById('clear')
clear.onclick = () => {
    pointsList = [];
    draw();
}
let undo = document.getElementById('undo')
undo.onclick = () => {
    pointsList.splice(pointsList.length - 1, 1);
    draw();
}


canvas.onmousedown = () => {
    mousedown = true;
    pointObj = {
        points: [],
        lineWidth: lineWidth,
        strokeColor: strokeColor
    };
    pointsList.push(pointObj);
};
canvas.onmousemove = (e) => {
    if (mousedown) {
        let bbox = e.target.getBoundingClientRect();
        let point = {
            x: e.x - bbox.x,
            y: e.y - bbox.y
        }
        console.log(pointsList)
        pointsList[pointsList.length - 1].points.push(point);
        draw();
    }
}
canvas.onmouseup = () => {
    mousedown = false;
    //cancelAnimationFrame(anim);
}


draw();

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    console.log('poinstList', pointsList)
    if (pointsList.length > 0) {
        pointsList.forEach(points => {
            drawPoints(points);
        })
    };
}

function drawCircle({x,y}, stroke, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.closePath();
}

function drawPoints({points, lineWidth, strokeColor}) {
    if (points.length < 3) {
        var b = points[0];
        ctx.beginPath();
        ctx.moveTo(b.x, b.y)
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }  
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
        return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length - 2; i++) {
        let c = (points[i].x + points[i + 1].x) / 2;
        let d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
        //drawCircle(points[1], 'green', 2);
    }
    console.log('i', i)
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
}

