import { _decorator, Component, Node, CCBoolean, Material, MeshRenderer } from 'cc';
const { ccclass, property, executeInEditMode} = _decorator;

@ccclass('SelectAble')
@executeInEditMode(true)
export class SelectAble extends Component {

    @property({
        type: Material
    })
    normalMat = null;

    @property({
        type: Material
    })
    selectMat = null;

    @property({
        type: CCBoolean
    })
    get selectState(){
        return this._selectState;
    }
    set selectState(value){
        this._selectState = value;
        this.updateSelectMaterial(value);
    }

    @property
    _selectState = false;

    updateSelectMaterial(state: boolean){
        this.node.getComponent(MeshRenderer).material = state?this.selectMat:this.normalMat;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

