
// new Element({tagName, props, children}) 创建dom

function Element({tagName, props, children}){
    if(!(this instanceof Element)){
        return new Element({tagName, props, children})
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
}

Element.prototype.render = function(){
    let el = document.createElement(this.tagName),
        props = this.props,
        propName,
        propValue;
    for(propName in props){
        propValue = props[propName];
        el.setAttribute(propName, propValue);
    }
    this.children.forEach(function(child){
        let childEl = null;
        if(child instanceof Element){
            childEl = child.render();
        }else if(typeof child === 'object'){
            child = new Element(child);
            childEl = child.render();
        }else{
            childEl = document.createTextNode(child);
        }
        el.appendChild(childEl);
    });
    return el;
};
