// AnalyticsService.ts - 数据埋点与分析服务

/**
 * 事件类型枚举
 */
export enum EventType {
    GAME_START = 'game_start',           // 游戏启动
    GAME_EXIT = 'game_exit',             // 游戏退出
    LEVEL_START = 'level_start',         // 关卡开始
    LEVEL_COMPLETE = 'level_complete',   // 关卡完成
    LEVEL_FAIL = 'level_fail',           // 关卡失败
    ITEM_USE = 'item_use',               // 道具使用
    PURCHASE = 'purchase',               // 购买
    AD_SHOW = 'ad_show',                 // 广告展示
    AD_CLICK = 'ad_click',               // 广告点击
    AD_REWARD = 'ad_reward',             // 广告奖励
    SHARE = 'share',                     // 分享
    LOGIN = 'login',                     // 登录
    REGISTER = 'register',               // 注册
    TUTORIAL = 'tutorial',               // 教程
    ERROR = 'error',                     // 错误
    CUSTOM = 'custom'                    // 自定义事件
}

/**
 * 事件参数接口
 */
export interface EventParams {
    [key: string]: string | number | boolean;
}

/**
 * 事件数据接口
 */
export interface EventData {
    type: EventType | string;            // 事件类型
    params: EventParams;                 // 事件参数
    timestamp: number;                   // 时间戳
    sessionId: string;                   // 会话ID
    userId?: string;                     // 用户ID（可选）
}

/**
 * 数据埋点与分析服务类
 * 负责用户行为数据的收集、上报和分析
 */
export class AnalyticsService {
    private _cloudBaseUrl: string = 'https://api.example.com/analytics'; // 云端API基础URL
    private _sessionId: string = ''; // 会话ID
    private _userId: string = ''; // 用户ID
    private _isEnabled: boolean = true; // 是否启用
    private _eventQueue: EventData[] = []; // 事件队列
    private _flushInterval: number = 10000; // 上报间隔（毫秒）
    private _flushTimer: any = null; // 上报定时器
    private _maxQueueSize: number = 100; // 最大队列大小
    private _isReporting: boolean = false; // 是否正在上报
    
    /**
     * 构造函数
     */
    constructor() {
        // 生成会话ID
        this._sessionId = this.generateSessionId();
        
        // 启动上报定时器
        this.startFlushTimer();
        
        // 记录启动事件
        this.trackEvent(EventType.GAME_START, {
            version: '1.0.0',
            platform: 'wechat_mini_game',
            deviceInfo: JSON.stringify({
                brand: 'unknown',
                model: 'unknown',
                system: 'unknown',
                platform: 'unknown'
            })
        });
    }
    
    /**
     * 生成会话ID
     * @returns 会话ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    }
    
    /**
     * 启动上报定时器
     */
    private startFlushTimer(): void {
        // 清除可能存在的旧定时器
        if (this._flushTimer) {
            clearInterval(this._flushTimer);
        }
        
        // 设置新定时器
        this._flushTimer = setInterval(() => {
            this.flushEvents();
        }, this._flushInterval);
    }
    
    /**
     * 停止上报定时器
     */
    private stopFlushTimer(): void {
        if (this._flushTimer) {
            clearInterval(this._flushTimer);
            this._flushTimer = null;
        }
    }
    
