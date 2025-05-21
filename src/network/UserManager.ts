// UserManager.ts - 用户数据管理类

/**
 * 用户信息接口
 */
export interface UserInfo {
    openId: string;          // 微信OpenID
    nickname: string;        // 昵称
    avatarUrl: string;       // 头像URL
    gender: number;          // 性别（0:未知, 1:男, 2:女）
    province: string;        // 省份
    city: string;            // 城市
    country: string;         // 国家
    language: string;        // 语言
}

/**
 * 游戏进度接口
 */
export interface GameProgress {
    currentLevel: number;    // 当前关卡
    stars: Map<number, number>; // 关卡ID -> 获得的星星数
    highScores: Map<number, number>; // 关卡ID -> 最高分
    totalScore: number;      // 总分数
    achievements: string[];  // 已获得的成就ID
}

/**
 * 用户数据管理类
 */
export class UserManager {
    private _userInfo: UserInfo | null = null;
    private _gameProgress: GameProgress = {
        currentLevel: 1,
        stars: new Map(),
        highScores: new Map(),
        totalScore: 0,
        achievements: []
    };
    private _isLoggedIn: boolean = false;
    private _friends: UserInfo[] = [];
    private _teamId: string = ''; // 省份战队ID
    
    /**
     * 构造函数
     */
    constructor() {
        // 尝试从本地存储加载用户数据
        this.loadUserData();
    }
    
    /**
     * 从本地存储加载用户数据
     */
    private loadUserData(): void {
        // 在实际实现中，这里会从微信存储或云端加载用户数据
        console.log('从本地存储加载用户数据');
        
        // 模拟加载过程
        try {
            // 模拟从本地存储获取数据
            const userInfoStr = localStorage.getItem('userInfo');
            const gameProgressStr = localStorage.getItem('gameProgress');
            
            if (userInfoStr) {
                this._userInfo = JSON.parse(userInfoStr);
                this._isLoggedIn = true;
            }
            
            if (gameProgressStr) {
                const progress = JSON.parse(gameProgressStr);
                
                // 转换Map结构
                this._gameProgress = {
                    currentLevel: progress.currentLevel,
                    stars: new Map(progress.stars),
                    highScores: new Map(progress.highScores),
                    totalScore: progress.totalScore,
                    achievements: progress.achievements
                };
            }
        } catch (error) {
            console.error('加载用户数据失败', error);
        }
    }
    
    /**
     * 保存用户数据到本地存储
     */
    private saveUserData(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存用户数据到本地存储');
        
        try {
            // 保存用户信息
            if (this._userInfo) {
                localStorage.setItem('userInfo', JSON.stringify(this._userInfo));
            }
            
            // 转换Map结构为可序列化的格式
            const progress = {
                currentLevel: this._gameProgress.currentLevel,
                stars: Array.from(this._gameProgress.stars.entries()),
                highScores: Array.from(this._gameProgress.highScores.entries()),
                totalScore: this._gameProgress.totalScore,
                achievements: this._gameProgress.achievements
            };
            
            localStorage.setItem('gameProgress', JSON.stringify(progress));
        } catch (error) {
            console.error('保存用户数据失败', error);
        }
    }
    
    /**
     * 微信登录
     * @returns 是否登录成功
     */
    async login(): Promise<boolean> {
        // 在实际实现中，这里会调用微信登录API
        console.log('调用微信登录API');
        
        try {
            // 模拟微信登录过程
            // 1. 获取临时登录凭证code
            // 2. 发送code到服务器换取openId和sessionKey
            // 3. 获取用户信息
            
            // 模拟成功登录
            this._userInfo = {
                openId: 'mock_openid_' + Date.now(),
                nickname: '测试用户',
                avatarUrl: 'https://example.com/avatar.png',
                gender: 1,
                province: '广东',
                city: '深圳',
                country: '中国',
                language: 'zh_CN'
            };
            
            this._isLoggedIn = true;
            
            // 保存用户数据
            this.saveUserData();
            
            return true;
        } catch (error) {
            console.error('微信登录失败', error);
            return false;
        }
    }
    
    /**
     * 登出
     */
    logout(): void {
        this._userInfo = null;
        this._isLoggedIn = false;
    }
    
