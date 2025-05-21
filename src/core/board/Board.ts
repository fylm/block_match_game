// Board.ts - 游戏面板类

import { Block, BlockType, BlockColor, BlockState, BlockPosition, BombBlock, RainbowBlock, LineBlock } from './Block';

/**
 * 游戏面板配置接口
 */
export interface BoardConfig {
    rows: number;       // 行数
    cols: number;       // 列数
    colorCount: number; // 颜色种类数
    initialBlocks?: Block[][]; // 初始方块配置（可选）
}

/**
 * 游戏面板类
 */
export class Board {
    private _rows: number;
    private _cols: number;
    private _blocks: Block[][];
    private _selectedBlocks: Block[];
    private _colorCount: number;
    private _colors: BlockColor[];
    private _idCounter: number;
    
    /**
     * 构造函数
     * @param config 面板配置
     */
    constructor(config: BoardConfig) {
        this._rows = config.rows;
        this._cols = config.cols;
        this._colorCount = Math.min(config.colorCount, Object.keys(BlockColor).length);
        this._selectedBlocks = [];
        this._idCounter = 0;
        
        // 初始化可用颜色
        this._colors = this.initializeColors();
        
        // 初始化方块数组
        this._blocks = [];
        for (let r = 0; r < this._rows; r++) {
            this._blocks[r] = [];
            for (let c = 0; c < this._cols; c++) {
                this._blocks[r][c] = null;
            }
        }
        
        // 如果提供了初始方块配置，则使用它
        if (config.initialBlocks) {
            this._blocks = config.initialBlocks;
        } else {
            // 否则生成新的方块
            this.generateBlocks();
        }
    }
    
    /**
     * 初始化可用颜色
     * @returns 颜色数组
     */
    private initializeColors(): BlockColor[] {
        const allColors = Object.values(BlockColor);
        const colors: BlockColor[] = [];
        
        // 随机选择指定数量的颜色
        while (colors.length < this._colorCount) {
            const randomIndex = Math.floor(Math.random() * allColors.length);
            const color = allColors[randomIndex];
            
            if (!colors.includes(color)) {
                colors.push(color);
            }
        }
        
        return colors;
    }
    
    /**
     * 生成唯一ID
     * @returns 唯一ID
     */
    private generateId(): string {
        return `block_${++this._idCounter}`;
    }
    
    /**
     * 获取随机颜色
     * @returns 随机颜色
     */
    private getRandomColor(): BlockColor {
        const randomIndex = Math.floor(Math.random() * this._colors.length);
        return this._colors[randomIndex];
    }
    
