// Block.ts - 方块基类

/**
 * 方块类型枚举
 */
export enum BlockType {
    NORMAL = 'normal',     // 普通方块
    BOMB = 'bomb',         // 炸弹方块
    RAINBOW = 'rainbow',   // 彩虹方块
    LINE = 'line'          // 直线消除方块
}

/**
 * 方块颜色枚举
 */
export enum BlockColor {
    RED = 'red',
    BLUE = 'blue',
    GREEN = 'green',
    YELLOW = 'yellow',
    PURPLE = 'purple',
    CYAN = 'cyan'
}

/**
 * 方块状态枚举
 */
export enum BlockState {
    NORMAL = 'normal',     // 正常状态
    SELECTED = 'selected', // 选中状态
    ELIMINATING = 'eliminating', // 消除中
    FALLING = 'falling'    // 下落中
}

/**
 * 方块位置接口
 */
export interface BlockPosition {
    row: number;
    col: number;
}

/**
 * 方块基类
 */
export class Block {
    private _id: string;
    private _type: BlockType;
    private _color: BlockColor;
    private _position: BlockPosition;
    private _state: BlockState;
    
    /**
     * 构造函数
     * @param id 唯一标识
     * @param type 方块类型
     * @param color 方块颜色
     * @param position 网格位置
     */
    constructor(id: string, type: BlockType, color: BlockColor, position: BlockPosition) {
        this._id = id;
        this._type = type;
        this._color = color;
        this._position = position;
        this._state = BlockState.NORMAL;
    }
    
    /**
     * 获取方块ID
     */
    get id(): string {
        return this._id;
    }
    
    /**
     * 获取方块类型
     */
    get type(): BlockType {
        return this._type;
    }
    
    /**
     * 设置方块类型
     */
    set type(value: BlockType) {
        this._type = value;
    }
    
    /**
     * 获取方块颜色
     */
    get color(): BlockColor {
        return this._color;
    }
    
    /**
     * 设置方块颜色
     */
    set color(value: BlockColor) {
        this._color = value;
    }
    
    /**
     * 获取方块位置
     */
    get position(): BlockPosition {
        return this._position;
    }
    
    /**
     * 设置方块位置
     */
    set position(value: BlockPosition) {
        this._position = value;
    }
    
    /**
     * 获取方块状态
     */
    get state(): BlockState {
        return this._state;
    }
    
    /**
     * 设置方块状态
     */
    set state(value: BlockState) {
        this._state = value;
    }
    
    /**
     * 选中方块
     * @returns 当前方块实例
     */
    select(): Block {
        this._state = BlockState.SELECTED;
        // 在实际实现中，这里会触发选中动画
        return this;
    }
    
    /**
     * 取消选中
     * @returns 当前方块实例
     */
    deselect(): Block {
        this._state = BlockState.NORMAL;
        // 在实际实现中，这里会取消选中动画
        return this;
    }
    
    /**
     * 消除方块
     * @returns 当前方块实例
     */
    eliminate(): Block {
        this._state = BlockState.ELIMINATING;
        // 在实际实现中，这里会触发消除动画
        return this;
    }
    
    /**
     * 播放动画
     * @param animationType 动画类型
     * @param callback 动画完成回调
     */
    playAnimation(animationType: string, callback?: () => void): void {
        // 在实际实现中，这里会根据动画类型播放相应的动画
        console.log(`播放${animationType}动画`);
        
        // 模拟动画完成
        if (callback) {
            setTimeout(callback, 300);
        }
    }
    
    /**
     * 判断是否可以与另一个方块连接
     * @param other 另一个方块
     * @returns 是否可连接
     */
    canConnectWith(other: Block): boolean {
        // 彩虹方块可以与任何方块连接
        if (this._type === BlockType.RAINBOW || other.type === BlockType.RAINBOW) {
            return true;
        }
        
        // 普通方块只能与同色方块连接
        return this._color === other.color;
    }
    
    /**
     * 获取方块的特效类型
     * @returns 特效类型
     */
    getEffectType(): string {
        switch (this._type) {
            case BlockType.BOMB:
                return 'explosion';
            case BlockType.RAINBOW:
                return 'rainbow';
            case BlockType.LINE:
                return 'line';
            default:
                return 'normal';
        }
    }
    
