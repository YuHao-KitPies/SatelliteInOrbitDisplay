import { _decorator, Component, Node, CCFloat, clamp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GravityCoefficient')
export class GravityCoefficient extends Component {
    
    @property({
        type: CCFloat,
        range: [0.1, 10, 0.01],
        slide: true
    })
    get gravityCoefficient(){
        return this._gravityCoefficient;
    }
    set gravityCoefficient(value){
        this._gravityCoefficient = clamp(value??0.5, 0.1, 10);
    }
    @property
    private _gravityCoefficient = 0.5;
}

