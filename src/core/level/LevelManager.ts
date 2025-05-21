// LevelManager.ts - 关卡管理类

import { Block, BlockColor, BlockType } from '../block/Block';
import { Board } from '../board/Board';

/**
 * 目标类型枚举
 */
export enum ObjectiveType {
    SCORE = 'score',           // 分数目标
    COLLECT_COLOR = 'color',   // 收集特定颜色方块
    COLLECT_SPECIAL = 'special', // 收集特殊方块
    CLEAR_OBSTACLE = 'obstacle', // 清除障碍物
    POSITION_CLEAR = 'position'  // 清除指定位置
}

/**
 * 关卡目标接口
 */
export interface LevelObjective {
    type: ObjectiveType;       // 目标类型
    target: number;            // 目标数量
    current: number;           // 当前进度
    param?: string;            // 附加参数（如颜色、特殊方块类型等）
}

/**
 * 关卡配置接口
 */
export interface LevelConfig {
    id: number;                // 关卡ID
    rows: number;              // 行数
    cols: number;              // 列数
    moveLimit?: number;        // 移动次数限制
    timeLimit?: number;        // 时间限制（秒）
    objectives: LevelObjective[]; // 关卡目标
    starScores: number[];      // 星级分数要求 [一星, 二星, 三星]
    initialBlocks?: any;       // 初始方块配置
    obstacles?: any[];         // 障碍物配置
}

/**
 * 关卡结果接口
 */
export interface LevelResult {
    levelId: number;           // 关卡ID
    completed: boolean;        // 是否完成
    score: number;             // 获得的分数
    stars: number;             // 获得的星星数（1-3）
    movesUsed: number;         // 使用的移动次数
    timeUsed?: number;         // 使用的时间（秒）
    objectivesCompleted: boolean[]; // 每个目标是否完成
}

/**
 * 关卡管理类
 */
