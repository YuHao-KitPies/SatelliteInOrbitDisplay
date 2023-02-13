import { _decorator, Component, Node, toDegree, Button, Label } from 'cc';
import { Satellite } from '../Satellite';
import { SatelittePanel } from './SatelittePanel';
import { StarPanel } from './StarPanel';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property({
        type: StarPanel
    })
    starPanel = null;

    @property({
        type: SatelittePanel
    })
    satelittePanel = null;

    @property({
        type: Button
    })
    editModeBtn = null;

    editAble = true;

    showStarPanel(name: String, satelliteNum: number, targetStar: Node) {
        this.hideAllPanel();
        if (this.starPanel != null) {
            this.starPanel.node.active = true;

            this.starPanel.displayName = name;
            this.starPanel.satelliteNum = satelliteNum;
            this.starPanel.targetStar = targetStar;
        }
    }

    showSatelittePanel(
        name: String,
        semiMajorAxis: number,
        eccentricity: number,
        inclination: number,
        argumentOfPeriapsis: number,
        longitudeOfAscendingNode: number,
        trueAnomaly: number,
        targetSatelitte: Satellite,
        recycleCallback: () => {}
    ) {
        this.hideAllPanel();
        if (this.satelittePanel != null) {
            this.satelittePanel.node.active = true;
            this.satelittePanel.displayName = name;
            this.satelittePanel.semiMajorAxisInput.placeholder = semiMajorAxis.toFixed(2);
            this.satelittePanel.eccentricityInput.placeholder = eccentricity.toFixed(2);
            this.satelittePanel.incilinationInput.placeholder = toDegree(inclination).toFixed(2);
            this.satelittePanel.argumentOfPeriapsisInput.placeholder = toDegree(argumentOfPeriapsis).toFixed(2);
            this.satelittePanel.longitudeOfAscendingInput.placeholder = toDegree(longitudeOfAscendingNode).toFixed(2);
            this.satelittePanel.trueAnomalyInput.placeholder = toDegree(trueAnomaly).toFixed(2);

            this.satelittePanel.targetSatelitte = targetSatelitte;
            this.satelittePanel.recycleCallback = recycleCallback;
        }
    }

    hideAllPanel() {
        if (this.starPanel != null) {
            this.starPanel.node.active = false;
        }
        if (this.satelittePanel != null) {
            this.satelittePanel.node.active = false;
        }
    }

    onEditModeChanged(){
        this.editAble = !this.editAble;
        (this.editModeBtn.node as Node).getChildByName("Label").getComponent(Label).string = this.editAble?"编辑模式":"展示模式";
        (this.starPanel as StarPanel).editAble = this.editAble;
        (this.satelittePanel as SatelittePanel).editAble = this.editAble;
    }
}

