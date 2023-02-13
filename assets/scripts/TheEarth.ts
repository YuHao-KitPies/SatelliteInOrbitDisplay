import { _decorator, Node, CCFloat, Vec3, Component, utils, Root, find, CCString } from 'cc';
import { TheStar } from './TheStar';
import { TimeScale } from './TimeScale';
import { MathUtils } from './utils/MathUtils';
const { ccclass, property } = _decorator;


@ccclass('TheEarth')
export class TheEarth extends TheStar {

    // 地球旋转角速度，单位rad/s
    private static readonly ANGULAR_VELOCITY = 2 * Math.PI / (24 * 60 * 60);

    angularVelocity = TheEarth.ANGULAR_VELOCITY;

    earthNode: Node;
    timeScale = TimeScale.DEFAULT_TIME_SCALE;

    start() {
        this.earthNode = this.node.getChildByName("Earth");
        this.timeScale = find("EarthMoonSystem")?.getComponent(TimeScale)?.timeScale??TimeScale.DEFAULT_TIME_SCALE;
        this.angularVelocity = TheEarth.ANGULAR_VELOCITY * this.timeScale;
    }

    update(deltaTime: number) {
        //地球自转
        MathUtils.rotateNodeByAxis(this.earthNode, Vec3.UP, this.angularVelocity * deltaTime);
    }
}