    /**
     * 更新游戏进度
     * @param levelId 关卡ID
     * @param stars 获得的星星数
     * @param score 获得的分数
     */
    updateLevelProgress(levelId: number, stars: number, score: number): void {
        // 更新当前关卡
        if (levelId >= this._gameProgress.currentLevel) {
            this._gameProgress.currentLevel = levelId + 1;
        }
        
        // 更新星星数（只保留最高星级）
        const currentStars = this._gameProgress.stars.get(levelId) || 0;
        if (stars > currentStars) {
            this._gameProgress.stars.set(levelId, stars);
        }
        
        // 更新最高分
        const currentHighScore = this._gameProgress.highScores.get(levelId) || 0;
        if (score > currentHighScore) {
            this._gameProgress.highScores.set(levelId, score);
            
            // 更新总分数
            this._gameProgress.totalScore += (score - currentHighScore);
        }
        
        // 保存用户数据
        this.saveUserData();
    }
    
    /**
     * 解锁成就
     * @param achievementId 成就ID
     * @returns 是否成功解锁
     */
    unlockAchievement(achievementId: string): boolean {
        // 检查是否已解锁
        if (this._gameProgress.achievements.includes(achievementId)) {
            return false;
        }
        
        // 解锁成就
        this._gameProgress.achievements.push(achievementId);
        
        // 保存用户数据
        this.saveUserData();
        
        return true;
    }
    
    /**
     * 获取好友列表
     * @returns 好友列表
     */
    async getFriends(): Promise<UserInfo[]> {
        // 在实际实现中，这里会调用微信API获取好友列表
        console.log('获取微信好友列表');
        
        try {
            // 模拟获取好友列表
            this._friends = [
                {
                    openId: 'friend_openid_1',
                    nickname: '好友1',
                    avatarUrl: 'https://example.com/friend1.png',
                    gender: 1,
                    province: '北京',
                    city: '北京',
                    country: '中国',
                    language: 'zh_CN'
                },
                {
                    openId: 'friend_openid_2',
                    nickname: '好友2',
                    avatarUrl: 'https://example.com/friend2.png',
                    gender: 2,
                    province: '上海',
                    city: '上海',
                    country: '中国',
                    language: 'zh_CN'
                }
            ];
            
            return this._friends;
        } catch (error) {
            console.error('获取好友列表失败', error);
            return [];
        }
    }
    
    /**
     * 加入省份战队
     * @param provinceId 省份ID
     * @returns 是否成功加入
     */
    joinTeam(provinceId: string): boolean {
        // 在实际实现中，这里会调用服务器API加入战队
        console.log(`加入省份战队: ${provinceId}`);
        
        try {
            this._teamId = provinceId;
            
            // 保存用户数据
            this.saveUserData();
            
            return true;
        } catch (error) {
            console.error('加入省份战队失败', error);
            return false;
        }
    }
    
    /**
     * 分享游戏
     * @param type 分享类型（'score'|'help'|'invite'）
     * @param data 分享数据
     * @returns 是否成功分享
     */
    async shareGame(type: 'score' | 'help' | 'invite', data: any): Promise<boolean> {
        // 在实际实现中，这里会调用微信分享API
        console.log(`分享游戏: ${type}`, data);
        
        try {
            // 模拟分享过程
            // 1. 根据类型生成分享标题和图片
            // 2. 调用微信分享API
            
            return true;
        } catch (error) {
            console.error('分享游戏失败', error);
            return false;
        }
    }
    
    /**
     * 发送求助
     * @param levelId 关卡ID
     * @returns 是否成功发送
     */
    async sendHelp(levelId: number): Promise<boolean> {
        // 在实际实现中，这里会调用微信API发送求助消息
        console.log(`发送求助: 关卡${levelId}`);
        
        try {
            // 模拟发送求助过程
            return await this.shareGame('help', { levelId });
        } catch (error) {
            console.error('发送求助失败', error);
            return false;
        }
    }
    
    /**
     * 发送挑战
     * @param friendOpenId 好友OpenID
     * @param levelId 关卡ID
     * @returns 是否成功发送
     */
    async sendChallenge(friendOpenId: string, levelId: number): Promise<boolean> {
        // 在实际实现中，这里会调用微信API发送挑战消息
        console.log(`发送挑战: 好友${friendOpenId}, 关卡${levelId}`);
        
        try {
            // 模拟发送挑战过程
            return await this.shareGame('invite', { friendOpenId, levelId });
        } catch (error) {
            console.error('发送挑战失败', error);
            return false;
        }
    }
    
    /**
     * 获取用户信息
     */
    get userInfo(): UserInfo | null {
        return this._userInfo;
    }
    
    /**
     * 获取游戏进度
     */
    get gameProgress(): GameProgress {
        return this._gameProgress;
    }
    
    /**
     * 是否已登录
     */
    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
    
    /**
     * 获取好友列表
     */
    get friends(): UserInfo[] {
        return this._friends;
    }
    
    /**
     * 获取省份战队ID
     */
    get teamId(): string {
        return this._teamId;
    }
}