    /**
     * 生成方块
     */
    generateBlocks(): void {
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (!this._blocks[r][c]) {
                    const color = this.getRandomColor();
                    this._blocks[r][c] = new Block(
                        this.generateId(),
                        BlockType.NORMAL,
                        color,
                        { row: r, col: c }
                    );
                }
            }
        }
        
        // 确保生成的方块布局有可行解
        while (!this.hasPossibleMoves()) {
            this.shuffleBlocks();
        }
    }
    
    /**
     * 重新排列方块
     */
    shuffleBlocks(): void {
        const allBlocks: Block[] = [];
        
        // 收集所有方块
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (this._blocks[r][c]) {
                    allBlocks.push(this._blocks[r][c]);
                }
            }
        }
        
        // 随机打乱
        for (let i = allBlocks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allBlocks[i], allBlocks[j]] = [allBlocks[j], allBlocks[i]];
        }
        
        // 重新分配位置
        let index = 0;
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (index < allBlocks.length) {
                    this._blocks[r][c] = allBlocks[index];
                    this._blocks[r][c].position = { row: r, col: c };
                    index++;
                }
            }
        }
    }
    
    /**
     * 检查是否有可行的移动
     * @returns 是否有可行移动
     */
    hasPossibleMoves(): boolean {
        // 检查每个方块
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                const block = this._blocks[r][c];
                if (!block) continue;
                
                // 检查周围的方块
                const neighbors = this.getAdjacentBlocks({ row: r, col: c });
                for (const neighbor of neighbors) {
                    if (block.canConnectWith(neighbor)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * 获取相邻的方块
     * @param position 位置
     * @returns 相邻方块数组
     */
    getAdjacentBlocks(position: BlockPosition): Block[] {
        const { row, col } = position;
        const adjacentPositions = [
            { row: row - 1, col }, // 上
            { row: row + 1, col }, // 下
            { row, col - 1 },      // 左
            { row, col + 1 },      // 右
            { row - 1, col - 1 },  // 左上
            { row - 1, col + 1 },  // 右上
            { row + 1, col - 1 },  // 左下
            { row + 1, col + 1 }   // 右下
        ];
        
        const adjacentBlocks: Block[] = [];
        
        for (const pos of adjacentPositions) {
            if (this.isValidPosition(pos) && this._blocks[pos.row][pos.col]) {
                adjacentBlocks.push(this._blocks[pos.row][pos.col]);
            }
        }
        
        return adjacentBlocks;
    }
    
    /**
     * 判断位置是否有效
     * @param position 位置
     * @returns 是否有效
     */
    isValidPosition(position: BlockPosition): boolean {
        const { row, col } = position;
        return row >= 0 && row < this._rows && col >= 0 && col < this._cols;
    }
    
    /**
     * 获取指定位置的方块
     * @param position 位置
     * @returns 方块或null
     */
    getBlockAt(position: BlockPosition): Block | null {
        if (!this.isValidPosition(position)) {
            return null;
        }
        
        return this._blocks[position.row][position.col];
    }
    
    /**
     * 选中方块
     * @param position 位置
     * @returns 是否选中成功
     */
    selectBlock(position: BlockPosition): boolean {
        const block = this.getBlockAt(position);
        
        if (!block || block.state !== BlockState.NORMAL) {
            return false;
        }
        
        // 如果已经有选中的方块，检查是否可以连接
        if (this._selectedBlocks.length > 0) {
            const lastSelected = this._selectedBlocks[this._selectedBlocks.length - 1];
            
            // 检查是否相邻
            const adjacentBlocks = this.getAdjacentBlocks(lastSelected.position);
            if (!adjacentBlocks.includes(block)) {
                return false;
            }
            
            // 检查是否可连接
            if (!lastSelected.canConnectWith(block)) {
                return false;
            }
            
            // 检查是否已经选中过
            if (this._selectedBlocks.includes(block)) {
                // 如果是倒数第二个选中的方块，允许回退
                if (this._selectedBlocks.length >= 2 && 
                    this._selectedBlocks[this._selectedBlocks.length - 2] === block) {
                    // 取消上一个选中的方块
                    const removed = this._selectedBlocks.pop();
                    removed.deselect();
                    return true;
                }
                return false;
            }
        }
        
        // 选中方块
        block.select();
        this._selectedBlocks.push(block);
        return true;
    }
    
    /**
     * 取消所有选中
     */
    deselectAll(): void {
        for (const block of this._selectedBlocks) {
            block.deselect();
        }
        this._selectedBlocks = [];
    }
    
    /**
     * 确认当前选中的方块
     * @returns 是否成功消除
     */
    confirmSelection(): boolean {
        // 至少需要3个方块才能消除
        if (this._selectedBlocks.length < 3) {
            this.deselectAll();
            return false;
        }
        
        // 执行消除
        this.eliminateSelectedBlocks();
        return true;
    }
    
    /**
     * 消除选中的方块
     * @returns 消除的方块数量
     */
    eliminateSelectedBlocks(): number {
        const count = this._selectedBlocks.length;
        
        // 检查是否需要生成特殊方块
        let specialBlock: Block = null;
        if (count >= 7) {
            // 生成彩虹方块
            specialBlock = new RainbowBlock(
                this.generateId(),
                this._selectedBlocks[0].position
            );
        } else if (count >= 5) {
            // 生成炸弹方块
            specialBlock = new BombBlock(
                this.generateId(),
                this._selectedBlocks[0].color,
                this._selectedBlocks[0].position
            );
        } else if (this.isLOrTShape(this._selectedBlocks)) {
            // 生成直线消除方块
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            specialBlock = new LineBlock(
                this.generateId(),
                this._selectedBlocks[0].color,
                this._selectedBlocks[0].position,
                direction
            );
        }
        
        // 消除选中的方块
        for (const block of this._selectedBlocks) {
            const { row, col } = block.position;
            block.eliminate();
            
            // 如果是第一个方块且需要生成特殊方块，则替换为特殊方块
            if (specialBlock && block === this._selectedBlocks[0]) {
                this._blocks[row][col] = specialBlock;
            } else {
                this._blocks[row][col] = null;
            }
        }
        
        // 清空选中列表
        this._selectedBlocks = [];
        
        // 处理方块下落
        this.handleBlocksFalling();
        
        // 填充空缺
        this.fillEmptySpaces();
        
        return count;
    }
    
    /**
     * 判断选中的方块是否形成L或T形状
     * @param blocks 方块数组
     * @returns 是否形成L或T形状
     */
    private isLOrTShape(blocks: Block[]): boolean {
        // 简化实现：检查是否有方块同时有水平和垂直相邻的选中方块
        const positions = blocks.map(block => block.position);
        
        for (const block of blocks) {
            const { row, col } = block.position;
            
            // 检查是否同时有水平和垂直相邻的选中方块
            const hasHorizontal = positions.some(pos => 
                (pos.row === row && Math.abs(pos.col - col) === 1));
            
            const hasVertical = positions.some(pos => 
                (pos.col === col && Math.abs(pos.row - row) === 1));
            
            if (hasHorizontal && hasVertical) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 处理方块下落
     */
    private handleBlocksFalling(): void {
        // 从底部向上处理每一列
        for (let c = 0; c < this._cols; c++) {
            // 从底部开始向上查找空缺
            for (let r = this._rows - 1; r >= 0; r--) {
                if (!this._blocks[r][c]) {
                    // 找到空缺，从上方找到第一个非空方块下落
                    for (let above = r - 1; above >= 0; above--) {
                        if (this._blocks[above][c]) {
                            // 移动方块
                            this._blocks[r][c] = this._blocks[above][c];
                            this._blocks[r][c].position = { row: r, col: c };
                            this._blocks[r][c].state = BlockState.FALLING;
                            this._blocks[above][c] = null;
                            break;
                        }
                    }
                }
            }
        }
        
        // 在实际实现中，这里会等待下落动画完成
        // 然后将所有下落中的方块状态恢复为正常
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (this._blocks[r][c] && this._blocks[r][c].state === BlockState.FALLING) {
                    this._blocks[r][c].state = BlockState.NORMAL;
                }
            }
        }
    }
    
    /**
     * 填充空缺
     */
    private fillEmptySpaces(): void {
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (!this._blocks[r][c]) {
                    const color = this.getRandomColor();
                    this._blocks[r][c] = new Block(
                        this.generateId(),
                        BlockType.NORMAL,
                        color,
                        { row: r, col: c }
                    );
                }
            }
        }
    }
    
    /**
     * 使用炸弹方块
     * @param position 炸弹位置
     * @returns 消除的方块数量
     */
    useBombBlock(position: BlockPosition): number {
        const block = this.getBlockAt(position);
        
        if (!block || block.type !== BlockType.BOMB) {
            return 0;
        }
        
        const bombBlock = block as BombBlock;
        const explosionRange = bombBlock.getExplosionRange();
        let count = 0;
        
        // 消除爆炸范围内的方块
        for (const pos of explosionRange) {
            if (this.isValidPosition(pos) && this._blocks[pos.row][pos.col]) {
                this._blocks[pos.row][pos.col].eliminate();
                this._blocks[pos.row][pos.col] = null;
                count++;
            }
        }
        
        // 处理方块下落
        this.handleBlocksFalling();
        
        // 填充空缺
        this.fillEmptySpaces();
        
        return count;
    }
    
    /**
     * 使用彩虹方块
     * @param position 彩虹方块位置
     * @param targetColor 目标颜色
     * @returns 消除的方块数量
     */
    useRainbowBlock(position: BlockPosition, targetColor: BlockColor): number {
        const block = this.getBlockAt(position);
        
        if (!block || block.type !== BlockType.RAINBOW) {
            return 0;
        }
        
        const rainbowBlock = block as RainbowBlock;
        let count = 0;
        
        // 消除所有目标颜色的方块
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                if (this._blocks[r][c] && this._blocks[r][c].color === targetColor) {
                    this._blocks[r][c].eliminate();
                    this._blocks[r][c] = null;
                    count++;
                }
            }
        }
        
        // 消除彩虹方块自身
        rainbowBlock.eliminateWithColor(targetColor);
        this._blocks[position.row][position.col] = null;
        count++;
        
        // 处理方块下落
        this.handleBlocksFalling();
        
        // 填充空缺
        this.fillEmptySpaces();
        
        return count;
    }
    
    /**
     * 使用直线消除方块
     * @param position 直线方块位置
     * @returns 消除的方块数量
     */
    useLineBlock(position: BlockPosition): number {
        const block = this.getBlockAt(position);
        
        if (!block || block.type !== BlockType.LINE) {
            return 0;
        }
        
        const lineBlock = block as LineBlock;
        const lineRange = lineBlock.getLineRange({ rows: this._rows, cols: this._cols });
        let count = 0;
        
        // 消除直线范围内的方块
        for (const pos of lineRange) {
            if (this.isValidPosition(pos) && this._blocks[pos.row][pos.col]) {
                this._blocks[pos.row][pos.col].eliminate();
                this._blocks[pos.row][pos.col] = null;
                count++;
            }
        }
        
        // 处理方块下落
        this.handleBlocksFalling();
        
        // 填充空缺
        this.fillEmptySpaces();
        
        return count;
    }
    
    /**
     * 获取当前选中的方块
     * @returns 选中的方块数组
     */
    get selectedBlocks(): Block[] {
        return [...this._selectedBlocks];
    }
    
    /**
     * 获取面板行数
     */
    get rows(): number {
        return this._rows;
    }
    
    /**
     * 获取面板列数
     */
    get cols(): number {
        return this._cols;
    }
    
    /**
     * 获取面板上的所有方块
     * @returns 方块二维数组
     */
    get blocks(): Block[][] {
        return this._blocks;
    }
    
    /**
     * 转换为字符串（用于调试）
     * @returns 字符串表示
     */
    toString(): string {
        let result = '';
        
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                const block = this._blocks[r][c];
                if (block) {
                    result += block.color.charAt(0).toUpperCase();
                } else {
                    result += '.';
                }
            }
            result += '\n';
        }
        
        return result;
    }
}
