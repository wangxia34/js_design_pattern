var canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

var backDom = document.createElement('canvas'),
    backCtx = backDom.getContext('2d');
backDom.width = canvas.width;
backDom.height = canvas.height;
document.body.appendChild(backDom); //测试使用

ctx.globalAlpha = 0.85; //关键

function draw(options) {
    backCtx.globalCompositeOperation = 'copy';
    backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(options.x, options.y, options.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(7,120,249,1)';
    ctx.fill();
    
    ctx.drawImage( backDom, 0, 0, backDom.width, backDom.height);
}

var start = {
    x: 25,
    y: 25,
    r: 10
};

var end = {
    x: 300,
    y: 300,
    r: 10
};

function render() {
    if (start.x < end.x && start.y < end.y) {
        draw(start);
        start.x += 5;
        start.y += 5;
        setTimeout(arguments.callee, 50);
    }
}

render();