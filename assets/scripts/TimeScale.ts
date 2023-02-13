import { _decorator, Component, Node, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeScale')
export class TimeScale extends Component {

    // 默认时间缩放值
    public static readonly DEFAULT_TIME_SCALE = 288;

    /**
     * 时间缩放系数，用于加快或放慢时间
     */
    @property({
        type: CCFloat,
        range: [0.1, 1440, 0.1]
    })
    timeScale = TimeScale.DEFAULT_TIME_SCALE;
}

