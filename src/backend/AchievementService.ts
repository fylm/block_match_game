// AchievementService.ts - 成就与任务服务

/**
 * 成就类型枚举
 */
export enum AchievementType {
    LEVEL_COMPLETE = 'level_complete',   // 完成关卡
    SCORE = 'score',                     // 获得分数
    COMBO = 'combo',                     // 连击
    SPECIAL_BLOCK = 'special_block',     // 使用特殊方块
    ITEM_USE = 'item_use',               // 使用道具
    SOCIAL = 'social',                   // 社交相关
    COLLECTION = 'collection',           // 收集相关
    TIME = 'time'                        // 时间相关
}

/**
 * 成就信息接口
 */
export interface AchievementInfo {
    id: string;                  // 成就ID
    name: string;                // 成就名称
    description: string;         // 成就描述
    type: AchievementType;       // 成就类型
    icon: string;                // 成就图标
    target: number;              // 目标值
    current: number;             // 当前值
    isUnlocked: boolean;         // 是否已解锁
    unlockTime?: number;         // 解锁时间
    rewards: {                   // 奖励
        type: string;            // 奖励类型
        amount: number;          // 奖励数量
    }[];
    isHidden: boolean;           // 是否隐藏成就
}

/**
 * 任务类型枚举
 */
export enum TaskType {
    DAILY = 'daily',             // 每日任务
    WEEKLY = 'weekly',           // 每周任务
    SPECIAL = 'special'          // 特殊任务
}

/**
 * 任务信息接口
 */
export interface TaskInfo {
    id: string;                  // 任务ID
    name: string;                // 任务名称
    description: string;         // 任务描述
    type: TaskType;              // 任务类型
    icon: string;                // 任务图标
    target: number;              // 目标值
    current: number;             // 当前值
    isCompleted: boolean;        // 是否已完成
    isRewarded: boolean;         // 是否已领取奖励
    completeTime?: number;       // 完成时间
    expireTime: number;          // 过期时间
    rewards: {                   // 奖励
        type: string;            // 奖励类型
        amount: number;          // 奖励数量
    }[];
}

/**
 * 成就与任务服务类
 * 负责成就和任务的管理、进度追踪和奖励发放
 */
export class AchievementService {
    private _cloudBaseUrl: string = 'https://api.example.com/achievement'; // 云端API基础URL
    private _achievements: Map<string, AchievementInfo> = new Map();
    private _tasks: Map<string, TaskInfo> = new Map();
    private _lastDailyRefreshTime: number = 0;
    private _lastWeeklyRefreshTime: number = 0;
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化成就和任务
        this.initializeAchievements();
        this.initializeTasks();
        
        // 从本地存储加载数据
        this.loadData();
        