export class LevelManager {
    private _currentLevel: LevelConfig | null = null;
    private _levels: Map<number, LevelConfig> = new Map();
    private _movesUsed: number = 0;
    private _timeUsed: number = 0;
    private _score: number = 0;
    private _board: Board | null = null;
    private _timerInterval: any = null;
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化关卡配置
        this.initializeLevels();
    }
    
    /**
     * 初始化关卡配置
     */
    private initializeLevels(): void {
        // 这里应该从配置文件或服务器加载关卡数据
        // 这里简化为硬编码几个示例关卡
        
        // 关卡1：简单的分数目标
        const level1: LevelConfig = {
            id: 1,
            rows: 8,
            cols: 8,
            moveLimit: 20,
            objectives: [
                { type: ObjectiveType.SCORE, target: 1000, current: 0 }
            ],
            starScores: [800, 1200, 1500]
        };
        
        // 关卡2：收集特定颜色方块
        const level2: LevelConfig = {
            id: 2,
            rows: 8,
            cols: 8,
            moveLimit: 25,
            objectives: [
                { type: ObjectiveType.COLLECT_COLOR, target: 20, current: 0, param: BlockColor.RED },
                { type: ObjectiveType.COLLECT_COLOR, target: 20, current: 0, param: BlockColor.BLUE }
            ],
            starScores: [1000, 1500, 2000]
        };
        
        // 关卡3：收集特殊方块
        const level3: LevelConfig = {
            id: 3,
            rows: 9,
            cols: 9,
            moveLimit: 30,
            objectives: [
                { type: ObjectiveType.COLLECT_SPECIAL, target: 3, current: 0, param: BlockType.BOMB },
                { type: ObjectiveType.SCORE, target: 1500, current: 0 }
            ],
            starScores: [1200, 1800, 2500]
        };
        
        // 添加到关卡集合
        this._levels.set(level1.id, level1);
        this._levels.set(level2.id, level2);
        this._levels.set(level3.id, level3);
    }
    
    /**
     * 加载关卡
     * @param levelId 关卡ID
     * @returns 是否成功加载
     */
    loadLevel(levelId: number): boolean {
        // 获取关卡配置
        const levelConfig = this._levels.get(levelId);
        if (!levelConfig) {
            console.error(`关卡 ${levelId} 不存在`);
            return false;
        }
        
        // 设置当前关卡
        this._currentLevel = levelConfig;
        
        // 重置状态
        this._movesUsed = 0;
        this._timeUsed = 0;
        this._score = 0;
        
        // 重置目标进度
        for (const objective of this._currentLevel.objectives) {
            objective.current = 0;
        }
        
        // 创建游戏面板
        this._board = new Board({
            rows: levelConfig.rows,
            cols: levelConfig.cols,
            colorCount: 6, // 默认使用6种颜色
            initialBlocks: levelConfig.initialBlocks
        });
        
        // 如果有时间限制，启动计时器
        if (levelConfig.timeLimit) {
            this.startTimer();
        }
        
        return true;
    }
    
    /**
     * 启动计时器
     */
    private startTimer(): void {
        // 清除可能存在的旧计时器
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
        }
        
        // 每秒更新时间
        this._timerInterval = setInterval(() => {
            this._timeUsed++;
            
            // 检查是否超时
            if (this._currentLevel.timeLimit && this._timeUsed >= this._currentLevel.timeLimit) {
                this.endLevel(false);
            }
        }, 1000);
    }
    
    /**
     * 停止计时器
     */
    private stopTimer(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }
    
    /**
     * 记录移动
     * @returns 剩余移动次数
     */
    recordMove(): number {
        if (!this._currentLevel) return 0;
        
        this._movesUsed++;
        
        // 检查是否达到移动限制
        if (this._currentLevel.moveLimit && this._movesUsed >= this._currentLevel.moveLimit) {
            // 检查是否完成目标
            if (this.checkAllObjectivesCompleted()) {
                this.endLevel(true);
            } else {
                this.endLevel(false);
            }
        }
        
        return this.getRemainingMoves();
    }
    
    /**
     * 获取剩余移动次数
     * @returns 剩余移动次数
     */
    getRemainingMoves(): number {
        if (!this._currentLevel || !this._currentLevel.moveLimit) return Infinity;
        return Math.max(0, this._currentLevel.moveLimit - this._movesUsed);
    }
    
    /**
     * 获取剩余时间
     * @returns 剩余时间（秒）
     */
    getRemainingTime(): number {
        if (!this._currentLevel || !this._currentLevel.timeLimit) return Infinity;
        return Math.max(0, this._currentLevel.timeLimit - this._timeUsed);
    }
    
    /**
     * 更新分数
     * @param score 新增分数
     * @returns 更新后的总分
     */
    updateScore(score: number): number {
        this._score += score;
        
        // 更新分数目标
        for (const objective of this._currentLevel.objectives) {
            if (objective.type === ObjectiveType.SCORE) {
                objective.current = this._score;
            }
        }
        
        return this._score;
    }
    
    /**
     * 更新收集目标
     * @param type 目标类型
     * @param param 附加参数
     * @param count 收集数量
     */
    updateCollectionObjective(type: ObjectiveType, param: string, count: number): void {
        if (!this._currentLevel) return;
        
        for (const objective of this._currentLevel.objectives) {
            if (objective.type === type && objective.param === param) {
                objective.current += count;
            }
        }
    }
    
    /**
     * 检查所有目标是否完成
     * @returns 是否全部完成
     */
    checkAllObjectivesCompleted(): boolean {
        if (!this._currentLevel) return false;
        
        for (const objective of this._currentLevel.objectives) {
            if (objective.current < objective.target) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 获取目标完成状态
     * @returns 每个目标的完成状态
     */
    getObjectivesStatus(): boolean[] {
        if (!this._currentLevel) return [];
        
        return this._currentLevel.objectives.map(obj => obj.current >= obj.target);
    }
    
    /**
     * 计算星级
     * @returns 获得的星星数（1-3）
     */
    calculateStars(): number {
        if (!this._currentLevel) return 0;
        
        const { starScores } = this._currentLevel;
        
        if (this._score >= starScores[2]) return 3;
        if (this._score >= starScores[1]) return 2;
        if (this._score >= starScores[0]) return 1;
        return 0;
    }
    
    /**
     * 结束关卡
     * @param success 是否成功
     * @returns 关卡结果
     */
    endLevel(success: boolean): LevelResult {
        // 停止计时器
        this.stopTimer();
        
        // 准备结果
        const result: LevelResult = {
            levelId: this._currentLevel ? this._currentLevel.id : 0,
            completed: success,
            score: this._score,
            stars: this.calculateStars(),
            movesUsed: this._movesUsed,
            timeUsed: this._timeUsed,
            objectivesCompleted: this.getObjectivesStatus()
        };
        
        // 在实际实现中，这里会保存结果到本地或服务器
        
        return result;
    }
    
    /**
     * 获取当前关卡
     */
    get currentLevel(): LevelConfig | null {
        return this._currentLevel;
    }
    
    /**
     * 获取当前分数
     */
    get score(): number {
        return this._score;
    }
    
    /**
     * 获取游戏面板
     */
    get board(): Board | null {
        return this._board;
    }
    
    /**
     * 获取已使用的移动次数
     */
    get movesUsed(): number {
        return this._movesUsed;
    }
    
    /**
     * 获取已使用的时间
     */
    get timeUsed(): number {
        return this._timeUsed;
    }
    
    /**
     * 检查关卡是否存在
     * @param levelId 关卡ID
     * @returns 是否存在
     */
    hasLevel(levelId: number): boolean {
        return this._levels.has(levelId);
    }
    
    /**
     * 获取所有关卡ID
     * @returns 关卡ID数组
     */
    getAllLevelIds(): number[] {
        return Array.from(this._levels.keys());
    }
}
