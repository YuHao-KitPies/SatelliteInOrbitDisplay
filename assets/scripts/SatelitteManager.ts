import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SatelitteManager')
export class SatelitteManager extends Component {
    
    @property({
        type: CCInteger
    })
    defaultSatelitteNum = 0;

    @property({
        type: CCInteger
    })
    artificialSatelliteNum = 0;

    @property({
        type: CCInteger
    })
    get totalSatelliteNum(){
        return this.defaultSatelitteNum + this.artificialSatelliteNum;
    }
}

