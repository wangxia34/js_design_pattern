
function CreateLine(x1, y1, x2, y2, dom) {
    if (!(this instanceof CreateLine)) {
        return new CreateLine(x1, y1, x2, y2, dom);
    }
    this.pdom = dom;
    this.init(x1, y1, x2, y2);
}

$.extend(CreateLine, {
   
    lineStyle: {
        html: 'div',
        style: {
            "position": 'absolute',
            "borderBottom": '2px solid #ccc',
            "left": '0px',
            "top": '0px',
            "width": '0px',
            "transform-origin": "0% 50%",
            "transform": " "
        }
    },
    
    prototype: {
        init: function (x1, y1, x2, y2) {
    
            this.line = CreateLine.lineStyle;
    
            this.clientX = [x1, x2];       //绘制坐标
    
            this.clientY = [y1, y2];
            
            this.createBody();
        },
        sheZhiXianChang: function () {
    
            var a = this.clientX[1] - this.clientX[0];
            var b = this.clientY[1] - this.clientY[0];
    
            var c = Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2));
            this.line.style.width = c + 'px';
    
        },
        sheZhiShangPingYiWei: function () {
            this.line.style.top = this.clientY[0] + 'px';
        },
        sheZhiZuoPingYiWei: function () {
            this.line.style.left =  this.clientX[0] + 'px';
        },
        shezhijiaodu: function () {
            var a = this.clientX[1] - this.clientX[0];
            var b = this.clientY[1] - this.clientY[0];
    
            var jiaodu = Math.atan2(b, a);
    
            var x = 180*jiaodu/Math.PI;
    
            this.line.style.transform = "rotate(" + x + "deg)";
            // console.log(this.clientX);
            // console.log(this.clientY);
            // console.log(jiaodu);
        },
    
        createBody: function() {    //绘制图形
            var xian = document.createElement(this.line.html);  //创建标签
            for(key in this.line.style){ //设置样式
                switch( key ){
                    case 'width' :
                        this.sheZhiXianChang();
                        break;
                    case 'top'  :
                        this.sheZhiShangPingYiWei();
                        break;
                    case 'left' :
                        this.sheZhiZuoPingYiWei();
                        break;
                    case 'transform' :
                        this.shezhijiaodu();
                        break;
                    default :
                        break;
                }
                xian.style[key] = this.line.style[key];
            }
            console.log(document.getElementById(this.pdom));
            document.getElementById(this.pdom).appendChild(xian); //向节点追加标签
        }
    }
    
});

function CreateAttack(x1, y1, x2, y2, dom) {
    if (!(this instanceof CreateAttack)) {
        return new CreateAttack(x1, y1, x2, y2, dom);
    }
    
    this.pdom = dom;
    this.clientX = [x1, x2];       //绘制坐标
    this.clientY = [y1, y2];
    
    this.init(x1, y1, x2, y2);
}

$.extend(CreateAttack, {
    
    circleStyle: {
        html: 'div',
        class: "attack-circle",
        style: {
            "left": '0px',
            "top": '0px'
        }
    },
    
    prototype: {
        init: function (x1, y1, x2, y2) {
            
            this.circle = CreateAttack.circleStyle;
            
            this.createBody();
        },
        
        createBody: function () {
            var circle = document.createElement(this.circle.html);  //创建标签
            for(key in this.circle.style){ //设置样式
                switch( key ){
                    case 'top'  :
                        this.circle.style.top = this.clientY[0] + 'px';
                        break;
                    case 'left' :
                        this.circle.style.left =  this.clientX[0] + 'px';
                        break;
                    default :
                        break;
                }
                circle.style[key] = this.circle.style[key];
            }
            circle.className = this.circle.class;
            this.mdom = circle;
            document.getElementById(this.pdom).appendChild(this.mdom); //向节点追加标签
        },
        
        animate: function (speed, easing) {
            $(this.mdom).animate({
                top: this.clientY[1] + 'px',
                left: this.clientX[1] + 'px'
            }, speed, easing, function () {
                this.remove()
            });
        }
    }
});

