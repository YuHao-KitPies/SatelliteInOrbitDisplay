import { _decorator, Component, CCFloat, Vec3, Node, find, CCString } from 'cc';
import { TheStar } from './TheStar';
import { TimeScale } from './TimeScale';
import { MathUtils } from './utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('TheMoon')
export class TheMoon extends TheStar {

    // 月球旋转角速度，单位rad/s
    private static readonly ANGULAR_VELOCITY = 2 * Math.PI / (27.32 * 24 * 60 * 60);
    angularVelocity = TheMoon.ANGULAR_VELOCITY;

    moonNode: Node;
    timeScale = TimeScale.DEFAULT_TIME_SCALE;

    start() {
        this.moonNode = this.node.getChildByName("Moon");
        this.timeScale = find("EarthMoonSystem")?.getComponent(TimeScale)?.timeScale??TimeScale.DEFAULT_TIME_SCALE;
        this.angularVelocity = TheMoon.ANGULAR_VELOCITY * this.timeScale;
    }

    update(deltaTime: number) {
         //月球自转
         MathUtils.rotateNodeByAxis(this.moonNode, Vec3.UP, this.angularVelocity * deltaTime);
    }
}

