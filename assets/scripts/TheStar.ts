import { _decorator, Component, Node, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TheStar')
export class TheStar extends Component {
    
    @property({
        type: CCString
    })
    starName;
}

