// LineDetector.ts - 连线判定算法

import { Block, BlockPosition } from '../block/Block';
import { Board } from '../board/Board';

/**
 * 连线路径节点
 */
interface PathNode {
    position: BlockPosition;
    parent: PathNode | null;
}

/**
 * 连线判定类
 */
export class LineDetector {
    private _board: Board;
    
    /**
     * 构造函数
     * @param board 游戏面板
     */
    constructor(board: Board) {
        this._board = board;
    }
    
    /**
     * 判断两个方块是否可连接
     * @param start 起始方块位置
     * @param end 目标方块位置
     * @returns 是否可连接
     */
    isConnectable(start: BlockPosition, end: BlockPosition): boolean {
        // 获取方块
        const startBlock = this._board.getBlockAt(start);
        const endBlock = this._board.getBlockAt(end);
        
        // 检查方块是否存在
        if (!startBlock || !endBlock) {
            return false;
        }
        
        // 检查方块是否可以匹配
        if (!startBlock.canConnectWith(endBlock)) {
            return false;
        }
        
        // 寻找连接路径
        const path = this.findPath(start, end);
        return path !== null;
    }
    
    /**
     * 寻找连接路径
     * @param start 起始位置
     * @param end 目标位置
     * @returns 路径数组或null
     */
    findPath(start: BlockPosition, end: BlockPosition): BlockPosition[] | null {
        // 如果起点和终点相同，返回null
        if (start.row === end.row && start.col === end.col) {
            return null;
        }
        
        // 使用广度优先搜索寻找路径
        const queue: PathNode[] = [];
        const visited: boolean[][] = Array(this._board.rows).fill(0).map(() => Array(this._board.cols).fill(false));
        
        // 起点
        const startNode: PathNode = { position: start, parent: null };
        queue.push(startNode);
        visited[start.row][start.col] = true;
        
        // 方向数组：上、右、下、左
        const directions = [
            { row: -1, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 0, col: -1 }
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // 检查是否到达终点
            if (current.position.row === end.row && current.position.col === end.col) {
                // 重建路径
                return this.reconstructPath(current);
            }
            
            // 尝试四个方向
            for (const dir of directions) {
                const newRow = current.position.row + dir.row;
                const newCol = current.position.col + dir.col;
                
                // 检查新位置是否有效
                if (this.isValidPosition(newRow, newCol) && !visited[newRow][newCol]) {
                    // 检查新位置是否为空或为终点
                    const newBlock = this._board.getBlockAt({ row: newRow, col: newCol });
                    if (!newBlock || (newRow === end.row && newCol === end.col)) {
                        const newNode: PathNode = {
                            position: { row: newRow, col: newCol },
                            parent: current
                        };
                        queue.push(newNode);
                        visited[newRow][newCol] = true;
                    }
                }
            }
        }
        
        // 没有找到路径
        return null;
    }
    
    /**
     * 重建路径
     * @param endNode 终点节点
     * @returns 路径数组
     */
    private reconstructPath(endNode: PathNode): BlockPosition[] {
        const path: BlockPosition[] = [];
        let current: PathNode | null = endNode;
        
        // 从终点回溯到起点
        while (current !== null) {
            path.unshift(current.position);
            current = current.parent;
        }
        
        return path;
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
     * 验证连线是否有效
     * @param blocks 连线方块数组
     * @returns 是否有效
     */
    validateLine(blocks: Block[]): boolean {
        // 至少需要3个方块
        if (blocks.length < 3) {
            return false;
        }
        
        // 检查所有方块是否可以匹配
        const firstBlock = blocks[0];
        for (let i = 1; i < blocks.length; i++) {
            if (!firstBlock.canConnectWith(blocks[i])) {
                return false;
            }
        }
        
        // 检查相邻方块是否连续
        for (let i = 1; i < blocks.length; i++) {
            const prev = blocks[i - 1].position;
            const curr = blocks[i].position;
            
            // 计算距离
            const rowDiff = Math.abs(prev.row - curr.row);
            const colDiff = Math.abs(prev.col - curr.col);
            
            // 相邻方块必须在水平、垂直或对角线方向上
            if (rowDiff > 1 || colDiff > 1) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 获取连线的视觉路径点
     * @param blocks 连线方块数组
     * @returns 路径点数组
     */
    getLinePath(blocks: Block[]): { x: number, y: number }[] {
        return blocks.map(block => {
            // 在实际实现中，这里会将网格位置转换为屏幕坐标
            // 这里简化为直接返回网格位置
            return {
                x: block.position.col,
                y: block.position.row
            };
        });
    }
}
