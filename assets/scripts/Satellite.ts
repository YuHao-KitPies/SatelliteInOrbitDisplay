import { _decorator, Component, Node, Vec3, v3 } from 'cc';
import { Orbital } from './Orbital';
const { ccclass, property } = _decorator;

@ccclass('Satellite')
export class Satellite extends Component {

    @property({
        type: Vec3
    })
    frontVector = v3(1, 0, 0);

    displayName: string = "";

    orbital:Orbital = null;

    motherStar: Node = null;
}

