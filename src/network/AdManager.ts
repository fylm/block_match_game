// AdManager.ts - 广告管理类

/**
 * 广告类型枚举
 */
export enum AdType {
    REWARDED = 'rewarded',   // 激励视频广告
    INTERSTITIAL = 'interstitial', // 插屏广告
    BANNER = 'banner'        // 横幅广告
}

/**
 * 广告奖励类型枚举
 */
export enum RewardType {
    REVIVE = 'revive',       // 复活
    ITEM = 'item',           // 道具
    ENERGY = 'energy',       // 能量加速
    DOUBLE_REWARD = 'double' // 双倍奖励
}

/**
 * 广告奖励接口
 */
export interface AdReward {
    type: RewardType;        // 奖励类型
    amount?: number;         // 奖励数量
    itemId?: string;         // 道具ID
}

/**
 * 广告管理类
 */
export class AdManager {
    private _isAdLoaded: Map<AdType, boolean> = new Map();
    private _lastShowTime: Map<AdType, number> = new Map();
    private _adEnabled: boolean = true;
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化广告状态
        for (const type of Object.values(AdType)) {
            this._isAdLoaded.set(type as AdType, false);
            this._lastShowTime.set(type as AdType, 0);
        }
        
        // 预加载广告
        this.preloadAds();
    }
    
    /**
     * 预加载广告
     */
    private async preloadAds(): Promise<void> {
        // 在实际实现中，这里会调用微信API预加载广告
        console.log('预加载广告');
        
        try {
            // 模拟预加载过程
            setTimeout(() => {
                this._isAdLoaded.set(AdType.REWARDED, true);
                console.log('激励视频广告加载完成');
            }, 1000);
            
            setTimeout(() => {
                this._isAdLoaded.set(AdType.INTERSTITIAL, true);
                console.log('插屏广告加载完成');
            }, 1500);
            
            setTimeout(() => {
                this._isAdLoaded.set(AdType.BANNER, true);
                console.log('横幅广告加载完成');
            }, 800);
        } catch (error) {
            console.error('预加载广告失败', error);
        }
    }
    
    /**
     * 显示广告
     * @param type 广告类型
     * @param placement 广告位置标识
     * @returns 是否显示成功
     */
    async showAd(type: AdType, placement: string): Promise<boolean> {
        // 检查广告是否启用
        if (!this._adEnabled) {
            console.log('广告已被禁用');
            return false;
        }
        
        // 检查广告是否加载完成
        if (!this._isAdLoaded.get(type)) {
            console.log(`${type}广告尚未加载完成`);
            return false;
        }
        
        // 检查广告展示频率限制
        const now = Date.now();
        const lastShowTime = this._lastShowTime.get(type) || 0;
        const minInterval = this.getMinInterval(type);
        
        if (now - lastShowTime < minInterval) {
            console.log(`${type}广告展示过于频繁`);
            return false;
        }
        
        // 在实际实现中，这里会调用微信API显示广告
        console.log(`显示${type}广告，位置：${placement}`);
        
        try {
            // 模拟广告显示过程
            this._lastShowTime.set(type, now);
            
            // 广告显示后重新加载
            this._isAdLoaded.set(type, false);
            this.reloadAd(type);
            
            return true;
        } catch (error) {
            console.error(`显示${type}广告失败`, error);
            return false;
        }
    }
    
    /**
     * 获取广告最小展示间隔（毫秒）
     * @param type 广告类型
     * @returns 最小间隔
     */
    private getMinInterval(type: AdType): number {
        switch (type) {
            case AdType.REWARDED:
                return 0; // 激励视频广告没有间隔限制
            case AdType.INTERSTITIAL:
                return 60000; // 插屏广告至少间隔1分钟
            case AdType.BANNER:
                return 30000; // 横幅广告至少间隔30秒
            default:
                return 0;
        }
    }
    
    /**
     * 重新加载广告
     * @param type 广告类型
     */
    private async reloadAd(type: AdType): Promise<void> {
        // 在实际实现中，这里会调用微信API重新加载广告
        console.log(`重新加载${type}广告`);
        
        try {
            // 模拟重新加载过程
            setTimeout(() => {
                this._isAdLoaded.set(type, true);
                console.log(`${type}广告重新加载完成`);
            }, 2000);
        } catch (error) {
            console.error(`重新加载${type}广告失败`, error);
        }
    }
    
    /**
     * 显示激励视频广告
     * @param placement 广告位置标识
     * @param reward 奖励信息
     * @returns 是否成功获得奖励
     */
    async showRewardedAd(placement: string, reward: AdReward): Promise<boolean> {
        // 在实际实现中，这里会调用微信API显示激励视频广告
        console.log(`显示激励视频广告，位置：${placement}，奖励：`, reward);
        
        try {
            // 显示广告
            const success = await this.showAd(AdType.REWARDED, placement);
            
            if (!success) {
                return false;
            }
            
            // 模拟用户观看完成
            // 在实际实现中，这里会根据微信API的回调判断用户是否完整观看
            const watched = Math.random() > 0.2; // 80%的概率完整观看
            
            if (watched) {
                // 发放奖励
                console.log(`用户完整观看广告，发放奖励：`, reward);
                return true;
            } else {
                console.log('用户未完整观看广告，不发放奖励');
                return false;
            }
        } catch (error) {
            console.error('显示激励视频广告失败', error);
            return false;
        }
    }
    
    /**
     * 显示插屏广告
     * @param placement 广告位置标识
     * @returns 是否显示成功
     */
    async showInterstitialAd(placement: string): Promise<boolean> {
        return this.showAd(AdType.INTERSTITIAL, placement);
    }
    
    /**
     * 显示横幅广告
     * @param placement 广告位置标识
     * @returns 是否显示成功
     */
    async showBannerAd(placement: string): Promise<boolean> {
        return this.showAd(AdType.BANNER, placement);
    }
    
    /**
     * 隐藏横幅广告
     */
    hideBannerAd(): void {
        // 在实际实现中，这里会调用微信API隐藏横幅广告
        console.log('隐藏横幅广告');
    }
    
    /**
     * 设置广告启用状态
     * @param enabled 是否启用
     */
    setAdEnabled(enabled: boolean): void {
        this._adEnabled = enabled;
        
        if (!enabled) {
            // 隐藏所有可能显示的广告
            this.hideBannerAd();
        }
    }
    
    /**
     * 广告是否启用
     */
    get adEnabled(): boolean {
        return this._adEnabled;
    }
    
    /**
     * 检查广告是否已加载
     * @param type 广告类型
     * @returns 是否已加载
     */
    isAdLoaded(type: AdType): boolean {
        return this._isAdLoaded.get(type) || false;
    }
}
