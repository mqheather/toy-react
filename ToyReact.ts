class ElementWrapper {
    root: any;
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        // \s\S represent all string
        if(name.match(/^on([\s\S]+)$/)) {
            let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLocaleLowerCase());
            this.root.addEventListener(eventName, value);
        }

        if (name === "className") {
            name = "class";
        }
        this.root.setAttribute(name, value);
    }

    appendChild(vChild) {

        let range = document.createRange();
        if (this.root.children.length){
            range.setStartAfter(this.root.lastChild);
            range.setEndAfter(this.root.lastChild);
        }
        else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        
        vChild.mountTo(range);
    }

    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    root: any;
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export abstract class Component {
    children: any[]
    props: Object;
    state: any;
    range: any;
    constructor(props) {
        this.children = [];
        if (typeof props === "object") {

        }
        else {
            this.props = Object.create(null);
        }
    }
    abstract render()

    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }
    mountTo(range){
        this.range = range;
        this.update();
    }

    update() {
        this.range.deleteContents();
        let vdom = this.render();
        vdom.mountTo(this.range);
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }

    setState(state) {
        let merge = (oldState, newState) => {
            for (let key of Object.keys(newState))  {
                if (typeof newState[key] === "object") {
                    if (typeof oldState[key] !== "object") {
                        oldState[key] = {}
                    }
                    merge(oldState[key], newState[key]);
                }
                else {
                    oldState[key] = newState[key];
                }
            }
        }
        if (!this.state && state){
            this.state = {};
        }
        merge(this.state, state);
        this.update();
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
        let range = document.createRange();
        if (element.children.length){
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        }
        else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        
        vdom.mountTo(range);
    },
    name: "Heather"
}