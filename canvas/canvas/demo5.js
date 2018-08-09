
function LinearGradient(option) {
    this.ctrlNodesArr = [];
    this.ctrlDrawIndex = 0;
    
    this.canvas = document.getElementById(option.canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.data = option.data;
    
    this.ctrlNodesArr = {
        "cAx": this.data.ctrlA[0],
        "cAy": this.data.ctrlA[1],
        "cBx": this.data.ctrlB[0],
        "cBy": this.data.ctrlB[1],
        "nowX": this.data.end[0],
        "nowY": this.data.end[1],
        "t": 0
    };
    
    this.biaoji = [];
}

LinearGradient.prototype.drawBall = function(i) {
    
    var key = i ? i : this.biaoji.length;
    
    if(this.biaoji[key] === undefined){
        this.biaoji[key] = 0;
    }
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    for (var j = 0; j < this.biaoji.length; j++) {
        this.addcircle(j);
    }
    
    if(biaoji(this.biaoji)) {
        window.requestAnimationFrame(this.drawBall.bind(this,key))
    }
};

function biaoji(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < 1){
            return true;
        }
    }
    
    return false;
}

LinearGradient.prototype.addcircle = function(i) {
    var self = this;
    var item = JSON.parse(JSON.stringify(this.ctrlNodesArr));
    var ctrlAx = item.cAx,
        ctrlAy = item.cAy,
        ctrlBx = item.cBx,
        ctrlBy = item.cBy,
        x = item.nowX,
        y = item.nowY,
        ox = this.data.start[0],
        oy = this.data.start[1];
    
    if(this.biaoji[i] > 1) {
        self.ctx.clearRect(x - 5, y - 5, 10, 10);
    }else {
        this.biaoji[i] += this.data.speed;
        var ballX = ox * Math.pow((1 - this.biaoji[i]), 3) + 3 * ctrlAx * this.biaoji[i] * Math.pow((1 - this.biaoji[i]), 2) + 3 * ctrlBx * Math.pow(this.biaoji[i], 2) * (1 - this.biaoji[i]) + x * Math.pow(this.biaoji[i], 3);
        var ballY = oy * Math.pow((1 - this.biaoji[i]), 3) + 3 * ctrlAy * this.biaoji[i] * Math.pow((1 - this.biaoji[i]), 2) + 3 * ctrlBy * Math.pow(this.biaoji[i], 2) * (1 - this.biaoji[i]) + y * Math.pow(this.biaoji[i], 3);
        self.ctx.beginPath();
        self.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx.fill()
    }
};