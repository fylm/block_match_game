// AntiAddictionService.ts - 防沉迷系统

/**
 * 用户年龄组枚举
 */
export enum AgeGroup {
    UNKNOWN = 'unknown',     // 未知年龄
    CHILD = 'child',         // 儿童（0-7岁）
    JUNIOR = 'junior',       // 青少年（8-15岁）
    SENIOR = 'senior',       // 高中生（16-17岁）
    ADULT = 'adult'          // 成人（18岁及以上）
}

/**
 * 实名认证状态枚举
 */
export enum VerificationStatus {
    NONE = 'none',           // 未认证
    PENDING = 'pending',     // 认证中
    VERIFIED = 'verified',   // 已认证
    FAILED = 'failed'        // 认证失败
}

/**
 * 用户实名信息接口
 */
export interface UserVerificationInfo {
    status: VerificationStatus;  // 认证状态
    ageGroup: AgeGroup;          // 年龄组
    verifiedAt?: number;         // 认证时间
    idCardType?: string;         // 证件类型
    idCardNo?: string;           // 证件号码（脱敏）
    realName?: string;           // 真实姓名（脱敏）
}

/**
 * 游戏时间限制接口
 */
export interface PlayTimeLimit {
    dailyLimit: number;          // 每日限制（分钟）
    weeklyLimit: number;         // 每周限制（分钟）
    nightForbidden: boolean;     // 是否禁止夜间游戏（22:00-8:00）
    holidayExtra: number;        // 节假日额外时间（分钟）
}

/**
 * 防沉迷系统类
 * 负责用户实名认证和游戏时间限制
 */
export class AntiAddictionService {
    private _cloudBaseUrl: string = 'https://api.example.com/anti-addiction'; // 云端API基础URL
    private _userInfo: UserVerificationInfo = {
        status: VerificationStatus.NONE,
        ageGroup: AgeGroup.UNKNOWN
    };
    private _playTimeLimits: Map<AgeGroup, PlayTimeLimit> = new Map();
    private _todayPlayTime: number = 0; // 今日游戏时间（分钟）
    private _weekPlayTime: number = 0; // 本周游戏时间（分钟）
    private _lastPlayDate: string = ''; // 上次游戏日期（YYYY-MM-DD）
    private _gameStartTime: number = 0; // 本次游戏开始时间
    private _isPlaying: boolean = false; // 是否正在游戏
    private _checkInterval: number = 60000; // 检查间隔（毫秒）
    private _checkTimer: any = null; // 检查定时器
    private _onTimeLimitCallback: ((remainingMinutes: number) => void) | null = null; // 时间限制回调
    private _onForbiddenCallback: (() => void) | null = null; // 禁止游戏回调
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化游戏时间限制
        this.initializePlayTimeLimits();
        
        // 从本地存储加载数据
        this.loadData();
        
