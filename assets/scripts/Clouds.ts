import { _decorator, Component, CCFloat, Vec3, find } from 'cc';
import { TimeScale } from './TimeScale';
import { MathUtils } from './utils/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('Clouds')
export class Clouds extends Component {

    // 云层旋转角速度，单位rad/s
    private static readonly ANGULAR_VELOCITY = 2 * Math.PI / (36 * 60 * 60);
    angularVelocity = Clouds.ANGULAR_VELOCITY;

    earthNode: Node;
    timeScale = TimeScale.DEFAULT_TIME_SCALE;

    start() {
        this.timeScale = find("EarthMoonSystem")?.getComponent(TimeScale)?.timeScale??TimeScale.DEFAULT_TIME_SCALE;
        this.angularVelocity = Clouds.ANGULAR_VELOCITY * this.timeScale;
    }

    update(deltaTime: number) {
        //云层运动
        MathUtils.rotateNodeByAxis(this.node, Vec3.UP, this.angularVelocity * deltaTime);
    }
}