        // 检查任务刷新
        this.checkTaskRefresh();
    }
    
    /**
     * 初始化成就
     */
    private initializeAchievements(): void {
        // 关卡完成成就
        this.addAchievement({
            id: 'level_complete_10',
            name: '初露锋芒',
            description: '完成10个关卡',
            type: AchievementType.LEVEL_COMPLETE,
            icon: 'achievement_level_10.png',
            target: 10,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 500 }
            ],
            isHidden: false
        });
        
        this.addAchievement({
            id: 'level_complete_50',
            name: '闯关达人',
            description: '完成50个关卡',
            type: AchievementType.LEVEL_COMPLETE,
            icon: 'achievement_level_50.png',
            target: 50,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 2000 },
                { type: 'diamond', amount: 10 }
            ],
            isHidden: false
        });
        
        // 分数成就
        this.addAchievement({
            id: 'score_10000',
            name: '分数小能手',
            description: '累计获得10000分',
            type: AchievementType.SCORE,
            icon: 'achievement_score_10000.png',
            target: 10000,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 1000 }
            ],
            isHidden: false
        });
        
        this.addAchievement({
            id: 'score_100000',
            name: '分数王者',
            description: '累计获得100000分',
            type: AchievementType.SCORE,
            icon: 'achievement_score_100000.png',
            target: 100000,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 5000 },
                { type: 'diamond', amount: 20 }
            ],
            isHidden: false
        });
        
        // 连击成就
        this.addAchievement({
            id: 'combo_5',
            name: '连击新手',
            description: '达成5连击',
            type: AchievementType.COMBO,
            icon: 'achievement_combo_5.png',
            target: 5,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 300 }
            ],
            isHidden: false
        });
        
        this.addAchievement({
            id: 'combo_10',
            name: '连击大师',
            description: '达成10连击',
            type: AchievementType.COMBO,
            icon: 'achievement_combo_10.png',
            target: 10,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 1000 },
                { type: 'item_refresh', amount: 1 }
            ],
            isHidden: false
        });
        
        // 特殊方块成就
        this.addAchievement({
            id: 'special_block_10',
            name: '特殊方块收集者',
            description: '使用10个特殊方块',
            type: AchievementType.SPECIAL_BLOCK,
            icon: 'achievement_special_10.png',
            target: 10,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 500 }
            ],
            isHidden: false
        });
        
        // 道具使用成就
        this.addAchievement({
            id: 'item_use_20',
            name: '道具专家',
            description: '使用20次道具',
            type: AchievementType.ITEM_USE,
            icon: 'achievement_item_20.png',
            target: 20,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 800 },
                { type: 'item_undo', amount: 2 }
            ],
            isHidden: false
        });
        
        // 社交成就
        this.addAchievement({
            id: 'social_share_5',
            name: '分享达人',
            description: '分享游戏5次',
            type: AchievementType.SOCIAL,
            icon: 'achievement_share_5.png',
            target: 5,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 500 }
            ],
            isHidden: false
        });
        
        this.addAchievement({
            id: 'social_invite_3',
            name: '邀请达人',
            description: '邀请3位好友玩游戏',
            type: AchievementType.SOCIAL,
            icon: 'achievement_invite_3.png',
            target: 3,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 1000 },
                { type: 'diamond', amount: 5 }
            ],
            isHidden: false
        });
        
        // 收集成就
        this.addAchievement({
            id: 'collection_skin_3',
            name: '皮肤收藏家',
            description: '收集3种方块皮肤',
            type: AchievementType.COLLECTION,
            icon: 'achievement_skin_3.png',
            target: 3,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 1000 }
            ],
            isHidden: false
        });
        
        // 时间成就
        this.addAchievement({
            id: 'time_login_7',
            name: '忠实玩家',
            description: '连续登录7天',
            type: AchievementType.TIME,
            icon: 'achievement_login_7.png',
            target: 7,
            current: 0,
            isUnlocked: false,
            rewards: [
                { type: 'gold', amount: 1000 },
                { type: 'diamond', amount: 10 }
            ],
            isHidden: false
        });
    }
    
    /**
     * 初始化任务
     */
    private initializeTasks(): void {
        // 每日任务
        this.addTask({
            id: 'daily_play_3',
            name: '日常游戏',
            description: '今日完成3个关卡',
            type: TaskType.DAILY,
            icon: 'task_daily_play.png',
            target: 3,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextDailyResetTime(),
            rewards: [
                { type: 'gold', amount: 200 }
            ]
        });
        
        this.addTask({
            id: 'daily_score_1000',
            name: '日常得分',
            description: '今日获得1000分',
            type: TaskType.DAILY,
            icon: 'task_daily_score.png',
            target: 1000,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextDailyResetTime(),
            rewards: [
                { type: 'gold', amount: 150 }
            ]
        });
        
        this.addTask({
            id: 'daily_share',
            name: '日常分享',
            description: '今日分享游戏1次',
            type: TaskType.DAILY,
            icon: 'task_daily_share.png',
            target: 1,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextDailyResetTime(),
            rewards: [
                { type: 'gold', amount: 100 }
            ]
        });
        
        // 每周任务
        this.addTask({
            id: 'weekly_play_15',
            name: '周常游戏',
            description: '本周完成15个关卡',
            type: TaskType.WEEKLY,
            icon: 'task_weekly_play.png',
            target: 15,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextWeeklyResetTime(),
            rewards: [
                { type: 'gold', amount: 1000 },
                { type: 'diamond', amount: 5 }
            ]
        });
        
        this.addTask({
            id: 'weekly_score_10000',
            name: '周常得分',
            description: '本周获得10000分',
            type: TaskType.WEEKLY,
            icon: 'task_weekly_score.png',
            target: 10000,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextWeeklyResetTime(),
            rewards: [
                { type: 'gold', amount: 800 },
                { type: 'item_refresh', amount: 1 }
            ]
        });
        
        this.addTask({
            id: 'weekly_special_block_5',
            name: '周常特殊方块',
            description: '本周使用5个特殊方块',
            type: TaskType.WEEKLY,
            icon: 'task_weekly_special.png',
            target: 5,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: this.getNextWeeklyResetTime(),
            rewards: [
                { type: 'gold', amount: 500 },
                { type: 'item_eliminate', amount: 1 }
            ]
        });
        
        // 特殊任务
        this.addTask({
            id: 'special_invite_friend',
            name: '邀请好友',
            description: '邀请1位好友玩游戏',
            type: TaskType.SPECIAL,
            icon: 'task_special_invite.png',
            target: 1,
            current: 0,
            isCompleted: false,
            isRewarded: false,
            expireTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后过期
            rewards: [
                { type: 'gold', amount: 500 },
                { type: 'diamond', amount: 3 }
            ]
        });
    }
    
    /**
     * 添加成就
     * @param achievement 成就信息
     */
    private addAchievement(achievement: AchievementInfo): void {
        this._achievements.set(achievement.id, achievement);
    }
    
    /**
     * 添加任务
     * @param task 任务信息
     */
    private addTask(task: TaskInfo): void {
        this._tasks.set(task.id, task);
    }
    
    /**
     * 从本地存储加载数据
     */
    private loadData(): void {
        // 在实际实现中，这里会从微信存储或云端加载数据
        console.log('从本地存储加载成就和任务数据');
        
        try {
            // 模拟加载过程
            const achievementsStr = localStorage.getItem('achievements');
            const tasksStr = localStorage.getItem('tasks');
            const lastDailyRefreshTimeStr = localStorage.getItem('lastDailyRefreshTime');
            const lastWeeklyRefreshTimeStr = localStorage.getItem('lastWeeklyRefreshTime');
            
            if (achievementsStr) {
                const achievements = JSON.parse(achievementsStr);
                for (const [id, achievement] of Object.entries(achievements)) {
                    this._achievements.set(id, achievement as AchievementInfo);
                }
            }
            
            if (tasksStr) {
                const tasks = JSON.parse(tasksStr);
                for (const [id, task] of Object.entries(tasks)) {
                    this._tasks.set(id, task as TaskInfo);
                }
            }
            
            if (lastDailyRefreshTimeStr) {
                this._lastDailyRefreshTime = parseInt(lastDailyRefreshTimeStr);
            }
            
            if (lastWeeklyRefreshTimeStr) {
                this._lastWeeklyRefreshTime = parseInt(lastWeeklyRefreshTimeStr);
            }
        } catch (error) {
            console.error('加载成就和任务数据失败', error);
        }
    }
    
    /**
     * 保存数据到本地存储
     */
    private saveData(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存成就和任务数据到本地存储');
        
        try {
            // 保存成就
            const achievements = Object.fromEntries(this._achievements.entries());
            localStorage.setItem('achievements', JSON.stringify(achievements));
            
            // 保存任务
            const tasks = Object.fromEntries(this._tasks.entries());
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // 保存刷新时间
            localStorage.setItem('lastDailyRefreshTime', this._lastDailyRefreshTime.toString());
            localStorage.setItem('lastWeeklyRefreshTime', this._lastWeeklyRefreshTime.toString());
        } catch (error) {
            console.error('保存成就和任务数据失败', error);
        }
    }
    
    /**
     * 检查任务刷新
     */
    private checkTaskRefresh(): void {
        const now = Date.now();
        
        // 检查每日任务刷新
        if (now >= this.getNextDailyResetTime(this._lastDailyRefreshTime)) {
            this.refreshDailyTasks();
        }
        
        // 检查每周任务刷新
        if (now >= this.getNextWeeklyResetTime(this._lastWeeklyRefreshTime)) {
            this.refreshWeeklyTasks();
        }
    }
    
    /**
     * 刷新每日任务
     */
    private refreshDailyTasks(): void {
        console.log('刷新每日任务');
        
        // 遍历所有每日任务
        for (const [id, task] of this._tasks.entries()) {
            if (task.type === TaskType.DAILY) {
                // 重置任务
                task.current = 0;
                task.isCompleted = false;
                task.isRewarded = false;
                task.completeTime = undefined;
                task.expireTime = this.getNextDailyResetTime();
            }
        }
        
        // 更新刷新时间
        this._lastDailyRefreshTime = Date.now();
        
        // 保存数据
        this.saveData();
    }
    
    /**
     * 刷新每周任务
     */
    private refreshWeeklyTasks(): void {
        console.log('刷新每周任务');
        
        // 遍历所有每周任务
        for (const [id, task] of this._tasks.entries()) {
            if (task.type === TaskType.WEEKLY) {
                // 重置任务
                task.current = 0;
                task.isCompleted = false;
                task.isRewarded = false;
                task.completeTime = undefined;
                task.expireTime = this.getNextWeeklyResetTime();
            }
        }
        
        // 更新刷新时间
        this._lastWeeklyRefreshTime = Date.now();
        
        // 保存数据
        this.saveData();
    }
    
    /**
     * 获取下一个每日重置时间
     * @param fromTime 起始时间（可选，默认为当前时间）
     * @returns 下一个重置时间戳
     */
    private getNextDailyResetTime(fromTime?: number): number {
        const now = fromTime || Date.now();
        const date = new Date(now);
        date.setHours(0, 0, 0, 0); // 设置为当天0点
        date.setDate(date.getDate() + 1); // 下一天
        return date.getTime();
    }
    
    /**
     * 获取下一个每周重置时间
     * @param fromTime 起始时间（可选，默认为当前时间）
     * @returns 下一个重置时间戳
     */
    private getNextWeeklyResetTime(fromTime?: number): number {
        const now = fromTime || Date.now();
        const date = new Date(now);
        date.setHours(0, 0, 0, 0); // 设置为当天0点
        date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1); // 下一个周一
        return date.getTime();
    }
    
    /**
     * 更新成就进度
     * @param type 成就类型
     * @param value 进度值
     * @param absolute 是否为绝对值（默认为false，表示增量）
     * @returns 新解锁的成就ID数组
     */
    updateAchievementProgress(type: AchievementType, value: number, absolute: boolean = false): string[] {
        console.log(`更新成就进度: 类型${type}, 值${value}, 绝对值${absolute}`);
        
        const unlockedAchievements: string[] = [];
        
        // 遍历所有成就
        for (const [id, achievement] of this._achievements.entries()) {
            // 只处理指定类型且未解锁的成就
            if (achievement.type === type && !achievement.isUnlocked) {
                // 更新进度
                if (absolute) {
                    achievement.current = value;
                } else {
                    achievement.current += value;
                }
                
                // 检查是否达成
                if (achievement.current >= achievement.target) {
                    // 解锁成就
                    achievement.isUnlocked = true;
                    achievement.unlockTime = Date.now();
                    unlockedAchievements.push(id);
                    
                    console.log(`解锁成就: ${id}`);
                }
            }
        }
        
        // 如果有新解锁的成就，保存数据
        if (unlockedAchievements.length > 0) {
            this.saveData();
        }
        
        return unlockedAchievements;
    }
    
    /**
     * 更新任务进度
     * @param id 任务ID
     * @param value 进度值
     * @param absolute 是否为绝对值（默认为false，表示增量）
     * @returns 是否完成任务
     */
    updateTaskProgress(id: string, value: number, absolute: boolean = false): boolean {
        console.log(`更新任务进度: ID${id}, 值${value}, 绝对值${absolute}`);
        
        // 获取任务
        const task = this._tasks.get(id);
        if (!task) {
            console.error(`任务 ${id} 不存在`);
            return false;
        }
        
        // 检查任务是否已完成
        if (task.isCompleted) {
            console.log(`任务 ${id} 已完成`);
            return true;
        }
        
        // 检查任务是否已过期
        if (Date.now() > task.expireTime) {
            console.log(`任务 ${id} 已过期`);
            return false;
        }
        
        // 更新进度
        if (absolute) {
            task.current = value;
        } else {
            task.current += value;
        }
        
        // 检查是否完成
        if (task.current >= task.target) {
            task.isCompleted = true;
            task.completeTime = Date.now();
            
            console.log(`完成任务: ${id}`);
            
            // 保存数据
            this.saveData();
            
            return true;
        }
        
        // 保存数据
        this.saveData();
        
        return false;
    }
    
    /**
     * 批量更新任务进度
     * @param type 任务类型
     * @param value 进度值
     * @param absolute 是否为绝对值（默认为false，表示增量）
     * @returns 新完成的任务ID数组
     */
    updateTasksProgress(type: string, value: number, absolute: boolean = false): string[] {
        console.log(`批量更新任务进度: 类型${type}, 值${value}, 绝对值${absolute}`);
        
        const completedTasks: string[] = [];
        
        // 遍历所有任务
        for (const [id, task] of this._tasks.entries()) {
            // 检查任务ID是否包含指定类型
            if (id.includes(type) && !task.isCompleted && Date.now() <= task.expireTime) {
                // 更新进度
                if (absolute) {
                    task.current = value;
                } else {
                    task.current += value;
                }
                
                // 检查是否完成
                if (task.current >= task.target) {
                    task.isCompleted = true;
                    task.completeTime = Date.now();
                    completedTasks.push(id);
                    
                    console.log(`完成任务: ${id}`);
                }
            }
        }
        
        // 如果有新完成的任务，保存数据
        if (completedTasks.length > 0) {
            this.saveData();
        }
        
        return completedTasks;
    }
    
    /**
     * 领取任务奖励
     * @param id 任务ID
     * @returns 奖励内容
     */
    claimTaskReward(id: string): { type: string, amount: number }[] | null {
        console.log(`领取任务奖励: ${id}`);
        
        // 获取任务
        const task = this._tasks.get(id);
        if (!task) {
            console.error(`任务 ${id} 不存在`);
            return null;
        }
        
        // 检查任务是否已完成
        if (!task.isCompleted) {
            console.error(`任务 ${id} 未完成`);
            return null;
        }
        
        // 检查奖励是否已领取
        if (task.isRewarded) {
            console.error(`任务 ${id} 奖励已领取`);
            return null;
        }
        
        // 标记奖励已领取
        task.isRewarded = true;
        
        // 保存数据
        this.saveData();
        
        // 返回奖励内容
        return task.rewards;
    }
    
    /**
     * 领取成就奖励
     * @param id 成就ID
     * @returns 奖励内容
     */
    claimAchievementReward(id: string): { type: string, amount: number }[] | null {
        console.log(`领取成就奖励: ${id}`);
        
        // 获取成就
        const achievement = this._achievements.get(id);
        if (!achievement) {
            console.error(`成就 ${id} 不存在`);
            return null;
        }
        
        // 检查成就是否已解锁
        if (!achievement.isUnlocked) {
            console.error(`成就 ${id} 未解锁`);
            return null;
        }
        
        // 返回奖励内容
        return achievement.rewards;
    }
    
    /**
     * 获取所有成就
     * @param includeHidden 是否包含隐藏成就
     * @returns 成就列表
     */
    getAllAchievements(includeHidden: boolean = false): AchievementInfo[] {
        const achievements = Array.from(this._achievements.values());
        
        if (!includeHidden) {
            return achievements.filter(achievement => !achievement.isHidden);
        }
        
        return achievements;
    }
    
    /**
     * 获取所有任务
     * @param type 任务类型（可选）
     * @returns 任务列表
     */
    getAllTasks(type?: TaskType): TaskInfo[] {
        const tasks = Array.from(this._tasks.values());
        
        if (type) {
            return tasks.filter(task => task.type === type);
        }
        
        return tasks;
    }
    
    /**
     * 获取已解锁的成就
     * @returns 成就列表
     */
    getUnlockedAchievements(): AchievementInfo[] {
        return Array.from(this._achievements.values()).filter(achievement => achievement.isUnlocked);
    }
    
    /**
     * 获取已完成的任务
     * @param type 任务类型（可选）
     * @returns 任务列表
     */
    getCompletedTasks(type?: TaskType): TaskInfo[] {
        const tasks = Array.from(this._tasks.values()).filter(task => task.isCompleted);
        
        if (type) {
            return tasks.filter(task => task.type === type);
        }
        
        return tasks;
    }
    
    /**
     * 获取可领取奖励的任务
     * @returns 任务列表
     */
    getRewardableTasks(): TaskInfo[] {
        return Array.from(this._tasks.values()).filter(task => task.isCompleted && !task.isRewarded);
    }
    
    /**
     * 获取成就
     * @param id 成就ID
     * @returns 成就信息
     */
    getAchievement(id: string): AchievementInfo | undefined {
        return this._achievements.get(id);
    }
    
    /**
     * 获取任务
     * @param id 任务ID
     * @returns 任务信息
     */
    getTask(id: string): TaskInfo | undefined {
        return this._tasks.get(id);
    }
    
    /**
     * 同步数据到云端
     * @returns 是否同步成功
     */
    async syncToCloud(): Promise<boolean> {
        console.log('同步成就和任务数据到云端');
        
        try {
            // 在实际实现中，这里会调用云端API上传数据
            // const response = await fetch(`${this._cloudBaseUrl}/sync`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${sessionKey}`
            //     },
            //     body: JSON.stringify({
            //         achievements: Object.fromEntries(this._achievements.entries()),
            //         tasks: Object.fromEntries(this._tasks.entries()),
            //         lastDailyRefreshTime: this._lastDailyRefreshTime,
            //         lastWeeklyRefreshTime: this._lastWeeklyRefreshTime,
            //         timestamp: Date.now()
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`同步失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟同步成功
            console.log('成就和任务数据同步成功');
            
            return true;
        } catch (error) {
            console.error('同步成就和任务数据失败', error);
            return false;
        }
    }
}
