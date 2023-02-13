import { _decorator, Component, Node, Camera, input, Input, EventTouch, geometry, PhysicsSystem, log } from 'cc';
import { SatelitteManager } from './SatelitteManager';
import { Satellite } from './Satellite';
import { SelectAble } from './SelectAble';
import { TheStar } from './TheStar';
import { UIManager } from './ui/UIManager';
const { ccclass, property } = _decorator;

@ccclass('Pick')
export class Pick extends Component {

    @property({
        type: Camera
    })
    camera = null;

    @property({
        type: UIManager
    })
    uiManager = null;

    selectCom: SelectAble = null;

    onLoad () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onDestroy () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {

        let pos = event.getLocation();
        // 获得一条途径屏幕坐标（0，0）发射出的一条射线
        const outRay = new geometry.Ray();
        let ray = this.camera?.screenPointToRay(pos.x, pos.y, outRay);

        // 以下参数可选
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;

        if (ray && PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint
            const hitNormal = raycastClosestResult.hitNormal;
            const collider = raycastClosestResult.collider;
            const distance = raycastClosestResult.distance;  

            let seletAble = collider.getComponent(SelectAble);
            this.selectAObj(seletAble);

            if(!this.selectAStar(seletAble)){
                this.selectASatelitte(seletAble);
            }
        } else {
           this.cancelCurrentSelect();
        }
    }

    cancelCurrentSelect(){
        if(this.selectCom != null){
            this.selectCom.selectState = false;
            this.selectCom = null;
        }
        this.uiManager.hideAllPanel();
    }

    selectAObj(seletAble){
        this.cancelCurrentSelect();
        if(seletAble != null){
            seletAble.selectState = !seletAble.selectState;
            this.selectCom = seletAble;
        }
    }

    selectAStar(seletAble){
        if(seletAble == null){
            return false;
        }
        let target = seletAble.node.parent.getComponent(TheStar);
        let satelitteMgr = seletAble.node.parent.getComponent(SatelitteManager);
        if(target != null && satelitteMgr != null){
            this.uiManager.showStarPanel(target.starName, satelitteMgr.totalSatelliteNum, target.node);
            return true;
        }
    }

    selectASatelitte(seletAble){
        if(seletAble == null){
            return;
        }
        let target = seletAble.node.parent.getComponent(Satellite);
        if(target != null){
            let orbital = target.orbital;
            this.uiManager.showSatelittePanel(
                target.displayName, 
                orbital.semiMajorAxis,
                orbital.eccentricity,
                orbital.inclination,
                orbital.argumentOfPeriapsis,
                orbital.longitudeOfAscending,
                orbital.startTrueAnomaly,
                target,
                this.cancelCurrentSelect.bind(this)
                );
        }
    }
}

