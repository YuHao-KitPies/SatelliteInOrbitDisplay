import { _decorator, Component, CCFloat, MeshRenderer, utils, Node, log, Vec3, clamp, v3, find, GraphicsComponent, v2, Quat, quat, toDegree } from 'cc';
import { GravityCoefficient } from './GravityCoefficient';
import { Satellite } from './Satellite';
import { TimeScale } from './TimeScale';
import { MathUtils } from './utils/MathUtils';
import { OrbitalMeshUtils } from './utils/OrbitalMeshUtils';
const { ccclass, executeInEditMode, property } = _decorator;

/**
 * 轨道六根数
 * semiMajorAxis 半长轴
 * eccentricity 离心率
 * inclination 轨道倾角
 * argumentOfPeriapsis 近心点辐角
 * longitudeOfAscendingNode 升交点经度
 * trueAnomaly 真近点角
 */
@ccclass('Orbital')
@executeInEditMode(true)
export class Orbital extends Component {

    private static readonly ORBITAL_SIZE = 0.1;

    @property({
        type: CCFloat,
        range: [20, 180, 0.1],
        slide: true
    })
    get semiMajorAxis(){
        return this._semiMajorAxis;
    }
    set semiMajorAxis(value){
        this._semiMajorAxis = clamp(value??20, 20, 180);
        this.resetOrbitalMesh();
    }
    @property
    private _semiMajorAxis = 20;

    //短半轴
    private semiMinorAxis = 0;

    @property({
        type: CCFloat,
        range: [0.0, 0.99, 0.01],
        slide: true
    })
    get eccentricity(){
        return this._eccentricity;
    }
    set eccentricity(value){
        this._eccentricity = clamp(value??0.0, 0.0, 0.99);
        this.resetOrbitalMesh();
    }
    @property
    private _eccentricity = 0.0;

    @property({
        type: CCFloat,
        range: [- Math.PI / 2, Math.PI / 2, 0.01],
        slide: true
    })
    get inclination(){
        return this._inclination;
    }
    set inclination(value){
        this._inclination = clamp(value??0.0, - Math.PI / 2, Math.PI / 2);
        this.resetRotation();
    }
    @property
    private _inclination = 0;

    @property({
        type: CCFloat,
        range: [- Math.PI, Math.PI, 0.01],
        slide: true
    })
    get argumentOfPeriapsis(){
        return this._argumentOfPeriapsis;
    }
    set argumentOfPeriapsis(value){
        this._argumentOfPeriapsis = clamp(value??0.0, - Math.PI, Math.PI);
        this.resetRotation();
    }
    @property
    private _argumentOfPeriapsis = 0;

    @property({
        type: CCFloat,
        range: [- Math.PI, Math.PI, 0.01],
        slide: true
    })
    get longitudeOfAscending(){
        return this._longitudeOfAscending;
    }
    set longitudeOfAscending(value){
        this._longitudeOfAscending = clamp(value??0.0, - Math.PI, Math.PI);
        this.resetRotation();
    }
    @property
    private _longitudeOfAscending = 0;

    @property({
        type: CCFloat,
        range: [- Math.PI, Math.PI, 0.01],
        slide: true
    })
    get startTrueAnomaly(){
        return this._startTrueAnomaly;
    }
    set startTrueAnomaly(value){
        this._startTrueAnomaly = clamp(value??0.0, - Math.PI, Math.PI);
        this.trueAnomaly = this._startTrueAnomaly;
        this.resetRotation();
    }
    @property
    private _startTrueAnomaly = 0;

    @property({
        type: CCFloat
    })
    get trueAnomaly(){
        return this._trueAnomaly;
    }
    private set trueAnomaly(value){
        this._trueAnomaly = value;
        this.calEccentricAnomaly();
    }
    @property
    private _trueAnomaly = 0;

    //偏近点角
    private eccentricAnomaly = 0;

    @property({
        type: Node,
    })
    displayNode = null;

    @property({
        type: Node,
    })
    rotationNode = null;

    @property({
        type: Node,
    })
    motherStar = null;

    @property({
        type: Node,
    })
    satelliteNode = null;

    @property
    shouldRun = true;

    timeScale = TimeScale.DEFAULT_TIME_SCALE;

    gravityCoefficient = 0.5;

    start() {
       this.resetOrbitalMesh();
       this.resetRotation();
       this.getGravityCoefficient();
       this.timeScale = find("EarthMoonSystem")?.getComponent(TimeScale)?.timeScale??TimeScale.DEFAULT_TIME_SCALE;
    }

    //跟随母星移动
    resetPosToMotherStar(){
        if(this.motherStar != null){
            this.node.position = this.motherStar.position;
        }
    }

