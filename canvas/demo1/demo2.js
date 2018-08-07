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