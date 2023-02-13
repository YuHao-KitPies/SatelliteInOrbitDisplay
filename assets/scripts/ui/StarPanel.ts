import { _decorator, Component, Node, CCString, Label, Prefab, instantiate, random, randomRange, log, CCBoolean, Button } from 'cc';
import { Orbital } from '../Orbital';
import { SatelitteManager } from '../SatelitteManager';
import { Satellite } from '../Satellite';
import { TheStar } from '../TheStar';
const { ccclass, property } = _decorator;

@ccclass('StarPanel')
export class StarPanel extends Component {

    @property({
        type: Label
    })
    displayNameLabel = null;

    @property({
        type: Label
    })
    satelliteNumLabel = null;

    @property({
        type: Button
    })
    addSatelliteBtn = null;

    @property({
        type: CCString
    })
    get displayName(){
        return this._displayName;
    }
    set displayName(value){
        this._displayName = value;
        if(this.displayNameLabel != null){
            this.displayNameLabel.string = "星球名：" + value;
        }
    }
    @property 
    _displayName;

    @property({
        type: CCString
    })
    get satelliteNum(){
        return this._satelliteNum;
    }
    set satelliteNum(value){
        this._satelliteNum = value;
        if(this.satelliteNumLabel != null){
            this.satelliteNumLabel.string = "卫星个数：" + value;
        }
    }
    @property 
    _satelliteNum;

    @property({
        type: CCBoolean
    })
    get editAble(){
        return this._editAble;
    }
    set editAble(value){
        this._editAble = value;
        if(this.addSatelliteBtn != null){
            this.addSatelliteBtn.interactable = value;
        }
    }

    @property
    _editAble = false;

    @property({
        type: Prefab
    })
    satelittePrefab = null;

    @property({
        type: Prefab
    })
    orbitalPrefab = null;

    targetStar = null;

    addASatellite(){
        if(this.targetStar != null){
            let satellite = instantiate(this.satelittePrefab);
            let orbital = instantiate(this.orbitalPrefab);
            let orbitalCom = orbital.getComponent(Orbital);
            orbitalCom.motherStar = this.targetStar;
            orbitalCom.satelliteNode = satellite;

            let satelitteMgr = this.targetStar.getComponent(SatelitteManager);
            let starCom = this.targetStar.getComponent(TheStar);
            satelitteMgr.artificialSatelliteNum ++;
            this.satelliteNum = satelitteMgr.artificialSatelliteNum;

            let satelliteCom = satellite.getComponent(Satellite);
            satelliteCom.displayName = starCom.starName + "卫星" + satelitteMgr.artificialSatelliteNum +"号";
            satelliteCom.orbital = orbitalCom;
            satelliteCom.motherStar = this.targetStar;

            this.targetStar.parent.addChild(satellite);
            this.targetStar.parent.addChild(orbital);

            orbitalCom.semiMajorAxis = randomRange(30, 40);
            orbitalCom.eccentricity = randomRange(0, 0.3);
            orbitalCom.inclination = randomRange(0, Math.PI) - Math.PI / 2;
            orbitalCom.argumentOfPeriapsis = randomRange(0, 2 * Math.PI) - Math.PI;
            orbitalCom.longitudeOfAscending = randomRange(0, 2 * Math.PI) - Math.PI;
            orbitalCom.startTrueAnomaly = randomRange(0, 2 * Math.PI) - Math.PI;
        }
    }
}

