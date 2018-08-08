
function LinearGradient(option) {
    this.ctrlDrawIndex = 0;
    
    this.canvas = document.getElementById(option.canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.data = option.data;
    
    this.draw();
    
    this.biaoji = {};
}

LinearGradient.prototype.draw = function () {
    
    for(var i = 0; i < this.data.length; i++){
    
        this.ctx.beginPath();
        
        this.ctx.moveTo(this.data[i].start[0], this.data[i].start[1]);
        // 曲线
        this.ctx.bezierCurveTo(this.data[i].ctrlA[0], this.data[i].ctrlA[1] , this.data[i].ctrlB[0] , this.data[i].ctrlB[1], this.data[i].end[0], this.data[i].end[1]);
    
        this.ctx.stroke();
    }
};

LinearGradient.prototype.drawBall = function(id, cj) {
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    var circlei = /id/.test(id) ? id : 'id' + id;
    
    if(this.biaoji[circlei] === undefined){
        this.biaoji[circlei] = [];
    }
    
    var circlej = cj ? cj : this.biaoji[circlei].length;
    
    if(this.biaoji[circlei][circlej] === undefined){
        this.biaoji[circlei][circlej] = 0;
    }
    
    this.draw();
    
    for (var j = 0; j < this.biaoji[circlei].length; j++) {
        this.addcircle(circlei, j);
    }
    
    if(this.isbiaoji(this.biaoji)) {
        window.requestAnimationFrame(this.drawBall.bind(this, circlei, circlej))
    }
};

LinearGradient.prototype.isbiaoji = function(obj) {
    for (var key in obj) {
        for (var i = 0; i < obj[key].length; i++) {
            if (obj[key][i] < 1){
                return true;
            }
        }
    }
    return false;
};

LinearGradient.prototype.getItem = function(id){
    for (var i = 0; i < this.data.length; i++) {
        var ci = 'id' + this.data[i].id;
        if (ci === id) {
            return this.data[i];
        }
    }
};

LinearGradient.prototype.addcircle = function(ci,cj) {
    var self = this;
    var item = this.getItem(ci);
    var ctrlAx = item.ctrlA[0],
        ctrlAy = item.ctrlA[1],
        ctrlBx = item.ctrlB[0],
        ctrlBy = item.ctrlB[1],
        x = item.end[0],
        y = item.end[1],
        ox = item.start[0],
        oy = item.start[1];
    
    if(this.biaoji[ci][cj] > 1) {
        self.ctx.clearRect(x - 5, y - 5, 10, 10);
    }else {
        this.biaoji[ci][cj] += item.speed;
        var t = this.biaoji[ci][cj];
        var ballX = ox * Math.pow((1 - t), 3) + 3 * ctrlAx * t * Math.pow((1 - t), 2) + 3 * ctrlBx * Math.pow(t, 2) * (1 - t) + x * Math.pow(t, 3);
        var ballY = oy * Math.pow((1 - t), 3) + 3 * ctrlAy * t * Math.pow((1 - t), 2) + 3 * ctrlBy * Math.pow(t, 2) * (1 - t) + y * Math.pow(t, 3);
        self.ctx.beginPath();
        self.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx.fill()
    }
};