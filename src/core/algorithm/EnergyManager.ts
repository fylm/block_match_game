// EnergyManager.ts - 能量槽系统管理类

import { Block, BlockType } from '../block/Block';
import { EliminationResult } from '../algorithm/EliminationManager';

/**
 * 能量爆发类型枚举
 */
export enum EnergyBurstType {
    BASIC = 'basic',       // 基础爆发：随机消除30%的方块
    ADVANCED = 'advanced', // 高级爆发：消除所有特定颜色的方块
    SUPER = 'super'        // 超级爆发：全屏方块重排并创造有利局面
}

/**
 * 能量爆发结果接口
 */
export interface EnergyBurstResult {
    type: EnergyBurstType;      // 爆发类型
    score: number;              // 获得的分数
    eliminatedCount: number;    // 消除的方块数量
    affectedPositions: { row: number, col: number }[]; // 受影响的位置
}

/**
 * 能量槽系统管理类
 */
export class EnergyManager {
    private _currentEnergy: number = 0;
    private _maxEnergy: number = 100;
    private _burstThreshold: number = 100; // 触发能量爆发的阈值
    private _burstLevel: number = 1;       // 能量爆发等级
    private _energyGainMultiplier: number = 1.0; // 能量获取倍率
    
    /**
     * 构造函数
     * @param maxEnergy 最大能量值
     */
    constructor(maxEnergy: number = 100) {
        this._maxEnergy = maxEnergy;
        this._burstThreshold = maxEnergy;
    }
    
    /**
     * 增加能量
     * @param amount 增加的能量值
     * @param eliminationResult 消除结果
     * @returns 增加后的能量值
     */
    addEnergy(amount: number, eliminationResult?: EliminationResult): number {
        // 应用能量获取倍率
        let energyToAdd = Math.floor(amount * this._energyGainMultiplier);
        
        // 如果提供了消除结果，根据连击和连锁反应增加额外能量
        if (eliminationResult) {
            // 连击加成
            if (eliminationResult.comboCount > 1) {
                energyToAdd = Math.floor(energyToAdd * (1 + (eliminationResult.comboCount - 1) * 0.1));
            }
            
            // 连锁反应加成
            if (eliminationResult.chainCount > 0) {
                energyToAdd = Math.floor(energyToAdd * (1 + eliminationResult.chainCount * 0.2));
            }
            
            // 特殊方块加成
            if (eliminationResult.specialBlocks.length > 0) {
                energyToAdd += eliminationResult.specialBlocks.length * 5;
            }
        }
        
        // 增加能量，但不超过最大值
        this._currentEnergy = Math.min(this._currentEnergy + energyToAdd, this._maxEnergy);
        
        return this._currentEnergy;
    }
    
    /**
     * 使用能量
     * @param amount 使用的能量值
     * @returns 使用后的能量值
     */
    useEnergy(amount: number): number {
        // 确保不会使用超过当前拥有的能量
        const energyToUse = Math.min(amount, this._currentEnergy);
        this._currentEnergy -= energyToUse;
        
        return this._currentEnergy;
    }
    
    /**
     * 检查是否可以触发能量爆发
     * @returns 是否可以触发
     */
    canTriggerBurst(): boolean {
        return this._currentEnergy >= this._burstThreshold;
    }
    
    /**
     * 触发能量爆发
     * @param boardSize 面板大小
     * @param blocks 当前面板上的方块
     * @returns 能量爆发结果
     */
    triggerEnergyBurst(boardSize: { rows: number, cols: number }, blocks: Block[][]): EnergyBurstResult {
        // 确保能量足够
        if (!this.canTriggerBurst()) {
            throw new Error("能量不足，无法触发爆发");
        }
        
        // 根据爆发等级选择爆发类型
        let burstType: EnergyBurstType;
        if (this._burstLevel >= 3) {
            burstType = EnergyBurstType.SUPER;
        } else if (this._burstLevel >= 2) {
            burstType = EnergyBurstType.ADVANCED;
        } else {
            burstType = EnergyBurstType.BASIC;
        }
        
        // 消耗所有能量
        this._currentEnergy = 0;
        
        // 执行爆发效果
        const result = this.executeBurstEffect(burstType, boardSize, blocks);
        
        // 增加爆发等级，最高为3
        this._burstLevel = Math.min(this._burstLevel + 1, 3);
        
        return result;
    }
    