    /**
     * 上报事件
     * @returns 是否上报成功
     */
    async flushEvents(): Promise<boolean> {
        // 如果队列为空或已禁用或正在上报，则跳过
        if (this._eventQueue.length === 0 || !this._isEnabled || this._isReporting) {
            return true;
        }
        
        console.log(`上报${this._eventQueue.length}个事件`);
        
        this._isReporting = true;
        
        try {
            // 复制队列
            const events = [...this._eventQueue];
            
            // 在实际实现中，这里会调用云端API上报事件
            // const response = await fetch(`${this._cloudBaseUrl}/report`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         events,
            //         timestamp: Date.now()
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`上报失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟上报成功
            console.log('事件上报成功');
            
            // 清空队列
            this._eventQueue = [];
            
            this._isReporting = false;
            return true;
        } catch (error) {
            console.error('上报事件失败', error);
            this._isReporting = false;
            return false;
        }
    }
    
    /**
     * 记录事件
     * @param type 事件类型
     * @param params 事件参数
     * @returns 是否记录成功
     */
    trackEvent(type: EventType | string, params: EventParams = {}): boolean {
        // 如果已禁用，则跳过
        if (!this._isEnabled) {
            return false;
        }
        
        console.log(`记录事件: ${type}`, params);
        
        // 创建事件数据
        const eventData: EventData = {
            type,
            params,
            timestamp: Date.now(),
            sessionId: this._sessionId
        };
        
        // 添加用户ID（如果有）
        if (this._userId) {
            eventData.userId = this._userId;
        }
        
        // 添加到队列
        this._eventQueue.push(eventData);
        
        // 如果队列已满，立即上报
        if (this._eventQueue.length >= this._maxQueueSize) {
            this.flushEvents();
        }
        
        return true;
    }
    
    /**
     * 记录关卡开始事件
     * @param levelId 关卡ID
     * @param params 附加参数
     */
    trackLevelStart(levelId: number, params: EventParams = {}): void {
        this.trackEvent(EventType.LEVEL_START, {
            levelId,
            ...params
        });
    }
    
    /**
     * 记录关卡完成事件
     * @param levelId 关卡ID
     * @param score 分数
     * @param stars 星星数
     * @param timeUsed 使用时间（秒）
     * @param movesUsed 使用步数
     * @param params 附加参数
     */
    trackLevelComplete(levelId: number, score: number, stars: number, timeUsed: number, movesUsed: number, params: EventParams = {}): void {
        this.trackEvent(EventType.LEVEL_COMPLETE, {
            levelId,
            score,
            stars,
            timeUsed,
            movesUsed,
            ...params
        });
    }
    
    /**
     * 记录关卡失败事件
     * @param levelId 关卡ID
     * @param score 分数
     * @param timeUsed 使用时间（秒）
     * @param movesUsed 使用步数
     * @param reason 失败原因
     * @param params 附加参数
     */
    trackLevelFail(levelId: number, score: number, timeUsed: number, movesUsed: number, reason: string, params: EventParams = {}): void {
        this.trackEvent(EventType.LEVEL_FAIL, {
            levelId,
            score,
            timeUsed,
            movesUsed,
            reason,
            ...params
        });
    }
    
    /**
     * 记录道具使用事件
     * @param itemId 道具ID
     * @param itemType 道具类型
     * @param levelId 关卡ID
     * @param params 附加参数
     */
    trackItemUse(itemId: string, itemType: string, levelId: number, params: EventParams = {}): void {
        this.trackEvent(EventType.ITEM_USE, {
            itemId,
            itemType,
            levelId,
            ...params
        });
    }
    
    /**
     * 记录购买事件
     * @param productId 商品ID
     * @param productType 商品类型
     * @param price 价格
     * @param currency 货币类型
     * @param params 附加参数
     */
    trackPurchase(productId: string, productType: string, price: number, currency: string, params: EventParams = {}): void {
        this.trackEvent(EventType.PURCHASE, {
            productId,
            productType,
            price,
            currency,
            ...params
        });
    }
    
    /**
     * 记录广告展示事件
     * @param adType 广告类型
     * @param placement 广告位置
     * @param params 附加参数
     */
    trackAdShow(adType: string, placement: string, params: EventParams = {}): void {
        this.trackEvent(EventType.AD_SHOW, {
            adType,
            placement,
            ...params
        });
    }
    
    /**
     * 记录广告点击事件
     * @param adType 广告类型
     * @param placement 广告位置
     * @param params 附加参数
     */
    trackAdClick(adType: string, placement: string, params: EventParams = {}): void {
        this.trackEvent(EventType.AD_CLICK, {
            adType,
            placement,
            ...params
        });
    }
    
    /**
     * 记录广告奖励事件
     * @param adType 广告类型
     * @param placement 广告位置
     * @param rewardType 奖励类型
     * @param rewardAmount 奖励数量
     * @param params 附加参数
     */
    trackAdReward(adType: string, placement: string, rewardType: string, rewardAmount: number, params: EventParams = {}): void {
        this.trackEvent(EventType.AD_REWARD, {
            adType,
            placement,
            rewardType,
            rewardAmount,
            ...params
        });
    }
    
    /**
     * 记录分享事件
     * @param shareType 分享类型
     * @param content 分享内容
     * @param params 附加参数
     */
    trackShare(shareType: string, content: string, params: EventParams = {}): void {
        this.trackEvent(EventType.SHARE, {
            shareType,
            content,
            ...params
        });
    }
    
    /**
     * 记录登录事件
     * @param method 登录方式
     * @param userId 用户ID
     * @param params 附加参数
     */
    trackLogin(method: string, userId: string, params: EventParams = {}): void {
        // 设置用户ID
        this._userId = userId;
        
        this.trackEvent(EventType.LOGIN, {
            method,
            userId,
            ...params
        });
    }
    
    /**
     * 记录错误事件
     * @param errorCode 错误代码
     * @param errorMessage 错误信息
     * @param stack 堆栈信息
     * @param params 附加参数
     */
    trackError(errorCode: string, errorMessage: string, stack?: string, params: EventParams = {}): void {
        this.trackEvent(EventType.ERROR, {
            errorCode,
            errorMessage,
            stack: stack || '',
            ...params
        });
    }
    
    /**
     * 记录自定义事件
     * @param eventName 事件名称
     * @param params 事件参数
     */
    trackCustomEvent(eventName: string, params: EventParams = {}): void {
        this.trackEvent(`${EventType.CUSTOM}_${eventName}`, params);
    }
    
    /**
     * 设置用户ID
     * @param userId 用户ID
     */
    setUserId(userId: string): void {
        this._userId = userId;
    }
    
    /**
     * 设置上报间隔
     * @param interval 间隔（毫秒）
     */
    setFlushInterval(interval: number): void {
        this._flushInterval = interval;
        
        // 重启上报定时器
        this.startFlushTimer();
    }
    
    /**
     * 设置最大队列大小
     * @param size 大小
     */
    setMaxQueueSize(size: number): void {
        this._maxQueueSize = size;
    }
    
    /**
     * 启用数据埋点
     */
    enable(): void {
        this._isEnabled = true;
    }
    
    /**
     * 禁用数据埋点
     */
    disable(): void {
        this._isEnabled = false;
    }
    
    /**
     * 销毁服务
     */
    destroy(): void {
        // 记录退出事件
        this.trackEvent(EventType.GAME_EXIT, {
            sessionDuration: (Date.now() - parseInt(this._sessionId.split('_')[1])) / 1000
        });
        
        // 立即上报所有事件
        this.flushEvents();
        
        // 停止上报定时器
        this.stopFlushTimer();
    }
}
