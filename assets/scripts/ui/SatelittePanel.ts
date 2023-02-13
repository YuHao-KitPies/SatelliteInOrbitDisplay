import { _decorator, Component, Node, Label, CCString, EditBox, log, clamp, clamp01, toRadian, Button, CCBoolean, Input } from 'cc';
import { SatelitteManager } from '../SatelitteManager';
import { Satellite } from '../Satellite';
const { ccclass, property } = _decorator;

@ccclass('SatelittePanel')
export class SatelittePanel extends Component {

    @property({
        type: Label
    })
    displayNameLabel = null;

    @property({
        type: EditBox
    })
    semiMajorAxisInput = null;

    @property({
        type: EditBox
    })
    eccentricityInput = null;

    @property({
        type: EditBox
    })
    incilinationInput = null;

    @property({
        type: EditBox
    })
    argumentOfPeriapsisInput = null;

    @property({
        type: EditBox
    })
    longitudeOfAscendingInput = null;

    @property({
        type: EditBox
    })
    trueAnomalyInput = null;

    @property({
        type: Button
    })
    recycleBtn = null;

    @property({
        type: CCString
    })
    get displayName(){
        return this._displayName;
    }
    set displayName(value){
        this._displayName = value;
        if(this.displayNameLabel != null){
            this.displayNameLabel.string = "卫星名：" + value;
        }
    }
    @property
    _displayName = "卫星名：卫星一号";

    @property({
        type: CCBoolean
    })
    get editAble(){
        return this._editAble;
    }
    set editAble(value){
        this._editAble = value;
        if(this.recycleBtn != null){
            this.recycleBtn.interactable = value;
        }
        if(this.semiMajorAxisInput != null){
            (this.semiMajorAxisInput as EditBox).enabled = value;
        }
        if(this.eccentricityInput != null){
            (this.eccentricityInput as EditBox).enabled = value;
        }
        if(this.incilinationInput != null){
            (this.incilinationInput as EditBox).enabled = value;
        }
        if(this.argumentOfPeriapsisInput != null){
            (this.argumentOfPeriapsisInput as EditBox).enabled = value;
        }
        if(this.longitudeOfAscendingInput != null){
            (this.longitudeOfAscendingInput as EditBox).enabled = value;
        }
        if(this.trueAnomalyInput != null){
            (this.trueAnomalyInput as EditBox).enabled = value;
        }
    }

    @property
    _editAble = false;

    targetSatelitte: Satellite = null;

    recycleCallback: ()=>{} = null;

    recycelASatelitte(){
        if(this.targetSatelitte != null){
            if(this.recycleCallback!=null){
                this.recycleCallback();
            }
            let satelitteMgr = this.targetSatelitte.motherStar.getComponent(SatelitteManager);
            satelitteMgr.artificialSatelliteNum --;
            this.targetSatelitte.orbital.node.destroy();
            this.targetSatelitte.node.destroy();
        }
    }

    onSemiMajorAxisInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value = clamp(value, 20, 180);
            this.targetSatelitte.orbital.semiMajorAxis = value;
        }
    }

    onEccentricityInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value = clamp01(value);
            this.targetSatelitte.orbital.eccentricity = value;
        }
    }

    onIncilinationInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value =  clamp(value, -90, 90);
            this.targetSatelitte.orbital.inclination = toRadian(value);
        }
    }

    onArgumentOfPeriapsisInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value =  clamp(value, -180, 180);
            this.targetSatelitte.orbital.argumentOfPeriapsis = toRadian(value);
        }
    }   

    onLongitudeOfAscendingInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value =  clamp(value, -180, 180);
            this.targetSatelitte.orbital.longitudeOfAscending = toRadian(value);
        }
    }

    onTrueAnomalyInputChanged(input){
        let value = Number.parseFloat(input.string);
        if(!isNaN(value) && isFinite(value)){
            value =  clamp(value, -180, 180);
            this.targetSatelitte.orbital.startTrueAnomaly = toRadian(value);
        }
    }
}

