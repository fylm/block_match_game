// LeaderboardService.ts - 排行榜服务

import { LeaderboardType, LeaderboardItem, ProvinceTeamInfo } from '../network/LeaderboardManager';

/**
 * 排行榜服务类
 * 负责排行榜数据的获取、更新和管理
 */
export class LeaderboardService {
    private _cloudBaseUrl: string = 'https://api.example.com/leaderboard'; // 云端API基础URL
    private _cacheExpireTime: number = 300000; // 缓存过期时间（毫秒）
    private _cachedLeaderboards: Map<string, { data: any, timestamp: number }> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化
    }
    
    /**
     * 获取排行榜数据
     * @param type 排行榜类型
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     * @param forceRefresh 是否强制刷新
     * @returns 排行榜数据
     */
    async getLeaderboard(type: LeaderboardType, levelId?: number, forceRefresh: boolean = false): Promise<LeaderboardItem[] | ProvinceTeamInfo[]> {
        // 构建缓存键
        const cacheKey = this.buildCacheKey(type, levelId);
        
        // 检查缓存
        if (!forceRefresh) {
            const cachedData = this._cachedLeaderboards.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < this._cacheExpireTime) {
                console.log(`使用缓存的排行榜数据: ${cacheKey}`);
                return cachedData.data;
            }
        }
        
        console.log(`从云端获取排行榜数据: ${cacheKey}`);
        
        try {
            // 构建API URL
            let url = `${this._cloudBaseUrl}/${type}`;
            if (type === LeaderboardType.LEVEL && levelId) {
                url += `/${levelId}`;
            }
            
            // 在实际实现中，这里会调用云端API获取数据
            // const response = await fetch(url, {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${sessionKey}`
            //     }
            // });
            
            // if (!response.ok) {
            //     throw new Error(`获取排行榜失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.json();
            
            // 模拟从云端获取数据
            let data: any[] = [];
            
            switch (type) {
                case LeaderboardType.GLOBAL:
                    data = this.mockGlobalLeaderboard();
                    break;
                case LeaderboardType.FRIENDS:
                    data = this.mockFriendsLeaderboard();
                    break;
                case LeaderboardType.PROVINCE:
                    data = this.mockProvinceLeaderboard();
                    break;
                case LeaderboardType.LEVEL:
                    data = this.mockLevelLeaderboard(levelId || 1);
                    break;
            }
            
            // 更新缓存
            this._cachedLeaderboards.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('获取排行榜数据失败', error);
            
            // 如果获取失败，尝试使用缓存的数据（即使已过期）
            const cachedData = this._cachedLeaderboards.get(cacheKey);
            if (cachedData) {
                console.log(`使用过期的缓存数据: ${cacheKey}`);
                return cachedData.data;
            }
            
            // 如果没有缓存，返回空数组
            return [];
        }
    }
    
    /**
     * 提交分数
     * @param levelId 关卡ID
     * @param score 分数
     * @param openId 用户OpenID
     * @returns 是否提交成功
     */
    async submitScore(levelId: number, score: number, openId: string): Promise<boolean> {
        console.log(`提交分数: 关卡${levelId}, 分数${score}, 用户${openId}`);
        
        try {
            // 在实际实现中，这里会调用云端API提交分数
            // const response = await fetch(`${this._cloudBaseUrl}/submit`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${sessionKey}`
            //     },
            //     body: JSON.stringify({
            //         levelId,
            //         score,
            //         openId,
            //         timestamp: Date.now()
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`提交分数失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟提交成功
            console.log('提交分数成功');
            
            // 清除相关缓存
            this.clearCache(LeaderboardType.GLOBAL);
            this.clearCache(LeaderboardType.FRIENDS);
            this.clearCache(LeaderboardType.LEVEL, levelId);
            
            return true;
        } catch (error) {
            console.error('提交分数失败', error);
            return false;
        }
    }
    
    /**
     * 为省份战队贡献分数
     * @param provinceId 省份ID
     * @param score 贡献的分数
     * @param openId 用户OpenID
     * @returns 是否贡献成功
     */
    async contributeToProvince(provinceId: string, score: number, openId: string): Promise<boolean> {
        console.log(`为省份${provinceId}贡献分数: ${score}, 用户${openId}`);
        
        try {
            // 在实际实现中，这里会调用云端API贡献分数
            // const response = await fetch(`${this._cloudBaseUrl}/province/contribute`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${sessionKey}`
            //     },
            //     body: JSON.stringify({
            //         provinceId,
            //         score,
            //         openId,
            //         timestamp: Date.now()
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`贡献分数失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟贡献成功
            console.log('贡献分数成功');
            
            // 清除省份排行榜缓存
            this.clearCache(LeaderboardType.PROVINCE);
            
            return true;
        } catch (error) {
            console.error('贡献分数失败', error);
            return false;
        }
    }
    
    /**
     * 获取用户排名
     * @param type 排行榜类型
     * @param openId 用户OpenID
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     * @returns 排名（未上榜返回-1）
     */
    async getUserRank(type: LeaderboardType, openId: string, levelId?: number): Promise<number> {
        console.log(`获取用户${openId}在${type}排行榜中的排名`);
        
        try {
            // 获取排行榜数据
            const leaderboard = await this.getLeaderboard(type, levelId) as LeaderboardItem[];
            
            // 查找用户排名
            const item = leaderboard.find(item => item.openId === openId);
            return item ? item.rank : -1;
        } catch (error) {
            console.error('获取用户排名失败', error);
            return -1;
        }
    }
    
    /**
     * 获取省份排名
     * @param provinceId 省份ID
     * @returns 排名（未上榜返回-1）
     */
    async getProvinceRank(provinceId: string): Promise<number> {
        console.log(`获取省份${provinceId}的排名`);
        
        try {
            // 获取省份排行榜数据
            const provinceLeaderboard = await this.getLeaderboard(LeaderboardType.PROVINCE) as ProvinceTeamInfo[];
            
            // 查找省份排名
            const item = provinceLeaderboard.find(item => item.provinceId === provinceId);
            return item ? item.rank : -1;
        } catch (error) {
            console.error('获取省份排名失败', error);
            return -1;
        }
    }
    
    /**
     * 清除缓存
     * @param type 排行榜类型
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     */
    clearCache(type: LeaderboardType, levelId?: number): void {
        const cacheKey = this.buildCacheKey(type, levelId);
        this._cachedLeaderboards.delete(cacheKey);
    }
    
    /**
     * 清除所有缓存
     */
    clearAllCache(): void {
        this._cachedLeaderboards.clear();
    }
    
    /**
     * 构建缓存键
     * @param type 排行榜类型
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     * @returns 缓存键
     */
    private buildCacheKey(type: LeaderboardType, levelId?: number): string {
        if (type === LeaderboardType.LEVEL && levelId) {
            return `${type}_${levelId}`;
        }
        return type;
    }
    
    /**
     * 模拟全球排行榜数据
     * @returns 排行榜数据
     */
    private mockGlobalLeaderboard(): LeaderboardItem[] {
        return [
            {
                rank: 1,
                openId: 'global_user_1',
                nickname: '全球玩家1',
                avatarUrl: 'https://example.com/avatar1.png',
                score: 9999
            },
            {
                rank: 2,
                openId: 'global_user_2',
                nickname: '全球玩家2',
                avatarUrl: 'https://example.com/avatar2.png',
                score: 9888
            },
            {
                rank: 3,
                openId: 'global_user_3',
                nickname: '全球玩家3',
                avatarUrl: 'https://example.com/avatar3.png',
                score: 9777
            },
            {
                rank: 4,
                openId: 'global_user_4',
                nickname: '全球玩家4',
                avatarUrl: 'https://example.com/avatar4.png',
                score: 9666
            },
            {
                rank: 5,
                openId: 'global_user_5',
                nickname: '全球玩家5',
                avatarUrl: 'https://example.com/avatar5.png',
                score: 9555
            }
        ];
    }
    
    /**
     * 模拟好友排行榜数据
     * @returns 排行榜数据
     */
    private mockFriendsLeaderboard(): LeaderboardItem[] {
        return [
            {
                rank: 1,
                openId: 'friend_1',
                nickname: '好友1',
                avatarUrl: 'https://example.com/friend1.png',
                score: 8888
            },
            {
                rank: 2,
                openId: 'friend_2',
                nickname: '好友2',
                avatarUrl: 'https://example.com/friend2.png',
                score: 7777
            },
            {
                rank: 3,
                openId: 'current_user',
                nickname: '我',
                avatarUrl: 'https://example.com/me.png',
                score: 6666
            },
            {
                rank: 4,
                openId: 'friend_3',
                nickname: '好友3',
                avatarUrl: 'https://example.com/friend3.png',
                score: 5555
            },
            {
                rank: 5,
                openId: 'friend_4',
                nickname: '好友4',
                avatarUrl: 'https://example.com/friend4.png',
                score: 4444
            }
        ];
    }
    
    /**
     * 模拟省份排行榜数据
     * @returns 排行榜数据
     */
    private mockProvinceLeaderboard(): ProvinceTeamInfo[] {
        return [
            {
                provinceId: 'guangdong',
                provinceName: '广东',
                totalScore: 999999,
                memberCount: 10000,
                rank: 1
            },
            {
                provinceId: 'beijing',
                provinceName: '北京',
                totalScore: 888888,
                memberCount: 8000,
                rank: 2
            },
            {
                provinceId: 'shanghai',
                provinceName: '上海',
                totalScore: 777777,
                memberCount: 7000,
                rank: 3
            },
            {
                provinceId: 'sichuan',
                provinceName: '四川',
                totalScore: 666666,
                memberCount: 6000,
                rank: 4
            },
            {
                provinceId: 'zhejiang',
                provinceName: '浙江',
                totalScore: 555555,
                memberCount: 5000,
                rank: 5
            }
        ];
    }
    
    /**
     * 模拟关卡排行榜数据
     * @param levelId 关卡ID
     * @returns 排行榜数据
     */
    private mockLevelLeaderboard(levelId: number): LeaderboardItem[] {
        return [
            {
                rank: 1,
                openId: `level_${levelId}_user_1`,
                nickname: '玩家1',
                avatarUrl: 'https://example.com/player1.png',
                score: 9999,
                level: levelId
            },
            {
                rank: 2,
                openId: `level_${levelId}_user_2`,
                nickname: '玩家2',
                avatarUrl: 'https://example.com/player2.png',
                score: 9888,
                level: levelId
            },
            {
                rank: 3,
                openId: `level_${levelId}_user_3`,
                nickname: '玩家3',
                avatarUrl: 'https://example.com/player3.png',
                score: 9777,
                level: levelId
            },
            {
                rank: 4,
                openId: `level_${levelId}_user_4`,
                nickname: '玩家4',
                avatarUrl: 'https://example.com/player4.png',
                score: 9666,
                level: levelId
            },
            {
                rank: 5,
                openId: `level_${levelId}_user_5`,
                nickname: '玩家5',
                avatarUrl: 'https://example.com/player5.png',
                score: 9555,
                level: levelId
            }
        ];
    }
}
