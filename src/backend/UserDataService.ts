// UserDataService.ts - 用户数据服务

import { UserInfo, GameProgress } from '../network/UserManager';

/**
 * 用户数据服务类
 * 负责用户数据的存储、同步和管理
 */
export class UserDataService {
    private _cloudBaseUrl: string = 'https://api.example.com/user'; // 云端API基础URL
    private _localStoragePrefix: string = 'block_match_game_'; // 本地存储前缀
    private _sessionKey: string = ''; // 会话密钥
    private _syncInterval: number = 60000; // 同步间隔（毫秒）
    private _syncTimer: any = null; // 同步定时器
    private _pendingChanges: boolean = false; // 是否有待同步的更改
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化同步定时器
        this.startSyncTimer();
    }
    
    /**
     * 启动同步定时器
     */
    private startSyncTimer(): void {
        // 清除可能存在的旧定时器
        if (this._syncTimer) {
            clearInterval(this._syncTimer);
        }
        
        // 设置新定时器
        this._syncTimer = setInterval(() => {
            this.syncData();
        }, this._syncInterval);
    }
    
    /**
     * 停止同步定时器
     */
    private stopSyncTimer(): void {
        if (this._syncTimer) {
            clearInterval(this._syncTimer);
            this._syncTimer = null;
        }
    }
    
    /**
     * 同步数据到云端
     * @returns 是否同步成功
     */
    async syncData(): Promise<boolean> {
        // 如果没有待同步的更改，则跳过
        if (!this._pendingChanges) {
            return true;
        }
        
        console.log('同步数据到云端');
        
        try {
            // 获取本地数据
            const userInfo = this.getLocalData('userInfo');
            const gameProgress = this.getLocalData('gameProgress');
            
            if (!userInfo || !gameProgress) {
                console.error('本地数据不完整，无法同步');
                return false;
            }
            
            // 在实际实现中，这里会调用云端API上传数据
            // const response = await fetch(`${this._cloudBaseUrl}/sync`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${this._sessionKey}`
            //     },
            //     body: JSON.stringify({
            //         userInfo,
            //         gameProgress,
            //         timestamp: Date.now()
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`同步失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟同步成功
            console.log('数据同步成功');
            this._pendingChanges = false;
            
            return true;
        } catch (error) {
            console.error('同步数据失败', error);
            return false;
        }
    }
    
    /**
     * 从云端加载数据
     * @param openId 用户OpenID
     * @returns 是否加载成功
     */
    async loadDataFromCloud(openId: string): Promise<boolean> {
        console.log(`从云端加载用户 ${openId} 的数据`);
        
        try {
            // 在实际实现中，这里会调用云端API获取数据
            // const response = await fetch(`${this._cloudBaseUrl}/${openId}`, {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${this._sessionKey}`
            //     }
            // });
            
            // if (!response.ok) {
            //     throw new Error(`加载失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.json();
            
            // 模拟从云端获取数据
            const data = {
                userInfo: {
                    openId,
                    nickname: '云端用户',
                    avatarUrl: 'https://example.com/avatar.png',
                    gender: 1,
                    province: '广东',
                    city: '深圳',
                    country: '中国',
                    language: 'zh_CN'
                },
                gameProgress: {
                    currentLevel: 5,
                    stars: [[1, 3], [2, 2], [3, 3], [4, 1]],
                    highScores: [[1, 1500], [2, 2000], [3, 2500], [4, 1800]],
                    totalScore: 7800,
                    achievements: ['first_win', 'combo_master']
                }
            };
            
            // 保存到本地存储
            this.saveLocalData('userInfo', data.userInfo);
            this.saveLocalData('gameProgress', data.gameProgress);
            
            console.log('从云端加载数据成功');
            this._pendingChanges = false;
            
            return true;
        } catch (error) {
            console.error('从云端加载数据失败', error);
            return false;
        }
    }
    
    /**
     * 保存用户信息
     * @param userInfo 用户信息
     * @returns 是否保存成功
     */
    saveUserInfo(userInfo: UserInfo): boolean {
        try {
            this.saveLocalData('userInfo', userInfo);
            this._pendingChanges = true;
            return true;
        } catch (error) {
            console.error('保存用户信息失败', error);
            return false;
        }
    }
    
    /**
     * 保存游戏进度
     * @param gameProgress 游戏进度
     * @returns 是否保存成功
     */
    saveGameProgress(gameProgress: GameProgress): boolean {
        try {
            this.saveLocalData('gameProgress', gameProgress);
            this._pendingChanges = true;
            return true;
        } catch (error) {
            console.error('保存游戏进度失败', error);
            return false;
        }
    }
    
    /**
     * 获取用户信息
     * @returns 用户信息
     */
    getUserInfo(): UserInfo | null {
        return this.getLocalData('userInfo');
    }
    
    /**
     * 获取游戏进度
     * @returns 游戏进度
     */
    getGameProgress(): GameProgress | null {
        return this.getLocalData('gameProgress');
    }
    
    /**
     * 保存数据到本地存储
     * @param key 键名
     * @param data 数据
     */
    private saveLocalData(key: string, data: any): void {
        const fullKey = this._localStoragePrefix + key;
        
        try {
            // 在实际实现中，这里会使用微信的存储API
            // wx.setStorageSync(fullKey, JSON.stringify(data));
            
            // 模拟保存到本地存储
            localStorage.setItem(fullKey, JSON.stringify(data));
        } catch (error) {
            console.error(`保存本地数据失败: ${key}`, error);
            throw error;
        }
    }
    
    /**
     * 从本地存储获取数据
     * @param key 键名
     * @returns 数据
     */
    private getLocalData<T>(key: string): T | null {
        const fullKey = this._localStoragePrefix + key;
        
        try {
            // 在实际实现中，这里会使用微信的存储API
            // const dataStr = wx.getStorageSync(fullKey);
            
            // 模拟从本地存储获取数据
            const dataStr = localStorage.getItem(fullKey);
            
            if (!dataStr) {
                return null;
            }
            
            return JSON.parse(dataStr) as T;
        } catch (error) {
            console.error(`获取本地数据失败: ${key}`, error);
            return null;
        }
    }
    
    /**
     * 清除本地数据
     * @param key 键名（可选，不提供则清除所有数据）
     * @returns 是否清除成功
     */
    clearLocalData(key?: string): boolean {
        try {
            if (key) {
                // 清除指定键的数据
                const fullKey = this._localStoragePrefix + key;
                
                // 在实际实现中，这里会使用微信的存储API
                // wx.removeStorageSync(fullKey);
                
                // 模拟清除本地存储
                localStorage.removeItem(fullKey);
            } else {
                // 清除所有数据
                // 在实际实现中，这里会使用微信的存储API
                // wx.clearStorageSync();
                
                // 模拟清除所有本地存储
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this._localStoragePrefix)) {
                        localStorage.removeItem(key);
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('清除本地数据失败', error);
            return false;
        }
    }
    
    /**
     * 设置会话密钥
     * @param sessionKey 会话密钥
     */
    setSessionKey(sessionKey: string): void {
        this._sessionKey = sessionKey;
    }
    
    /**
     * 设置同步间隔
     * @param interval 间隔（毫秒）
     */
    setSyncInterval(interval: number): void {
        this._syncInterval = interval;
        
        // 重启同步定时器
        this.startSyncTimer();
    }
    
    /**
     * 强制同步
     * @returns 是否同步成功
     */
    async forceSyncData(): Promise<boolean> {
        this._pendingChanges = true;
        return await this.syncData();
    }
    
    /**
     * 销毁服务
     */
    destroy(): void {
        // 停止同步定时器
        this.stopSyncTimer();
        
        // 强制同步一次
        this.syncData();
    }
}
