// LeaderboardManager.ts - 排行榜管理类

import { UserInfo } from './UserManager';

/**
 * 排行榜类型枚举
 */
export enum LeaderboardType {
    GLOBAL = 'global',       // 全球排行榜
    FRIENDS = 'friends',     // 好友排行榜
    PROVINCE = 'province',   // 省份排行榜
    LEVEL = 'level'          // 关卡排行榜
}

/**
 * 排行榜项目接口
 */
export interface LeaderboardItem {
    rank: number;            // 排名
    openId: string;          // 用户OpenID
    nickname: string;        // 昵称
    avatarUrl: string;       // 头像URL
    score: number;           // 分数
    level?: number;          // 关卡（可选）
    province?: string;       // 省份（可选）
}

/**
 * 省份战队信息接口
 */
export interface ProvinceTeamInfo {
    provinceId: string;      // 省份ID
    provinceName: string;    // 省份名称
    totalScore: number;      // 总分数
    memberCount: number;     // 成员数量
    rank: number;            // 排名
}

/**
 * 排行榜管理类
 */
export class LeaderboardManager {
    private _globalLeaderboard: LeaderboardItem[] = [];
    private _friendsLeaderboard: LeaderboardItem[] = [];
    private _provinceLeaderboard: ProvinceTeamInfo[] = [];
    private _levelLeaderboards: Map<number, LeaderboardItem[]> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化排行榜数据
    }
    
    /**
     * 获取排行榜数据
     * @param type 排行榜类型
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     * @returns 排行榜数据
     */
    async getLeaderboard(type: LeaderboardType, levelId?: number): Promise<LeaderboardItem[] | ProvinceTeamInfo[]> {
        // 在实际实现中，这里会从服务器获取最新排行榜数据
        console.log(`获取排行榜数据: ${type}`, levelId);
        
        try {
            switch (type) {
                case LeaderboardType.GLOBAL:
                    return await this.fetchGlobalLeaderboard();
                case LeaderboardType.FRIENDS:
                    return await this.fetchFriendsLeaderboard();
                case LeaderboardType.PROVINCE:
                    return await this.fetchProvinceLeaderboard();
                case LeaderboardType.LEVEL:
                    if (!levelId) throw new Error('获取关卡排行榜需要提供关卡ID');
                    return await this.fetchLevelLeaderboard(levelId);
                default:
                    throw new Error('未知的排行榜类型');
            }
        } catch (error) {
            console.error('获取排行榜数据失败', error);
            return [];
        }
    }
    
    /**
     * 获取全球排行榜
     * @returns 排行榜数据
     */
    private async fetchGlobalLeaderboard(): Promise<LeaderboardItem[]> {
        // 模拟从服务器获取数据
        this._globalLeaderboard = [
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
            }
        ];
        
        return this._globalLeaderboard;
    }
    
    /**
     * 获取好友排行榜
     * @returns 排行榜数据
     */
    private async fetchFriendsLeaderboard(): Promise<LeaderboardItem[]> {
        // 模拟从服务器获取数据
        this._friendsLeaderboard = [
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
            }
        ];
        
        return this._friendsLeaderboard;
    }
    
    /**
     * 获取省份排行榜
     * @returns 排行榜数据
     */
    private async fetchProvinceLeaderboard(): Promise<ProvinceTeamInfo[]> {
        // 模拟从服务器获取数据
        this._provinceLeaderboard = [
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
            }
        ];
        
        return this._provinceLeaderboard;
    }
    
    /**
     * 获取关卡排行榜
     * @param levelId 关卡ID
     * @returns 排行榜数据
     */
    private async fetchLevelLeaderboard(levelId: number): Promise<LeaderboardItem[]> {
        // 模拟从服务器获取数据
        const leaderboard = [
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
            }
        ];
        
        this._levelLeaderboards.set(levelId, leaderboard);
        
        return leaderboard;
    }
    
    /**
     * 提交分数
     * @param levelId 关卡ID
     * @param score 分数
     * @returns 是否提交成功
     */
    async submitScore(levelId: number, score: number): Promise<boolean> {
        // 在实际实现中，这里会将分数提交到服务器
        console.log(`提交分数: 关卡${levelId}, 分数${score}`);
        
        try {
            // 模拟提交过程
            // 1. 验证分数合法性
            // 2. 提交到服务器
            // 3. 更新本地排行榜缓存
            
            return true;
        } catch (error) {
            console.error('提交分数失败', error);
            return false;
        }
    }
    
    /**
     * 获取用户在排行榜中的排名
     * @param type 排行榜类型
     * @param openId 用户OpenID
     * @param levelId 关卡ID（仅当type为LEVEL时需要）
     * @returns 排名（未上榜返回-1）
     */
    async getUserRank(type: LeaderboardType, openId: string, levelId?: number): Promise<number> {
        try {
            let leaderboard: LeaderboardItem[];
            
            switch (type) {
                case LeaderboardType.GLOBAL:
                    leaderboard = await this.fetchGlobalLeaderboard();
                    break;
                case LeaderboardType.FRIENDS:
                    leaderboard = await this.fetchFriendsLeaderboard();
                    break;
                case LeaderboardType.LEVEL:
                    if (!levelId) throw new Error('获取关卡排名需要提供关卡ID');
                    leaderboard = await this.fetchLevelLeaderboard(levelId);
                    break;
                default:
                    return -1;
            }
            
            // 查找用户排名
            const item = leaderboard.find(item => item.openId === openId);
            return item ? item.rank : -1;
        } catch (error) {
            console.error('获取用户排名失败', error);
            return -1;
        }
    }
    
    /**
     * 获取省份战队排名
     * @param provinceId 省份ID
     * @returns 排名（未上榜返回-1）
     */
    async getProvinceRank(provinceId: string): Promise<number> {
        try {
            const provinceLeaderboard = await this.fetchProvinceLeaderboard();
            
            // 查找省份排名
            const item = provinceLeaderboard.find(item => item.provinceId === provinceId);
            return item ? item.rank : -1;
        } catch (error) {
            console.error('获取省份排名失败', error);
            return -1;
        }
    }
    
    /**
     * 为省份战队贡献分数
     * @param provinceId 省份ID
     * @param score 贡献的分数
     * @returns 是否贡献成功
     */
    async contributeToProvince(provinceId: string, score: number): Promise<boolean> {
        // 在实际实现中，这里会将分数贡献到服务器
        console.log(`为省份${provinceId}贡献分数: ${score}`);
        
        try {
            // 模拟贡献过程
            return true;
        } catch (error) {
            console.error('贡献分数失败', error);
            return false;
        }
    }
    
    /**
     * 获取好友挑战记录
     * @param openId 用户OpenID
     * @returns 挑战记录
     */
    async getChallengeRecords(openId: string): Promise<any[]> {
        // 在实际实现中，这里会从服务器获取挑战记录
        console.log(`获取用户${openId}的挑战记录`);
        
        try {
            // 模拟获取挑战记录
            return [
                {
                    challengeId: 'challenge_1',
                    challenger: {
                        openId: 'friend_1',
                        nickname: '挑战者1',
                        avatarUrl: 'https://example.com/challenger1.png'
                    },
                    challenged: {
                        openId: openId,
                        nickname: '我',
                        avatarUrl: 'https://example.com/me.png'
                    },
                    levelId: 5,
                    challengerScore: 8888,
                    challengedScore: 9999,
                    result: 'win', // 'win', 'lose', 'draw'
                    timestamp: Date.now() - 86400000 // 一天前
                },
                {
                    challengeId: 'challenge_2',
                    challenger: {
                        openId: openId,
                        nickname: '我',
                        avatarUrl: 'https://example.com/me.png'
                    },
                    challenged: {
                        openId: 'friend_2',
                        nickname: '被挑战者',
                        avatarUrl: 'https://example.com/challenged.png'
                    },
                    levelId: 3,
                    challengerScore: 7777,
                    challengedScore: 6666,
                    result: 'win',
                    timestamp: Date.now() - 172800000 // 两天前
                }
            ];
        } catch (error) {
            console.error('获取挑战记录失败', error);
            return [];
        }
    }
}
