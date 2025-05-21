// ItemManager.ts - 道具系统管理类

/**
 * 道具类型枚举
 */
export enum ItemType {
    UNDO = 'undo',           // 悔棋道具
    REFRESH = 'refresh',     // 刷新道具
    ELIMINATE = 'eliminate', // 指定消除道具
    EXTRA_MOVES = 'extraMoves', // 额外步数道具
    COLOR_BOMB = 'colorBomb'  // 颜色炸弹道具
}

/**
 * 道具信息接口
 */
export interface ItemInfo {
    type: ItemType;          // 道具类型
    name: string;            // 道具名称
    description: string;     // 道具描述
    icon: string;            // 道具图标
    maxUsesPerLevel?: number; // 每关最大使用次数
    price: {                 // 价格信息
        currency: 'gold' | 'diamond'; // 货币类型
        amount: number;      // 价格
    };
}

/**
 * 道具管理类
 */
export class ItemManager {
    private _items: Map<ItemType, number> = new Map(); // 道具类型 -> 数量
    private _itemInfos: Map<ItemType, ItemInfo> = new Map(); // 道具类型 -> 信息
    private _usesInCurrentLevel: Map<ItemType, number> = new Map(); // 当前关卡中的使用次数
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化道具信息
        this.initializeItemInfos();
        
        // 初始化道具数量
        for (const type of Object.values(ItemType)) {
            this._items.set(type as ItemType, 0);
            this._usesInCurrentLevel.set(type as ItemType, 0);
        }
    }
    
    /**
     * 初始化道具信息
     */
    private initializeItemInfos(): void {
        // 悔棋道具
        this._itemInfos.set(ItemType.UNDO, {
            type: ItemType.UNDO,
            name: "悔棋",
            description: "撤销上一步操作",
            icon: "undo_icon.png",
            maxUsesPerLevel: 3,
            price: { currency: 'gold', amount: 100 }
        });
        
        // 刷新道具
        this._itemInfos.set(ItemType.REFRESH, {
            type: ItemType.REFRESH,
            name: "刷新",
            description: "重新排列当前所有方块",
            icon: "refresh_icon.png",
            price: { currency: 'gold', amount: 150 }
        });
        
        // 指定消除道具
        this._itemInfos.set(ItemType.ELIMINATE, {
            type: ItemType.ELIMINATE,
            name: "指定消除",
            description: "消除指定方块及周围方块",
            icon: "eliminate_icon.png",
            price: { currency: 'gold', amount: 200 }
        });
        
        // 额外步数道具
        this._itemInfos.set(ItemType.EXTRA_MOVES, {
            type: ItemType.EXTRA_MOVES,
            name: "额外步数",
            description: "增加5步移动次数",
            icon: "extra_moves_icon.png",
            price: { currency: 'gold', amount: 250 }
        });
        
        // 颜色炸弹道具
        this._itemInfos.set(ItemType.COLOR_BOMB, {
            type: ItemType.COLOR_BOMB,
            name: "颜色炸弹",
            description: "消除场上所有指定颜色的方块",
            icon: "color_bomb_icon.png",
            price: { currency: 'diamond', amount: 5 }
        });
    }
    
    /**
     * 添加道具
     * @param type 道具类型
     * @param count 数量
     * @returns 添加后的数量
     */
    addItem(type: ItemType, count: number): number {
        const currentCount = this._items.get(type) || 0;
        const newCount = currentCount + count;
        this._items.set(type, newCount);
        return newCount;
    }
    
    /**
     * 使用道具
     * @param type 道具类型
     * @returns 是否使用成功
     */
    useItem(type: ItemType): boolean {
        // 检查是否有足够的道具
        const currentCount = this._items.get(type) || 0;
        if (currentCount <= 0) {
            return false;
        }
        
        // 检查是否超过当前关卡的使用限制
        const itemInfo = this._itemInfos.get(type);
        if (itemInfo && itemInfo.maxUsesPerLevel) {
            const currentUses = this._usesInCurrentLevel.get(type) || 0;
            if (currentUses >= itemInfo.maxUsesPerLevel) {
                return false;
            }
        }
        
        // 减少道具数量
        this._items.set(type, currentCount - 1);
        
        // 增加使用次数
        const currentUses = this._usesInCurrentLevel.get(type) || 0;
        this._usesInCurrentLevel.set(type, currentUses + 1);
        
        return true;
    }
    
    /**
     * 获取道具数量
     * @param type 道具类型
     * @returns 数量
     */
    getItemCount(type: ItemType): number {
        return this._items.get(type) || 0;
    }
    
    /**
     * 获取道具信息
     * @param type 道具类型
     * @returns 道具信息
     */
    getItemInfo(type: ItemType): ItemInfo | undefined {
        return this._itemInfos.get(type);
    }
    
    /**
     * 获取所有道具信息
     * @returns 道具信息数组
     */
    getAllItemInfos(): ItemInfo[] {
        return Array.from(this._itemInfos.values());
    }
    
    /**
     * 重置当前关卡的使用次数
     */
    resetLevelUses(): void {
        for (const type of Object.values(ItemType)) {
            this._usesInCurrentLevel.set(type as ItemType, 0);
        }
    }
    
    /**
     * 检查道具是否可用
     * @param type 道具类型
     * @returns 是否可用
     */
    isItemAvailable(type: ItemType): boolean {
        // 检查是否有足够的道具
        const currentCount = this._items.get(type) || 0;
        if (currentCount <= 0) {
            return false;
        }
        
        // 检查是否超过当前关卡的使用限制
        const itemInfo = this._itemInfos.get(type);
        if (itemInfo && itemInfo.maxUsesPerLevel) {
            const currentUses = this._usesInCurrentLevel.get(type) || 0;
            if (currentUses >= itemInfo.maxUsesPerLevel) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 获取当前关卡中道具的剩余使用次数
     * @param type 道具类型
     * @returns 剩余使用次数
     */
    getRemainingUses(type: ItemType): number {
        const itemInfo = this._itemInfos.get(type);
        if (!itemInfo || !itemInfo.maxUsesPerLevel) {
            return Infinity;
        }
        
        const currentUses = this._usesInCurrentLevel.get(type) || 0;
        return Math.max(0, itemInfo.maxUsesPerLevel - currentUses);
    }
}