    /**
     * 克隆方块
     * @returns 新的方块实例
     */
    clone(): Block {
        return new Block(
            this._id,
            this._type,
            this._color,
            { row: this._position.row, col: this._position.col }
        );
    }
    
    /**
     * 转换为字符串
     * @returns 字符串表示
     */
    toString(): string {
        return `Block(id=${this._id}, type=${this._type}, color=${this._color}, position=[${this._position.row},${this._position.col}], state=${this._state})`;
    }
}

/**
 * 炸弹方块类
 */
export class BombBlock extends Block {
    private _radius: number; // 爆炸半径
    
    /**
     * 构造函数
     * @param id 唯一标识
     * @param color 方块颜色
     * @param position 网格位置
     * @param radius 爆炸半径
     */
    constructor(id: string, color: BlockColor, position: BlockPosition, radius: number = 1) {
        super(id, BlockType.BOMB, color, position);
        this._radius = radius;
    }
    
    /**
     * 获取爆炸半径
     */
    get radius(): number {
        return this._radius;
    }
    
    /**
     * 获取爆炸范围内的所有位置
     * @returns 位置数组
     */
    getExplosionRange(): BlockPosition[] {
        const positions: BlockPosition[] = [];
        const { row, col } = this.position;
        
        // 遍历爆炸范围内的所有位置
        for (let r = row - this._radius; r <= row + this._radius; r++) {
            for (let c = col - this._radius; c <= col + this._radius; c++) {
                // 排除超出边界的位置
                if (r >= 0 && c >= 0) {
                    positions.push({ row: r, col: c });
                }
            }
        }
        
        return positions;
    }
    
    /**
     * 重写消除方法，实现爆炸效果
     * @returns 当前方块实例
     */
    eliminate(): Block {
        super.eliminate();
        // 在实际实现中，这里会触发爆炸动画
        this.playAnimation('explosion');
        return this;
    }
}

/**
 * 彩虹方块类
 */
export class RainbowBlock extends Block {
    /**
     * 构造函数
     * @param id 唯一标识
     * @param position 网格位置
     */
    constructor(id: string, position: BlockPosition) {
        // 彩虹方块没有固定颜色，这里使用RED作为默认值
        super(id, BlockType.RAINBOW, BlockColor.RED, position);
    }
    
    /**
     * 重写消除方法，实现彩虹效果
     * @param targetColor 目标颜色
     * @returns 当前方块实例
     */
    eliminateWithColor(targetColor: BlockColor): Block {
        this.color = targetColor; // 设置为目标颜色
        super.eliminate();
        // 在实际实现中，这里会触发彩虹效果动画
        this.playAnimation('rainbow');
        return this;
    }
}

/**
 * 直线消除方块类
 */
export class LineBlock extends Block {
    private _direction: 'horizontal' | 'vertical';
    
    /**
     * 构造函数
     * @param id 唯一标识
     * @param color 方块颜色
     * @param position 网格位置
     * @param direction 消除方向
     */
    constructor(id: string, color: BlockColor, position: BlockPosition, direction: 'horizontal' | 'vertical') {
        super(id, BlockType.LINE, color, position);
        this._direction = direction;
    }
    
    /**
     * 获取消除方向
     */
    get direction(): 'horizontal' | 'vertical' {
        return this._direction;
    }
    
    /**
     * 获取消除范围内的所有位置
     * @param boardSize 面板大小
     * @returns 位置数组
     */
    getLineRange(boardSize: { rows: number, cols: number }): BlockPosition[] {
        const positions: BlockPosition[] = [];
        const { row, col } = this.position;
        
        if (this._direction === 'horizontal') {
            // 水平方向消除
            for (let c = 0; c < boardSize.cols; c++) {
                positions.push({ row, col: c });
            }
        } else {
            // 垂直方向消除
            for (let r = 0; r < boardSize.rows; r++) {
                positions.push({ row: r, col });
            }
        }
        
        return positions;
    }
    
    /**
     * 重写消除方法，实现直线消除效果
     * @returns 当前方块实例
     */
    eliminate(): Block {
        super.eliminate();
        // 在实际实现中，这里会触发直线消除动画
        this.playAnimation(this._direction === 'horizontal' ? 'horizontalLine' : 'verticalLine');
        return this;
    }
}
