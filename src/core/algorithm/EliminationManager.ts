// EliminationManager.ts - 消除管理类

import { Block, BlockType, BlockColor, BlockPosition, BombBlock, RainbowBlock, LineBlock } from '../block/Block';
import { Board } from '../board/Board';

/**
 * 消除结果接口
 */
export interface EliminationResult {
    score: number;           // 获得的分数
    eliminatedCount: number; // 消除的方块数量
    comboCount: number;      // 连击次数
    chainCount: number;      // 连锁次数
    specialBlocks: Block[];  // 生成的特殊方块
    energyGained: number;    // 获得的能量值
}

/**
 * 消除管理类
 */
export class EliminationManager {
    private _board: Board;
    private _comboCount: number = 0;
    private _chainCount: number = 0;
    private _baseScore: number = 10;
    
    /**
     * 构造函数
     * @param board 游戏面板
     */
    constructor(board: Board) {
        this._board = board;
    }
    
    /**
     * 执行消除
     * @param blocks 要消除的方块数组
     * @returns 消除结果
     */
    eliminate(blocks: Block[]): EliminationResult {
        // 增加连击计数
        this._comboCount++;
        
        // 初始化结果
        const result: EliminationResult = {
            score: 0,
            eliminatedCount: blocks.length,
            comboCount: this._comboCount,
            chainCount: 0,
            specialBlocks: [],
            energyGained: 0
        };
        
        // 计算基础分数
        result.score = this.calculateBaseScore(blocks);
        
        // 应用连击加成
        result.score = this.applyComboBonus(result.score);
        
        // 检查是否生成特殊方块
        const specialBlock = this.checkSpecialBlockGeneration(blocks);
        if (specialBlock) {
            result.specialBlocks.push(specialBlock);
        }
        
        // 计算获得的能量
        result.energyGained = this.calculateEnergyGain(blocks);
        
        // 执行消除操作
        this.performElimination(blocks, specialBlock);
        
        // 处理连锁反应
        const chainResult = this.handleChainReaction();
        if (chainResult) {
            result.chainCount = chainResult.chainCount;
            result.score += chainResult.score;
            result.eliminatedCount += chainResult.eliminatedCount;
            result.specialBlocks = result.specialBlocks.concat(chainResult.specialBlocks);
            result.energyGained += chainResult.energyGained;
        }
        
        return result;
    }
    
    /**
     * 计算基础分数
     * @param blocks 消除的方块数组
     * @returns 基础分数
     */
    private calculateBaseScore(blocks: Block[]): number {
        let score = 0;
        
        // 计算每个方块的分数
        for (const block of blocks) {
            switch (block.type) {
                case BlockType.NORMAL:
                    score += this._baseScore;
                    break;
                case BlockType.BOMB:
                    score += this._baseScore * 2;
                    break;
                case BlockType.RAINBOW:
                    score += this._baseScore * 3;
                    break;
                case BlockType.LINE:
                    score += this._baseScore * 2.5;
                    break;
            }
        }
        
        // 应用连接长度加成
        const lengthMultiplier = this.getLengthMultiplier(blocks.length);
        score = Math.floor(score * lengthMultiplier);
        
        return score;
    }
    
    /**
     * 获取连接长度乘数
     * @param length 连接长度
     * @returns 乘数
     */
    private getLengthMultiplier(length: number): number {
        if (length <= 3) return 1.0;
        if (length === 4) return 1.2;
        if (length === 5) return 1.5;
        if (length === 6) return 1.8;
        return 2.0; // 7个及以上
    }
    
    /**
     * 应用连击加成
     * @param score 基础分数
     * @returns 加成后的分数
     */
    private applyComboBonus(score: number): number {
        // 第一次连击没有加成
        if (this._comboCount <= 1) return score;
        
        // 连击加成，最高2倍
        const comboMultiplier = Math.min(1 + (this._comboCount - 1) * 0.1, 2.0);
        return Math.floor(score * comboMultiplier);
    }
    
