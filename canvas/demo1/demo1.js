
//线条
var XianTiao = {
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
};

//画线人
var Ren = function(){
    
    this.huiZhiZhiXian = function(){
        
        var xianTiao = XianTiao;   //掺元
        
        var clientX = [0,0];       //绘制坐标
        
        var clientY = [0,0];
        
        var mousedownFlat = mouseoverFlat =  false;
        
        function huoQuQiShiZhi(_event){    //获取起起始值
            
            mousedownFlat = true;
            
            clientX[0] = _event.clientX;
            
            clientY[0] = _event.clientY;
            
        }
        
        function huoQuJieShuZhi(_event){    //获取结束值
            
            if( mousedownFlat ){
                
                mouseoverFlat = true;
                
                clientX[1] = _event.clientX;
                
                clientY[1] = _event.clientY;
                
            }
            
        }
        
        function sheZhiShangPingYiWei(_event){  //设置上平移位
            
            xianTiao.style.top = clientY[0]+'px';
            
        }
        
        function sheZhiXianChang(){ // 设置线长和角度
            
            var a = clientX[1] - clientX[0];
            var b = clientY[1] - clientY[0];
            
            var c = Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2));
            xianTiao.style.width = c + 'px';
            
            
        }
        
        function shezhijiaodu() { // 设置角度
            var a = clientX[1] - clientX[0];
            var b = clientY[1] - clientY[0];
            
            var jiaodu = Math.atan2(b, a);
    
            var x = 180*jiaodu/Math.PI;
            
            xianTiao.style.transform = "rotate(" + x + "deg)";
           
        }
        
        function sheZhiZuoPingYiWei(){ //设置左平移位
            
            xianTiao.style.left  =  clientX[0];
            
            xianTiao.style.left += 'px';
            
        }
        
        function huiZhiTuXing(){    //绘制图形
            
            if( mouseoverFlat ){
                
                var xian = document.createElement(xianTiao.html);  //创建标签
                
                for(key in xianTiao.style){ //设置样式
                    
                    switch( key ){
                        
                        case 'width' :
                            
                            sheZhiXianChang();
                            
                            break;
                        
                        case 'top'  :
                            
                            sheZhiShangPingYiWei();
                            
                            break;
                        
                        case 'left' :
                            
                            sheZhiZuoPingYiWei();
                            
                            break;
                            
                        case 'transform' :
                            
                            shezhijiaodu();
                            
                            break;
                        
                        default :
                            
                            break;
                        
                    }
                    
                    xian.style[key] = xianTiao.style[key];
                    
                }
                
                console.log(xian);
                
                document.body.appendChild(xian); //向节点追加标签
                
                mousedownFlat = mouseoverFlat =  false
                
            }
            
        }
        
        //点击  获取起始值
        
        document.body.addEventListener('mousedown', huoQuQiShiZhi , false);
        
        //拖动  获取结束值
        
        document.body.addEventListener('mousemove', huoQuJieShuZhi , false);
        
        //松开  绘制图形
        
        document.body.addEventListener('mouseup', huiZhiTuXing , false);
        
    }
    
};