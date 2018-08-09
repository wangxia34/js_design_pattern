
function LinearGradient(option) {
    this.ctrlNodesArr = [];
    this.ctrlDrawIndex = 0;
    
    this.canvas = document.getElementById(option.canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.data = option.data
}

LinearGradient.prototype.initData = function() {
    
    this.ctrlNodesArr = {
        "cAx": this.data.ctrlA[0],
        "cAy": this.data.ctrlA[1],
        "cBx": this.data.ctrlB[0],
        "cBy": this.data.ctrlB[1],
        "nowX": this.data.end[0],
        "nowY": this.data.end[1],
        "t":0
    };
    
    this.draw();
    
};

LinearGradient.prototype.draw = function() {
    var self = this;
    this.ctx.beginPath();
    
    this.ctx.moveTo(this.data.start[0], this.data.start[1]);
    // 找到前一个点到下一个点中间的控制点
    var ctrlAx = this.ctrlNodesArr.cAx,
        ctrlAy = this.ctrlNodesArr.cAy,
        ctrlBx = this.ctrlNodesArr.cBx,
        ctrlBy = this.ctrlNodesArr.cBy,
        x = this.ctrlNodesArr.nowX,
        y = this.ctrlNodesArr.nowY;
    self.ctx.bezierCurveTo(ctrlAx, ctrlAy, ctrlBx, ctrlBy, x, y);
    
    var lingrad = this.ctx.createLinearGradient(0,0,0,this.width);
    lingrad.addColorStop(0, 'rgb(255, 158, 68)');
    lingrad.addColorStop(1, 'rgb(255, 70, 131)');
    this.ctx.strokeStyle = 'rgb(255, 70, 131)';
    this.ctx.stroke()
};

LinearGradient.prototype.drawBall = function() {
    var self = this;
    var item = this.ctrlNodesArr;
    var ctrlAx = item.cAx,
        ctrlAy = item.cAy,
        ctrlBx = item.cBx,
        ctrlBy = item.cBy,
        x = item.nowX,
        y = item.nowY,
        ox = 0,
        oy = 0;
    if(this.ctrlDrawIndex === 0) {
        ox = this.data.start[0];
        oy = this.data.start[1]
    }
    if(item.t > 1) {
        this.ctrlDrawIndex++;
        
    }else {
        self.ctx.clearRect(0, 0, self.width, self.height);
        this.draw();
        
        item.t += this.data.speed;
        var ballX = ox * Math.pow((1 - item.t), 3) + 3 * ctrlAx * item.t * Math.pow((1 - item.t), 2) + 3 * ctrlBx * Math.pow(item.t, 2) * (1 - item.t) + x * Math.pow(item.t, 3);
        var ballY = oy * Math.pow((1 - item.t), 3) + 3 * ctrlAy * item.t * Math.pow((1 - item.t), 2) + 3 * ctrlBy * Math.pow(item.t, 2) * (1 - item.t) + y * Math.pow(item.t, 3);
        self.ctx.beginPath();
        self.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx.fill()
    }
    if(this.ctrlDrawIndex < 1) {
        window.requestAnimationFrame(this.drawBall.bind(self))
    }
};