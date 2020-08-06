class ElementWrapper {
    root: any;
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            console.log(RegExp.$1);
        }
        this.root.setAttribute(name, value);
    }

    appendChild(vChild) {
        vChild.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class TextWrapper {
    root: any;
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

export abstract class Component {
    children: any[]
    props: Object;
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    abstract render()

    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }
    mountTo(parent){
        let vdom = this.render();
        vdom.mountTo(parent);
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }
}

export let ToyReact = {
    createElement(type: any, attributes: any, ...children: any[]){
        let element: any;
        if (typeof type === "string") {
            element = new ElementWrapper(type);
        } else {
            element = new type;
        }
        
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        let insertChildren = (children) => {

            for (let child of children) {

                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child);
                }
                else {
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWrapper)
                        && !(child instanceof TextWrapper)) {
                        child = String(child);
                    }
                    if (typeof child === "string") {
                        child = new TextWrapper(child); 
                    }
                    element.appendChild(child);
                }
                
            }
        }
        insertChildren(children);

        return element;
    },

    render(vdom, element) {
        vdom.mountTo(element);
    },
    name: "Heather"
}