    /**
     * 检查是否生成特殊方块
     * @param blocks 消除的方块数组
     * @returns 生成的特殊方块或null
     */
    private checkSpecialBlockGeneration(blocks: Block[]): Block | null {
        if (blocks.length < 5) return null;
        
        const firstBlock = blocks[0];
        const position = firstBlock.position;
        
        if (blocks.length >= 7) {
            // 生成彩虹方块
            return new RainbowBlock(
                `rainbow_${Date.now()}`,
                position
            );
        } else if (blocks.length >= 5) {
            // 生成炸弹方块
            return new BombBlock(
                `bomb_${Date.now()}`,
                firstBlock.color,
                position
            );
        } else if (this.isLOrTShape(blocks)) {
            // 生成直线消除方块
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            return new LineBlock(
                `line_${Date.now()}`,
                firstBlock.color,
                position,
                direction
            );
        }
        
        return null;
    }
    
    /**
     * 判断方块是否形成L或T形状
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
     * 计算获得的能量
     * @param blocks 消除的方块数组
     * @returns 能量值
     */
    private calculateEnergyGain(blocks: Block[]): number {
        let energy = 0;
        
        // 每个方块提供的能量
        for (const block of blocks) {
            switch (block.type) {
                case BlockType.NORMAL:
                    energy += 1;
                    break;
                case BlockType.BOMB:
                    energy += 2;
                    break;
                case BlockType.RAINBOW:
                    energy += 3;
                    break;
                case BlockType.LINE:
                    energy += 2;
                    break;
            }
        }
        
        // 连击能量加成
        if (this._comboCount > 1) {
            energy = Math.floor(energy * (1 + (this._comboCount - 1) * 0.2));
        }
        
        return energy;
    }
    
    /**
     * 执行消除操作
     * @param blocks 要消除的方块数组
     * @param specialBlock 生成的特殊方块
     */
    private performElimination(blocks: Block[], specialBlock: Block | null): void {
        // 标记所有方块为消除状态
        for (const block of blocks) {
            block.eliminate();
        }
        
        // 从面板中移除方块
        for (const block of blocks) {
            const { row, col } = block.position;
            
            // 如果是第一个方块且需要生成特殊方块，则替换为特殊方块
            if (specialBlock && block === blocks[0]) {
                this._board.blocks[row][col] = specialBlock;
            } else {
                this._board.blocks[row][col] = null;
            }
        }
        
        // 处理方块下落和填充空缺
        // 注意：在实际实现中，这里会等待消除动画完成后再执行
        this.handleBlocksFalling();
    }
    
    /**
     * 处理方块下落
     */
    private handleBlocksFalling(): void {
        // 从底部向上处理每一列
        for (let c = 0; c < this._board.cols; c++) {
            // 从底部开始向上查找空缺
            for (let r = this._board.rows - 1; r >= 0; r--) {
                if (!this._board.blocks[r][c]) {
                    // 找到空缺，从上方找到第一个非空方块下落
                    for (let above = r - 1; above >= 0; above--) {
                        if (this._board.blocks[above][c]) {
                            // 移动方块
                            this._board.blocks[r][c] = this._board.blocks[above][c];
                            this._board.blocks[r][c].position = { row: r, col: c };
                            this._board.blocks[above][c] = null;
                            break;
                        }
                    }
                }
            }
        }
        
        // 填充空缺
        this.fillEmptySpaces();
    }
    
    /**
     * 填充空缺
     */
    private fillEmptySpaces(): void {
        // 检查每个位置，如果为空则生成新方块
        for (let r = 0; r < this._board.rows; r++) {
            for (let c = 0; c < this._board.cols; c++) {
                if (!this._board.blocks[r][c]) {
                    // 在实际实现中，这里会调用Board的方法生成新方块
                    // 这里简化处理
                    this._board.blocks[r][c] = new Block(
                        `new_${Date.now()}_${r}_${c}`,
                        BlockType.NORMAL,
                        this.getRandomColor(),
                        { row: r, col: c }
                    );
                }
            }
        }
    }
    