    //获取重力系数
    getGravityCoefficient(){
        if(this.motherStar != null){
            this.gravityCoefficient = this.motherStar.getComponent(GravityCoefficient)?.gravityCoefficient??0.5;
        }
    }

    //设置卫星的位置和旋转
    resetSatellitePosAndRot(){
        if(this.satelliteNode != null && this.displayNode != null){
            let tPos = v3();
            let cPos = v3(this.semiMinorAxis * Math.sin(this.eccentricAnomaly), 0, this.semiMajorAxis * Math.cos(this.eccentricAnomaly));
            MathUtils.localPosToLocal(this.displayNode, this.satelliteNode.parent, cPos, tPos);
            this.satelliteNode.position = tPos;

            //计算轨道切向量
            let ctangentVector = v3(cPos.z > 0 ? 1 : -1, 0, 0);
            if(cPos.x != 0){
                let sign = cPos.x > 0 ? 1: -1;
                ctangentVector = v3(sign * (Math.pow(this.semiMinorAxis, 2) * cPos.z) / (Math.pow(this.semiMajorAxis, 2) * cPos.x), 0, - sign);
            } 
            
            let ttangentVector = v3();
            MathUtils.localPosToLocal(this.displayNode, this.satelliteNode.parent, ctangentVector.normalize().add(cPos), ttangentVector);

            //卫星的前方
            let frontVector = this.satelliteNode.getComponent(Satellite)?.frontVector??Vec3.UNIT_X;

            //设置卫星旋转
            let targetV =  ttangentVector.subtract(tPos).normalize();
            let tempV = v3(targetV.x, 0, targetV.z).normalize();
            let lastV = v3(Math.sqrt(targetV.x * targetV.x + targetV.z * targetV.z), targetV.y, 0).normalize();
            //在xz平面旋转
            MathUtils.rotateNodeByAxisFromZero(this.satelliteNode, Vec3.UNIT_Y, (tempV.z > 0 ? -1 : 1) * Math.acos(Vec3.dot(frontVector, tempV)));
            //旋转y轴到垂直轨道平面
            MathUtils.rotateNodeByAxis(this.satelliteNode, Vec3.UNIT_Z, (tempV.x > 0 ? -1 : 1) *Math.acos(Vec3.dot(Vec3.UNIT_X, lastV)));
        }
    }

    //计算半焦距
    calHalfFocalLength(){
        return this.semiMajorAxis * this.eccentricity;
    }

    //计算短半轴
    calSemiMinorAxis(){
        this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity);
    } 

    //计算偏近点角
    calEccentricAnomaly(){
        let ecaValue = Math.sqrt((1 - this.eccentricity)/(1 + this.eccentricity)) * Math.tan(this.trueAnomaly / 2);
        this.eccentricAnomaly =  2 * Math.atan(ecaValue) % (Math.PI * 2);
    }

    //计算变化角
    calDeltaAngular(deltaTime){
        let r = v3(this.semiMinorAxis * Math.sin(this.eccentricAnomaly), 0, this.semiMajorAxis * Math.cos(this.eccentricAnomaly)).length();
        let velocity = Math.sqrt(this.gravityCoefficient * (2.0 / r) - 1 / this.semiMajorAxis);
        return Math.atan((deltaTime * velocity) / r);
    }

    resetOrbitalMesh() {
        let opt = OrbitalMeshUtils.genEllipseOrbitalMeshOpt(this.semiMajorAxis??20, this.eccentricity??0.0, Orbital.ORBITAL_SIZE, {tubularSegments: 48});
        this.displayNode.getComponent(MeshRenderer).mesh = utils.MeshUtils.createMesh(opt);
        this.displayNode.position.z = this.calHalfFocalLength();
        this.calSemiMinorAxis();
        this.resetPosToMotherStar();
        this.resetSatellitePosAndRot();
    }

    resetRotation(){
        MathUtils.rotateNodeByAxisFromZero(this.rotationNode, Vec3.UNIT_Y, this.argumentOfPeriapsis);
        MathUtils.rotateNodeByAxis(this.rotationNode, Vec3.FORWARD, this.inclination);
        MathUtils.rotateNodeByAxis(this.rotationNode, Vec3.UNIT_Y, this.longitudeOfAscending);
        this.resetPosToMotherStar();
        this.resetSatellitePosAndRot();
    }

    update(deltaTime: number) {
        if(this.shouldRun){
            this.trueAnomaly += this.calDeltaAngular(this.timeScale * deltaTime); 
            this.trueAnomaly %= (Math.PI * 2);
            this.resetPosToMotherStar();
            this.resetSatellitePosAndRot();
        }
    }
}

