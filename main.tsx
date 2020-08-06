import {ToyReact, Component} from './ToyReact'

class MyComponent extends Component {
    render() {
        return <div>
                <span>Hello</span>
                <span>World!</span>
                <div>{this.children}</div>
               </div>
    }
}

let a = <MyComponent name="a" id="labelname">
           <div>123</div>
        </MyComponent>
console.log(a);
ToyReact.render(a, document.body);
console.log(ToyReact.name);
console.log(ToyReact.createElement('span', {name: "Heather"}))