    /**
     * 获取随机颜色
     * @returns 随机颜色
     */
    private getRandomColor(): BlockColor {
        const colors = Object.values(BlockColor);
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
    
    /**
     * 处理连锁反应
     * @returns 连锁反应结果或null
     */
    private handleChainReaction(): EliminationResult | null {
        // 检查是否有可以自动消除的方块组合
        const matchedGroups = this.findMatchedGroups();
        
        if (matchedGroups.length === 0) {
            // 没有连锁反应，重置连击计数
            this._comboCount = 0;
            return null;
        }
        
        // 增加连锁计数
        this._chainCount++;
        
        // 初始化结果
        const result: EliminationResult = {
            score: 0,
            eliminatedCount: 0,
            comboCount: this._comboCount,
            chainCount: this._chainCount,
            specialBlocks: [],
            energyGained: 0
        };
        
        // 处理每个匹配组
        for (const group of matchedGroups) {
            // 计算基础分数
            const baseScore = this.calculateBaseScore(group);
            
            // 应用连击加成
            let score = this.applyComboBonus(baseScore);
            
            // 应用连锁反应加成
            score = Math.floor(score * (1 + this._chainCount * 0.1));
            
            // 如果连锁反应超过5次，额外奖励
            if (this._chainCount >= 5) {
                score += 200;
            }
            
            result.score += score;
            result.eliminatedCount += group.length;
            
            // 检查是否生成特殊方块
            const specialBlock = this.checkSpecialBlockGeneration(group);
            if (specialBlock) {
                result.specialBlocks.push(specialBlock);
            }
            
            // 计算获得的能量
            result.energyGained += this.calculateEnergyGain(group);
            
            // 执行消除操作
            this.performElimination(group, specialBlock);
        }
        
        // 递归处理可能的下一次连锁反应
        const nextChainResult = this.handleChainReaction();
        if (nextChainResult) {
            result.chainCount = nextChainResult.chainCount;
            result.score += nextChainResult.score;
            result.eliminatedCount += nextChainResult.eliminatedCount;
            result.specialBlocks = result.specialBlocks.concat(nextChainResult.specialBlocks);
            result.energyGained += nextChainResult.energyGained;
        }
        
        return result;
    }
    
    /**
     * 查找匹配的方块组
     * @returns 匹配组数组
     */
    private findMatchedGroups(): Block[][] {
        const groups: Block[][] = [];
        const visited: boolean[][] = Array(this._board.rows).fill(0).map(() => Array(this._board.cols).fill(false));
        
        // 检查每个方块
        for (let r = 0; r < this._board.rows; r++) {
            for (let c = 0; c < this._board.cols; c++) {
                if (visited[r][c] || !this._board.blocks[r][c]) continue;
                
                const block = this._board.blocks[r][c];
                const group = this.findConnectedBlocks(block, visited);
                
                // 如果找到3个或以上相连的同色方块，加入结果
                if (group.length >= 3) {
                    groups.push(group);
                }
            }
        }
        
        return groups;
    }
    
    /**
     * 查找与指定方块相连的所有同色方块
     * @param block 起始方块
     * @param visited 访问标记数组
     * @returns 相连方块数组
     */
    private findConnectedBlocks(block: Block, visited: boolean[][]): Block[] {
        const result: Block[] = [];
        const queue: Block[] = [block];
        
        // 标记起始方块为已访问
        visited[block.position.row][block.position.col] = true;
        result.push(block);
        
        // 方向数组：上、右、下、左、左上、右上、左下、右下
        const directions = [
            { row: -1, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: -1, col: -1 },
            { row: -1, col: 1 },
            { row: 1, col: -1 },
            { row: 1, col: 1 }
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // 检查相邻方块
            for (const dir of directions) {
                const newRow = current.position.row + dir.row;
                const newCol = current.position.col + dir.col;
                
                // 检查新位置是否有效
                if (this.isValidPosition(newRow, newCol) && !visited[newRow][newCol]) {
                    const neighbor = this._board.blocks[newRow][newCol];
                    
                    // 检查是否是同色方块
                    if (neighbor && current.canConnectWith(neighbor)) {
                        visited[newRow][newCol] = true;
                        result.push(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * 判断位置是否有效
     * @param row 行
     * @param col 列
     * @returns 是否有效
     */
    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this._board.rows && col >= 0 && col < this._board.cols;
    }
    
    /**
     * 重置连击计数
     */
    resetCombo(): void {
        this._comboCount = 0;
    }
    
    /**
     * 获取当前连击次数
     */
    get comboCount(): number {
        return this._comboCount;
    }
    
    /**
     * 获取当前连锁次数
     */
    get chainCount(): number {
        return this._chainCount;
    }
    
    /**
     * 重置连锁计数
     */
    resetChain(): void {
        this._chainCount = 0;
    }
}