        // 检查日期变更
        this.checkDateChange();
    }
    
    /**
     * 初始化游戏时间限制
     */
    private initializePlayTimeLimits(): void {
        // 设置各年龄组的游戏时间限制
        
        // 儿童（0-7岁）
        this._playTimeLimits.set(AgeGroup.CHILD, {
            dailyLimit: 40, // 每日40分钟
            weeklyLimit: 280, // 每周280分钟
            nightForbidden: true, // 禁止夜间游戏
            holidayExtra: 20 // 节假日额外20分钟
        });
        
        // 青少年（8-15岁）
        this._playTimeLimits.set(AgeGroup.JUNIOR, {
            dailyLimit: 60, // 每日60分钟
            weeklyLimit: 420, // 每周420分钟
            nightForbidden: true, // 禁止夜间游戏
            holidayExtra: 30 // 节假日额外30分钟
        });
        
        // 高中生（16-17岁）
        this._playTimeLimits.set(AgeGroup.SENIOR, {
            dailyLimit: 120, // 每日120分钟
            weeklyLimit: 840, // 每周840分钟
            nightForbidden: true, // 禁止夜间游戏
            holidayExtra: 60 // 节假日额外60分钟
        });
        
        // 成人（18岁及以上）
        this._playTimeLimits.set(AgeGroup.ADULT, {
            dailyLimit: Infinity, // 无限制
            weeklyLimit: Infinity, // 无限制
            nightForbidden: false, // 不禁止夜间游戏
            holidayExtra: 0 // 无额外时间
        });
        
        // 未知年龄（默认按青少年处理）
        this._playTimeLimits.set(AgeGroup.UNKNOWN, {
            dailyLimit: 60, // 每日60分钟
            weeklyLimit: 420, // 每周420分钟
            nightForbidden: true, // 禁止夜间游戏
            holidayExtra: 30 // 节假日额外30分钟
        });
    }
    
    /**
     * 从本地存储加载数据
     */
    private loadData(): void {
        // 在实际实现中，这里会从微信存储或云端加载数据
        console.log('从本地存储加载防沉迷数据');
        
        try {
            // 模拟加载过程
            const userInfoStr = localStorage.getItem('antiAddiction_userInfo');
            const todayPlayTimeStr = localStorage.getItem('antiAddiction_todayPlayTime');
            const weekPlayTimeStr = localStorage.getItem('antiAddiction_weekPlayTime');
            const lastPlayDateStr = localStorage.getItem('antiAddiction_lastPlayDate');
            
            if (userInfoStr) {
                this._userInfo = JSON.parse(userInfoStr);
            }
            
            if (todayPlayTimeStr) {
                this._todayPlayTime = parseInt(todayPlayTimeStr);
            }
            
            if (weekPlayTimeStr) {
                this._weekPlayTime = parseInt(weekPlayTimeStr);
            }
            
            if (lastPlayDateStr) {
                this._lastPlayDate = lastPlayDateStr;
            }
        } catch (error) {
            console.error('加载防沉迷数据失败', error);
        }
    }
    
    /**
     * 保存数据到本地存储
     */
    private saveData(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存防沉迷数据到本地存储');
        
        try {
            // 保存用户信息
            localStorage.setItem('antiAddiction_userInfo', JSON.stringify(this._userInfo));
            
            // 保存游戏时间
            localStorage.setItem('antiAddiction_todayPlayTime', this._todayPlayTime.toString());
            localStorage.setItem('antiAddiction_weekPlayTime', this._weekPlayTime.toString());
            localStorage.setItem('antiAddiction_lastPlayDate', this._lastPlayDate);
        } catch (error) {
            console.error('保存防沉迷数据失败', error);
        }
    }
    
    /**
     * 检查日期变更
     */
    private checkDateChange(): void {
        const today = this.getDateString();
        
        // 如果是新的一天
        if (this._lastPlayDate !== today) {
            console.log(`日期变更: ${this._lastPlayDate} -> ${today}`);
            
            // 重置今日游戏时间
            this._todayPlayTime = 0;
            
            // 如果是新的一周（周一）
            if (new Date().getDay() === 1 && this._lastPlayDate && new Date(this._lastPlayDate).getDay() !== 1) {
                console.log('新的一周开始');
                
                // 重置本周游戏时间
                this._weekPlayTime = 0;
            }
            
            // 更新上次游戏日期
            this._lastPlayDate = today;
            
            // 保存数据
            this.saveData();
        }
    }
    
    /**
     * 获取当前日期字符串（YYYY-MM-DD）
     * @returns 日期字符串
     */
    private getDateString(): string {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    /**
     * 检查是否为节假日
     * @returns 是否为节假日
     */
    private isHoliday(): boolean {
        // 在实际实现中，这里会根据日期判断是否为节假日
        // 可以通过API获取节假日信息，或者使用预设的节假日列表
        
        // 这里简化为周末视为节假日
        const day = new Date().getDay();
        return day === 0 || day === 6;
    }
    
    /**
     * 检查是否为夜间禁止时段
     * @returns 是否为夜间禁止时段
     */
    private isNightForbiddenTime(): boolean {
        const hour = new Date().getHours();
        return hour >= 22 || hour < 8;
    }
    
    /**
     * 获取当前用户的游戏时间限制
     * @returns 游戏时间限制
     */
    private getCurrentPlayTimeLimit(): PlayTimeLimit {
        const ageGroup = this._userInfo.ageGroup;
        return this._playTimeLimits.get(ageGroup) || this._playTimeLimits.get(AgeGroup.UNKNOWN)!;
    }
    
    /**
     * 获取今日剩余游戏时间（分钟）
     * @returns 剩余时间
     */
    getRemainingPlayTime(): number {
        const limit = this.getCurrentPlayTimeLimit();
        
        // 计算基础限制
        let dailyLimit = limit.dailyLimit;
        
        // 如果是节假日，增加额外时间
        if (this.isHoliday()) {
            dailyLimit += limit.holidayExtra;
        }
        
        // 计算剩余时间
        return Math.max(0, dailyLimit - this._todayPlayTime);
    }
    
    /**
     * 检查是否可以游戏
     * @returns 是否可以游戏
     */
    canPlay(): boolean {
        // 如果是成人，直接允许
        if (this._userInfo.ageGroup === AgeGroup.ADULT) {
            return true;
        }
        
        const limit = this.getCurrentPlayTimeLimit();
        
        // 检查夜间禁止
        if (limit.nightForbidden && this.isNightForbiddenTime()) {
            console.log('当前为夜间禁止时段');
            return false;
        }
        
        // 检查每日限制
        if (this._todayPlayTime >= limit.dailyLimit) {
            console.log('已达到每日游戏时间限制');
            return false;
        }
        
        // 检查每周限制
        if (this._weekPlayTime >= limit.weeklyLimit) {
            console.log('已达到每周游戏时间限制');
            return false;
        }
        
        return true;
    }
    
    /**
     * 开始游戏会话
     * @param onTimeLimit 时间限制回调
     * @param onForbidden 禁止游戏回调
     * @returns 是否成功开始
     */
    startGameSession(onTimeLimit?: (remainingMinutes: number) => void, onForbidden?: () => void): boolean {
        // 检查是否可以游戏
        if (!this.canPlay()) {
            if (onForbidden) {
                onForbidden();
            }
            return false;
        }
        
        console.log('开始游戏会话');
        
        // 记录回调
        this._onTimeLimitCallback = onTimeLimit || null;
        this._onForbiddenCallback = onForbidden || null;
        
        // 记录开始时间
        this._gameStartTime = Date.now();
        this._isPlaying = true;
        
        // 启动检查定时器
        this.startCheckTimer();
        
        return true;
    }
    
    /**
     * 结束游戏会话
     */
    endGameSession(): void {
        if (!this._isPlaying) {
            return;
        }
        
        console.log('结束游戏会话');
        
        // 计算本次游戏时间（分钟）
        const playTimeMinutes = Math.floor((Date.now() - this._gameStartTime) / 60000);
        
        // 更新游戏时间
        this._todayPlayTime += playTimeMinutes;
        this._weekPlayTime += playTimeMinutes;
        
        // 停止检查定时器
        this.stopCheckTimer();
        
        // 重置状态
        this._isPlaying = false;
        this._gameStartTime = 0;
        
        // 保存数据
        this.saveData();
    }
    
    /**
     * 启动检查定时器
     */
    private startCheckTimer(): void {
        // 清除可能存在的旧定时器
        if (this._checkTimer) {
            clearInterval(this._checkTimer);
        }
        
        // 设置新定时器
        this._checkTimer = setInterval(() => {
            this.checkPlayTime();
        }, this._checkInterval);
    }
    
    /**
     * 停止检查定时器
     */
    private stopCheckTimer(): void {
        if (this._checkTimer) {
            clearInterval(this._checkTimer);
            this._checkTimer = null;
        }
    }
    
    /**
     * 检查游戏时间
     */
    private checkPlayTime(): void {
        if (!this._isPlaying) {
            return;
        }
        
        // 检查日期变更
        this.checkDateChange();
        
        // 计算当前游戏时间（分钟）
        const currentPlayTimeMinutes = Math.floor((Date.now() - this._gameStartTime) / 60000);
        const totalTodayPlayTime = this._todayPlayTime + currentPlayTimeMinutes;
        
        // 获取时间限制
        const limit = this.getCurrentPlayTimeLimit();
        let dailyLimit = limit.dailyLimit;
        
        // 如果是节假日，增加额外时间
        if (this.isHoliday()) {
            dailyLimit += limit.holidayExtra;
        }
        
        // 计算剩余时间
        const remainingMinutes = Math.max(0, dailyLimit - totalTodayPlayTime);
        
        // 如果剩余时间不足15分钟，触发提醒
        if (remainingMinutes <= 15 && remainingMinutes > 0 && this._onTimeLimitCallback) {
            this._onTimeLimitCallback(remainingMinutes);
        }
        
        // 如果已达到限制或进入夜间禁止时段，强制结束游戏
        if (totalTodayPlayTime >= dailyLimit || (limit.nightForbidden && this.isNightForbiddenTime())) {
            console.log('游戏时间已达到限制或进入夜间禁止时段，强制结束游戏');
            
            // 更新游戏时间
            this._todayPlayTime += currentPlayTimeMinutes;
            this._weekPlayTime += currentPlayTimeMinutes;
            
            // 停止检查定时器
            this.stopCheckTimer();
            
            // 重置状态
            this._isPlaying = false;
            this._gameStartTime = 0;
            
            // 保存数据
            this.saveData();
            
            // 触发禁止游戏回调
            if (this._onForbiddenCallback) {
                this._onForbiddenCallback();
            }
        }
    }
    
    /**
     * 提交实名认证
     * @param realName 真实姓名
     * @param idCardType 证件类型
     * @param idCardNo 证件号码
     * @returns 是否提交成功
     */
    async submitVerification(realName: string, idCardType: string, idCardNo: string): Promise<boolean> {
        console.log('提交实名认证');
        
        // 更新状态为认证中
        this._userInfo.status = VerificationStatus.PENDING;
        this.saveData();
        
        try {
            // 在实际实现中，这里会调用云端API提交认证信息
            // const response = await fetch(`${this._cloudBaseUrl}/verify`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         realName,
            //         idCardType,
            //         idCardNo
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`认证失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.json();
            
            // 模拟认证成功
            const data = {
                success: true,
                ageGroup: AgeGroup.JUNIOR,
                verifiedAt: Date.now(),
                realName: this.maskName(realName),
                idCardNo: this.maskIdCard(idCardNo)
            };
            
            if (data.success) {
                // 更新用户信息
                this._userInfo = {
                    status: VerificationStatus.VERIFIED,
                    ageGroup: data.ageGroup,
                    verifiedAt: data.verifiedAt,
                    realName: data.realName,
                    idCardType,
                    idCardNo: data.idCardNo
                };
                
                // 保存数据
                this.saveData();
                
                return true;
            } else {
                // 更新状态为认证失败
                this._userInfo.status = VerificationStatus.FAILED;
                this.saveData();
                
                return false;
            }
        } catch (error) {
            console.error('提交实名认证失败', error);
            
            // 更新状态为认证失败
            this._userInfo.status = VerificationStatus.FAILED;
            this.saveData();
            
            return false;
        }
    }
    
    /**
     * 掩码姓名
     * @param name 姓名
     * @returns 掩码后的姓名
     */
    private maskName(name: string): string {
        if (name.length <= 1) {
            return '*';
        } else if (name.length === 2) {
            return name.charAt(0) + '*';
        } else {
            return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
        }
    }
    
    /**
     * 掩码证件号码
     * @param idCard 证件号码
     * @returns 掩码后的证件号码
     */
    private maskIdCard(idCard: string): string {
        if (idCard.length <= 8) {
            return '*'.repeat(idCard.length);
        } else {
            return idCard.substring(0, 4) + '*'.repeat(idCard.length - 8) + idCard.substring(idCard.length - 4);
        }
    }
    
    /**
     * 获取用户实名信息
     * @returns 用户实名信息
     */
    getUserVerificationInfo(): UserVerificationInfo {
        return { ...this._userInfo };
    }
    
    /**
     * 获取用户年龄组
     * @returns 年龄组
     */
    getAgeGroup(): AgeGroup {
        return this._userInfo.ageGroup;
    }
    
    /**
     * 是否已实名认证
     * @returns 是否已认证
     */
    isVerified(): boolean {
        return this._userInfo.status === VerificationStatus.VERIFIED;
    }
    
    /**
     * 获取今日游戏时间（分钟）
     * @returns 游戏时间
     */
    getTodayPlayTime(): number {
        if (!this._isPlaying) {
            return this._todayPlayTime;
        }
        
        // 计算当前游戏时间（分钟）
        const currentPlayTimeMinutes = Math.floor((Date.now() - this._gameStartTime) / 60000);
        return this._todayPlayTime + currentPlayTimeMinutes;
    }
    
    /**
     * 获取本周游戏时间（分钟）
     * @returns 游戏时间
     */
    getWeekPlayTime(): number {
        if (!this._isPlaying) {
            return this._weekPlayTime;
        }
        
        // 计算当前游戏时间（分钟）
        const currentPlayTimeMinutes = Math.floor((Date.now() - this._gameStartTime) / 60000);
        return this._weekPlayTime + currentPlayTimeMinutes;
    }
    
    /**
     * 是否正在游戏
     * @returns 是否正在游戏
     */
    isPlaying(): boolean {
        return this._isPlaying;
    }
}