    /**
     * 执行爆发效果
     * @param type 爆发类型
     * @param boardSize 面板大小
     * @param blocks 当前面板上的方块
     * @returns 爆发结果
     */
    private executeBurstEffect(type: EnergyBurstType, boardSize: { rows: number, cols: number }, blocks: Block[][]): EnergyBurstResult {
        const result: EnergyBurstResult = {
            type: type,
            score: 0,
            eliminatedCount: 0,
            affectedPositions: []
        };
        
        switch (type) {
            case EnergyBurstType.BASIC:
                // 基础爆发：随机消除30%的方块
                this.executeBasicBurst(result, boardSize, blocks);
                break;
                
            case EnergyBurstType.ADVANCED:
                // 高级爆发：消除所有特定颜色的方块
                this.executeAdvancedBurst(result, boardSize, blocks);
                break;
                
            case EnergyBurstType.SUPER:
                // 超级爆发：全屏方块重排并创造有利局面
                this.executeSuperBurst(result, boardSize, blocks);
                break;
        }
        
        // 计算得分
        result.score = result.eliminatedCount * 15; // 能量爆发每消除一个方块得15分
        
        return result;
    }
    
    /**
     * 执行基础爆发
     * @param result 结果对象
     * @param boardSize 面板大小
     * @param blocks 当前面板上的方块
     */
    private executeBasicBurst(result: EnergyBurstResult, boardSize: { rows: number, cols: number }, blocks: Block[][]): void {
        const { rows, cols } = boardSize;
        const totalBlocks = rows * cols;
        const targetCount = Math.floor(totalBlocks * 0.3); // 消除30%的方块
        
        // 收集所有有效位置
        const validPositions: { row: number, col: number }[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (blocks[r][c]) {
                    validPositions.push({ row: r, col: c });
                }
            }
        }
        
        // 随机选择位置
        for (let i = 0; i < targetCount && validPositions.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * validPositions.length);
            const position = validPositions.splice(randomIndex, 1)[0];
            
            result.affectedPositions.push(position);
            result.eliminatedCount++;
        }
    }
    
    /**
     * 执行高级爆发
     * @param result 结果对象
     * @param boardSize 面板大小
     * @param blocks 当前面板上的方块
     */
    private executeAdvancedBurst(result: EnergyBurstResult, boardSize: { rows: number, cols: number }, blocks: Block[][]): void {
        const { rows, cols } = boardSize;
        
        // 统计每种颜色的方块数量
        const colorCounts = new Map<string, number>();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const block = blocks[r][c];
                if (block) {
                    const color = block.color;
                    colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
                }
            }
        }
        
        // 找出数量最多的颜色
        let maxColor = '';
        let maxCount = 0;
        colorCounts.forEach((count, color) => {
            if (count > maxCount) {
                maxCount = count;
                maxColor = color;
            }
        });
        
        // 消除所有该颜色的方块
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const block = blocks[r][c];
                if (block && block.color === maxColor) {
                    result.affectedPositions.push({ row: r, col: c });
                    result.eliminatedCount++;
                }
            }
        }
    }
    
    /**
     * 执行超级爆发
     * @param result 结果对象
     * @param boardSize 面板大小
     * @param blocks 当前面板上的方块
     */
    private executeSuperBurst(result: EnergyBurstResult, boardSize: { rows: number, cols: number }, blocks: Block[][]): void {
        const { rows, cols } = boardSize;
        
        // 超级爆发会影响所有方块
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (blocks[r][c]) {
                    result.affectedPositions.push({ row: r, col: c });
                }
            }
        }
        
        // 消除约50%的方块
        result.eliminatedCount = Math.floor(result.affectedPositions.length * 0.5);
    }
    
    /**
     * 设置能量获取倍率
     * @param multiplier 倍率
     */
    setEnergyGainMultiplier(multiplier: number): void {
        this._energyGainMultiplier = Math.max(0.1, multiplier); // 确保倍率不会太低
    }
    
    /**
     * 重置能量爆发等级
     */
    resetBurstLevel(): void {
        this._burstLevel = 1;
    }
    
    /**
     * 获取当前能量值
     */
    get currentEnergy(): number {
        return this._currentEnergy;
    }
    
    /**
     * 设置当前能量值
     */
    set currentEnergy(value: number) {
        this._currentEnergy = Math.max(0, Math.min(value, this._maxEnergy));
    }
    
    /**
     * 获取最大能量值
     */
    get maxEnergy(): number {
        return this._maxEnergy;
    }
    
    /**
     * 设置最大能量值
     */
    set maxEnergy(value: number) {
        this._maxEnergy = Math.max(1, value);
        this._burstThreshold = this._maxEnergy;
    }
    
    /**
     * 获取能量百分比
     */
    get energyPercentage(): number {
        return (this._currentEnergy / this._maxEnergy) * 100;
    }
    
    /**
     * 获取当前爆发等级
     */
    get burstLevel(): number {
        return this._burstLevel;
    }
}
