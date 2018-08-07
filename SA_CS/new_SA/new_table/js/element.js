
// new Element({tagName, props, children}) 创建dom
let isDOM = (typeof HTMLElement === "object") ?
    function(obj) {
        return obj instanceof HTMLElement;
    } :
    function(obj) {
        return obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string";
    };

function Element({tagName, props, children}) {
    if (!(this instanceof Element)) {
        return new Element({tagName, props, children});
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
}

Element.prototype.render = function() {
    let el = document.createElement(this.tagName),
        props = this.props,
        propName,
        propValue;
    for (propName in props) {
        propValue = props[propName];
        el.setAttribute(propName, propValue);
    }
    
    this.children.forEach(function(child) {
        let childEl = null;
        if (isDOM(child)) {
            childEl = child;
        } else if (child instanceof Element) {
            childEl = child.render();
        } else if (typeof child === "object") {
            child = new Element(child);
            childEl = child.render();
        } else {
            childEl = document.createTextNode(child);
        }
        el.appendChild(childEl);
    });
    return el;
};
