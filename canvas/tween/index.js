var position;
var target;
var tween, tweenBack;

init();
animate();

function init() {
    
    position = {x: 100, y: 100, rotation: 0};
    target = document.getElementById('target');
    tween = new TWEEN.Tween(position)
        .to({x: 700, y: 200, rotation: 359}, 2000)
        .delay(1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(update);
    
    tweenBack = new TWEEN.Tween(position)
        .to({x: 100, y: 100, rotation: 0}, 3000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(update);
    
    tween.chain(tweenBack);
    tweenBack.chain(tween);
    
    tween.start();
    
}

function animate( time ) {
    
    requestAnimationFrame( animate );
    
    TWEEN.update( time );
    
}

function update() {
    
    target.style.webkitTransform = 'translate('+position.x+ 'px'+','+ position.y + 'px' +')' + 'rotate(' + Math.floor(position.rotation) + 'deg)';
    // target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
    // target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
    
}

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());