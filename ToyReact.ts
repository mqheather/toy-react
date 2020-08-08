let childrenSymbol = Symbol("children");
class ElementWrapper {
    root: any;
    type: string;
    props: Object;
    range: any;
    children: any[];
    constructor(type) {
        this.type = type;
        this.props = Object.create(null);
        this.children = [];
    }
    setAttribute(name, value) {
        
        //this.root.setAttribute(name, value);
        this.props[name] = value;
    }

    appendChild(vChild) {
        this.children.push(vChild.vdom);
    }


    get vdom() {
        return this;
    }

    mountTo(range) {
        this.range = range;
        
        let placeholder = document.createComment("placeholder");
        let endRange = document.createRange();
        endRange.setStart(range.endContainer, range.endOffset);
        endRange.setEnd(range.endContainer, range.endOffset);
        endRange.insertNode(placeholder);

        range.deleteContents();
        let element = document.createElement(this.type);
        for (let key in this.props) {
            let value = this.props[key];
            // \s\S represent all string
            if(key.match(/^on([\s\S]+)$/)) {
                let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLocaleLowerCase());
                element.addEventListener(eventName, value);
            }

            if (key === "className") {
                key = "class";
            }

            element.setAttribute(key, value);
        }

        for (const child of this.children) {
            let range = document.createRange();
            if (element.children.length){
                range.setStartAfter(element.lastChild);
                range.setEndAfter(element.lastChild);
            }
            else {
                range.setStart(element, 0);
                range.setEnd(element, 0);
            }
            
            child.mountTo(range);
        }

        range.insertNode(element);
    }
}

class TextWrapper {
    root: any;
    type: string;
    props: Object;
    children: any[];
    range: any;
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = "#type";
        this.children = [];
        this.props = Object.create(null);
    }
    mountTo(range) {
        this.range = range;
        range.deleteContents();
        range.insertNode(this.root);
    }
    get vdom() {
       return this;
    }
}

export abstract class Component {
    children: any[]
    props: Object;
    state: any;
    range: any;
    private oldVdom: any;

    get type() {
        return this.constructor.name;
    }
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
        let vdom = this.vdom;
        if (this.oldVdom){
            let isSameNode = (node1, node2) => {
                if (node1.type !== node2.type){
                    return false;
                }
                if (Object.keys(node1.props).length != Object.keys(node2.props).length){
                    return false;
                }

                for (let name of Object.keys(node1.props)) {
                    // if (typeof node1.props[name] === "function"
                    // && typeof node2.props[name] === "function"
                    // && node1.props[name].toString() === node2.props[name].toString()) {
                    //     continue;
                    // }

                    if (typeof node1.props[name] === "object"
                    && typeof node2.props[name] === "object"
                    && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])) { 
                        continue; 
                    }

                    if (node1.props[name] !== node2.props[name]) {
                        return false;
                    }
                }
                
                return true;
            }

            let isSameTree = (node1, node2) => {
                if (!isSameNode(node1, node2)){
                    return false;
                }

                if (node1.children.length != node2.children.length) {
                    return false;
                }

                for (let i = 0; i < node1.children.length; i++) {
                    if (!isSameTree(node1.children[i], node2.children[i])) {
                        return false;
                    }
                }
                return true;
            }

            let replace = (newTree, oldTree) => {
                if (isSameTree(newTree, oldTree)){
                    return;
                }

                if (!isSameNode(newTree, oldTree)){
                    newTree.mountTo(oldTree.range);
                }
                else {
                    let oldLength = oldTree.children.length;
                    let newLength = newTree.children.length; 
                    let length = oldLength > newLength ? newLength : oldLength;
                    for (let i = 0; i < length; i++) {
                        replace(newTree.children[i], oldTree.children[i]);   
                    }
                }
            }
            replace(vdom, this.oldVdom);
        }
        else {
            vdom.mountTo(this.range);
        }
        
        this.oldVdom = vdom;
    }

    get vdom() {
        return this.render().vdom;
    }

    appendChild(vChild) {
        this.children.push(vChild);
    }

    setState(state) {
        let merge = (oldState, newState) => {
            for (let key of Object.keys(newState))  {
                if (typeof newState[key] === "object" && newState[key] != null) {
                    if (typeof oldState[key] !== "object") {
                        if (newState[key] instanceof Array) {
                            oldState[key] = [];
                        }
                        else{
                            oldState[key] = {};
                        }
                        
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

                if (child === null || child == void 0){
                    child = "";
                }

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