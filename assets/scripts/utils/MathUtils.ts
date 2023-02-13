import { Vec3, quat, Quat, Node, log, v3, mat4, Mat4 } from "cc";

export class  MathUtils {
    /**
     * 节点绕自身指定轴再旋转指定弧度
     * @param node 需要旋转的节点
     * @param axis 旋转轴
     * @param angle 旋转的弧度
     */
    static rotateNodeByAxis(node: Node, axis: Vec3, angle: number){
        let rotation = quat();
        Quat.rotateAroundLocal(rotation, node.rotation, axis, angle);
        node.rotation = rotation;
    }

    /**
     * 节点绕自身指定轴从零开始旋转指定弧度
     * @param node 需要旋转的节点
     * @param axis 旋转轴
     * @param angle 旋转的弧度
     */
    static rotateNodeByAxisFromZero(node: Node, axis: Vec3, angle: number){
        let rotation = quat();
        let intRot = quat();
        Quat.rotateAroundLocal(rotation, intRot, axis, angle);
        node.rotation = rotation;
    }

    /**
     * 把当前节点坐标系中的坐标转到目标节点坐标系中
     * @param from 当前节点
     * @param to 目标节点
     * @param pos 当前节点位置
     * @param out 目标节点位置
     * @returns 返回值
     */
    static localPosToLocal(from: Node, to: Node, pos: Vec3, out: Vec3){
        const tempMat4 = mat4();
        const toNodeWorldMat4 = to.getWorldMatrix();
        const fromNodeWorldMat4 = from.getWorldMatrix();
        Mat4.invert(tempMat4, toNodeWorldMat4);
        let temp = v3();
        Vec3.transformMat4(temp, pos, fromNodeWorldMat4);
        Vec3.transformMat4(out, temp, tempMat4);
        return out;
    }
}