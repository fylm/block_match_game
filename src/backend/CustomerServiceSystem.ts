// CustomerServiceSystem.ts - 客服系统

/**
 * 问题类型枚举
 */
export enum IssueType {
    ACCOUNT = 'account',         // 账号问题
    PAYMENT = 'payment',         // 支付问题
    GAMEPLAY = 'gameplay',       // 游戏玩法问题
    BUG = 'bug',                 // 游戏bug
    SUGGESTION = 'suggestion',   // 建议
    OTHER = 'other'              // 其他
}

/**
 * 问题状态枚举
 */
export enum IssueStatus {
    PENDING = 'pending',         // 待处理
    PROCESSING = 'processing',   // 处理中
    RESOLVED = 'resolved',       // 已解决
    CLOSED = 'closed'            // 已关闭
}

/**
 * 问题优先级枚举
 */
export enum IssuePriority {
    LOW = 'low',                 // 低优先级
    MEDIUM = 'medium',           // 中优先级
    HIGH = 'high',               // 高优先级
    URGENT = 'urgent'            // 紧急
}

/**
 * 问题信息接口
 */
export interface IssueInfo {
    id: string;                  // 问题ID
    userId: string;              // 用户ID
    type: IssueType;             // 问题类型
    title: string;               // 问题标题
    content: string;             // 问题内容
    attachments?: string[];      // 附件URL
    status: IssueStatus;         // 问题状态
    priority: IssuePriority;     // 优先级
    createTime: number;          // 创建时间
    updateTime: number;          // 更新时间
    resolveTime?: number;        // 解决时间
    adminId?: string;            // 处理人ID
}

/**
 * 消息信息接口
 */
export interface MessageInfo {
    id: string;                  // 消息ID
    issueId: string;             // 问题ID
    senderId: string;            // 发送者ID
    isAdmin: boolean;            // 是否管理员
    content: string;             // 消息内容
    attachments?: string[];      // 附件URL
    createTime: number;          // 创建时间
    isRead: boolean;             // 是否已读
}

/**
 * 常见问题接口
 */
export interface FAQInfo {
    id: string;                  // 问题ID
    category: string;            // 分类
    question: string;            // 问题
    answer: string;              // 答案
    tags: string[];              // 标签
    viewCount: number;           // 查看次数
    helpful: number;             // 有帮助数
    unhelpful: number;           // 无帮助数
}

/**
 * 客服系统类
 * 负责用户问题反馈和客服支持
 */
export class CustomerServiceSystem {
    private _cloudBaseUrl: string = 'https://api.example.com/customer-service'; // 云端API基础URL
    private _issues: Map<string, IssueInfo> = new Map();
    private _messages: Map<string, MessageInfo[]> = new Map();
    private _faqs: FAQInfo[] = [];
    private _unreadMessageCount: number = 0;
    private _onNewMessageCallback: ((message: MessageInfo) => void) | null = null;
    private _checkInterval: number = 60000; // 检查间隔（毫秒）
    private _checkTimer: any = null; // 检查定时器
    
    /**
     * 构造函数
     */
    constructor() {
        // 加载常见问题
        this.loadFAQs();
        
        // 启动消息检查定时器
        this.startCheckTimer();
    }
    
    /**
     * 加载常见问题
     */
    private async loadFAQs(): Promise<void> {
        console.log('加载常见问题');
        
        try {
            // 在实际实现中，这里会从云端API获取常见问题
            // const response = await fetch(`${this._cloudBaseUrl}/faqs`);
            
            // if (!response.ok) {
            //     throw new Error(`加载常见问题失败: ${response.status} ${response.statusText}`);
            // }
            
            // this._faqs = await response.json();
            
            // 模拟常见问题数据
            this._faqs = [
                {
                    id: 'faq_1',
                    category: '账号',
                    question: '如何修改我的游戏昵称？',
                    answer: '您可以在游戏设置中点击"个人资料"，然后点击昵称旁边的编辑按钮进行修改。',
                    tags: ['昵称', '修改', '个人资料'],
                    viewCount: 1245,
                    helpful: 89,
                    unhelpful: 3
                },
                {
                    id: 'faq_2',
                    category: '支付',
                    question: '购买了商品但没有收到，怎么办？',
                    answer: '请先检查您的网络连接是否正常，然后重启游戏尝试。如果问题仍然存在，请在"我的订单"中找到该订单，点击"联系客服"按钮提交问题。',
                    tags: ['支付', '商品', '未到账'],
                    viewCount: 3567,
                    helpful: 256,
                    unhelpful: 12
                },
                {
                    id: 'faq_3',
                    category: '游戏玩法',
                    question: '特殊方块有哪些功能？',
                    answer: '游戏中有多种特殊方块：\n1. 炸弹方块：消除周围3x3范围内的所有方块\n2. 彩虹方块：可以匹配任意颜色的方块\n3. 直线消除方块：消除整行或整列的方块',
                    tags: ['特殊方块', '功能', '玩法'],
                    viewCount: 5678,
                    helpful: 432,
                    unhelpful: 8
                },
                {
                    id: 'faq_4',
                    category: '游戏玩法',
                    question: '如何获得更多能量？',
                    answer: '您可以通过以下方式获得更多能量：\n1. 连续消除方块形成连击\n2. 使用特殊方块\n3. 完成每日任务\n4. 观看广告获得能量加速',
                    tags: ['能量', '获取', '玩法'],
                    viewCount: 4321,
                    helpful: 321,
                    unhelpful: 5
                },
                {
                    id: 'faq_5',
                    category: '账号',
                    question: '如何绑定微信账号？',
                    answer: '在游戏设置中点击"账号"，然后点击"绑定微信"按钮，按照提示完成授权即可。',
                    tags: ['微信', '绑定', '账号'],
                    viewCount: 2345,
                    helpful: 178,
                    unhelpful: 7
                }
            ];
        } catch (error) {
            console.error('加载常见问题失败', error);
        }
    }
    
    /**
     * 启动消息检查定时器
     */
    private startCheckTimer(): void {
        // 清除可能存在的旧定时器
        if (this._checkTimer) {
            clearInterval(this._checkTimer);
        }
        
        // 设置新定时器
        this._checkTimer = setInterval(() => {
            this.checkNewMessages();
        }, this._checkInterval);
    }
    
    /**
     * 停止消息检查定时器
     */
    private stopCheckTimer(): void {
        if (this._checkTimer) {
            clearInterval(this._checkTimer);
            this._checkTimer = null;
        }
    }
    
    /**
     * 检查新消息
     */
    private async checkNewMessages(): Promise<void> {
        console.log('检查新消息');
        
        try {
            // 在实际实现中，这里会从云端API获取新消息
            // const response = await fetch(`${this._cloudBaseUrl}/messages/unread`);
            
            // if (!response.ok) {
            //     throw new Error(`检查新消息失败: ${response.status} ${response.statusText}`);
            // }
            
            // const newMessages = await response.json();
            
            // 模拟新消息
            const hasNewMessage = Math.random() > 0.7; // 30%概率有新消息
            
            if (hasNewMessage) {
                const newMessage: MessageInfo = {
                    id: `msg_${Date.now()}`,
                    issueId: 'issue_1',
                    senderId: 'admin_1',
                    isAdmin: true,
                    content: '您好，我们已经收到您的反馈，正在处理中。',
                    createTime: Date.now(),
                    isRead: false
                };
                
                // 更新消息列表
                const messages = this._messages.get(newMessage.issueId) || [];
                messages.push(newMessage);
                this._messages.set(newMessage.issueId, messages);
                
                // 更新未读消息计数
                this._unreadMessageCount++;
                
                // 触发新消息回调
                if (this._onNewMessageCallback) {
                    this._onNewMessageCallback(newMessage);
                }
            }
        } catch (error) {
            console.error('检查新消息失败', error);
        }
    }
    
    /**
     * 提交问题
     * @param type 问题类型
     * @param title 问题标题
     * @param content 问题内容
     * @param attachments 附件URL
     * @returns 问题ID
     */
    async submitIssue(type: IssueType, title: string, content: string, attachments?: string[]): Promise<string | null> {
        console.log(`提交问题: ${type} - ${title}`);
        
        try {
            // 在实际实现中，这里会调用云端API提交问题
            // const response = await fetch(`${this._cloudBaseUrl}/issues`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         type,
            //         title,
            //         content,
            //         attachments
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`提交问题失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.json();
            
            // 模拟提交成功
            const issueId = `issue_${Date.now()}`;
            const now = Date.now();
            
            // 创建问题
            const issue: IssueInfo = {
                id: issueId,
                userId: 'current_user',
                type,
                title,
                content,
                attachments,
                status: IssueStatus.PENDING,
                priority: IssuePriority.MEDIUM,
                createTime: now,
                updateTime: now
            };
            
            // 添加到问题列表
            this._issues.set(issueId, issue);
            
            // 创建初始消息
            const message: MessageInfo = {
                id: `msg_${now}`,
                issueId,
                senderId: 'current_user',
                isAdmin: false,
                content,
                attachments,
                createTime: now,
                isRead: true
            };
            
            // 添加到消息列表
            this._messages.set(issueId, [message]);
            
            return issueId;
        } catch (error) {
            console.error('提交问题失败', error);
            return null;
        }
    }
    
    /**
     * 发送消息
     * @param issueId 问题ID
     * @param content 消息内容
     * @param attachments 附件URL
     * @returns 是否发送成功
     */
    async sendMessage(issueId: string, content: string, attachments?: string[]): Promise<boolean> {
        console.log(`发送消息: ${issueId} - ${content}`);
        
        try {
            // 检查问题是否存在
            if (!this._issues.has(issueId)) {
                console.error(`问题 ${issueId} 不存在`);
                return false;
            }
            
            // 在实际实现中，这里会调用云端API发送消息
            // const response = await fetch(`${this._cloudBaseUrl}/issues/${issueId}/messages`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         content,
            //         attachments
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`发送消息失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟发送成功
            const now = Date.now();
            
            // 创建消息
            const message: MessageInfo = {
                id: `msg_${now}`,
                issueId,
                senderId: 'current_user',
                isAdmin: false,
                content,
                attachments,
                createTime: now,
                isRead: true
            };
            
            // 添加到消息列表
            const messages = this._messages.get(issueId) || [];
            messages.push(message);
            this._messages.set(issueId, messages);
            
            // 更新问题状态
            const issue = this._issues.get(issueId);
            if (issue) {
                issue.updateTime = now;
                if (issue.status === IssueStatus.RESOLVED) {
                    // 如果问题已解决，但用户又发送了消息，则重新打开问题
                    issue.status = IssueStatus.PROCESSING;
                }
                this._issues.set(issueId, issue);
            }
            
            return true;
        } catch (error) {
            console.error('发送消息失败', error);
            return false;
        }
    }
    
    /**
     * 获取问题列表
     * @param status 问题状态（可选）
     * @returns 问题列表
     */
    async getIssues(status?: IssueStatus): Promise<IssueInfo[]> {
        console.log(`获取问题列表${status ? `: ${status}` : ''}`);
        
        try {
            // 在实际实现中，这里会从云端API获取问题列表
            // const url = status ? `${this._cloudBaseUrl}/issues?status=${status}` : `${this._cloudBaseUrl}/issues`;
            // const response = await fetch(url);
            
            // if (!response.ok) {
            //     throw new Error(`获取问题列表失败: ${response.status} ${response.statusText}`);
            // }
            
            // return await response.json();
            
            // 从本地获取问题列表
            let issues = Array.from(this._issues.values());
            
            // 如果指定了状态，则过滤
            if (status) {
                issues = issues.filter(issue => issue.status === status);
            }
            
            // 按更新时间降序排序
            issues.sort((a, b) => b.updateTime - a.updateTime);
            
            return issues;
        } catch (error) {
            console.error('获取问题列表失败', error);
            return [];
        }
    }
    
    /**
     * 获取问题详情
     * @param issueId 问题ID
     * @returns 问题详情
     */
    async getIssue(issueId: string): Promise<IssueInfo | null> {
        console.log(`获取问题详情: ${issueId}`);
        
        try {
            // 在实际实现中，这里会从云端API获取问题详情
            // const response = await fetch(`${this._cloudBaseUrl}/issues/${issueId}`);
            
            // if (!response.ok) {
            //     throw new Error(`获取问题详情失败: ${response.status} ${response.statusText}`);
            // }
            
            // return await response.json();
            
            // 从本地获取问题详情
            return this._issues.get(issueId) || null;
        } catch (error) {
            console.error('获取问题详情失败', error);
            return null;
        }
    }
    
    /**
     * 获取问题消息列表
     * @param issueId 问题ID
     * @returns 消息列表
     */
    async getMessages(issueId: string): Promise<MessageInfo[]> {
        console.log(`获取问题消息列表: ${issueId}`);
        
        try {
            // 在实际实现中，这里会从云端API获取消息列表
            // const response = await fetch(`${this._cloudBaseUrl}/issues/${issueId}/messages`);
            
            // if (!response.ok) {
            //     throw new Error(`获取消息列表失败: ${response.status} ${response.statusText}`);
            // }
            
            // const messages = await response.json();
            
            // 从本地获取消息列表
            const messages = this._messages.get(issueId) || [];
            
            // 标记所有消息为已读
            for (const message of messages) {
                if (!message.isRead && message.isAdmin) {
                    message.isRead = true;
                    this._unreadMessageCount = Math.max(0, this._unreadMessageCount - 1);
                }
            }
            
            // 按时间升序排序
            messages.sort((a, b) => a.createTime - b.createTime);
            
            return messages;
        } catch (error) {
            console.error('获取消息列表失败', error);
            return [];
        }
    }
    
    /**
     * 关闭问题
     * @param issueId 问题ID
     * @returns 是否关闭成功
     */
    async closeIssue(issueId: string): Promise<boolean> {
        console.log(`关闭问题: ${issueId}`);
        
        try {
            // 在实际实现中，这里会调用云端API关闭问题
            // const response = await fetch(`${this._cloudBaseUrl}/issues/${issueId}/close`, {
            //     method: 'POST'
            // });
            
            // if (!response.ok) {
            //     throw new Error(`关闭问题失败: ${response.status} ${response.statusText}`);
            // }
            
            // 从本地关闭问题
            const issue = this._issues.get(issueId);
            if (!issue) {
                console.error(`问题 ${issueId} 不存在`);
                return false;
            }
            
            issue.status = IssueStatus.CLOSED;
            issue.updateTime = Date.now();
            this._issues.set(issueId, issue);
            
            return true;
        } catch (error) {
            console.error('关闭问题失败', error);
            return false;
        }
    }
    
    /**
     * 评价问题解决情况
     * @param issueId 问题ID
     * @param satisfied 是否满意
     * @param feedback 反馈内容
     * @returns 是否评价成功
     */
    async rateIssue(issueId: string, satisfied: boolean, feedback?: string): Promise<boolean> {
        console.log(`评价问题: ${issueId} - ${satisfied ? '满意' : '不满意'}`);
        
        try {
            // 在实际实现中，这里会调用云端API评价问题
            // const response = await fetch(`${this._cloudBaseUrl}/issues/${issueId}/rate`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         satisfied,
            //         feedback
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`评价问题失败: ${response.status} ${response.statusText}`);
            // }
            
            // 模拟评价成功
            return true;
        } catch (error) {
            console.error('评价问题失败', error);
            return false;
        }
    }
    
    /**
     * 获取常见问题列表
     * @param category 分类（可选）
     * @param keyword 关键词（可选）
     * @returns 常见问题列表
     */
    async getFAQs(category?: string, keyword?: string): Promise<FAQInfo[]> {
        console.log(`获取常见问题列表${category ? `: ${category}` : ''}${keyword ? ` 关键词: ${keyword}` : ''}`);
        
        try {
            // 在实际实现中，这里会从云端API获取常见问题列表
            // const params = new URLSearchParams();
            // if (category) params.append('category', category);
            // if (keyword) params.append('keyword', keyword);
            // const url = `${this._cloudBaseUrl}/faqs?${params.toString()}`;
            // const response = await fetch(url);
            
            // if (!response.ok) {
            //     throw new Error(`获取常见问题列表失败: ${response.status} ${response.statusText}`);
            // }
            
            // return await response.json();
            
            // 从本地获取常见问题列表
            let faqs = [...this._faqs];
            
            // 如果指定了分类，则过滤
            if (category) {
                faqs = faqs.filter(faq => faq.category === category);
            }
            
            // 如果指定了关键词，则过滤
            if (keyword) {
                const lowerKeyword = keyword.toLowerCase();
                faqs = faqs.filter(faq => 
                    faq.question.toLowerCase().includes(lowerKeyword) || 
                    faq.answer.toLowerCase().includes(lowerKeyword) ||
                    faq.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
                );
            }
            
            // 按查看次数降序排序
            faqs.sort((a, b) => b.viewCount - a.viewCount);
            
            return faqs;
        } catch (error) {
            console.error('获取常见问题列表失败', error);
            return [];
        }
    }
    
    /**
     * 获取常见问题详情
     * @param faqId 常见问题ID
     * @returns 常见问题详情
     */
    async getFAQ(faqId: string): Promise<FAQInfo | null> {
        console.log(`获取常见问题详情: ${faqId}`);
        
        try {
            // 在实际实现中，这里会从云端API获取常见问题详情
            // const response = await fetch(`${this._cloudBaseUrl}/faqs/${faqId}`);
            
            // if (!response.ok) {
            //     throw new Error(`获取常见问题详情失败: ${response.status} ${response.statusText}`);
            // }
            
            // const faq = await response.json();
            
            // 从本地获取常见问题详情
            const faq = this._faqs.find(f => f.id === faqId);
            
            if (faq) {
                // 增加查看次数
                faq.viewCount++;
                
                return faq;
            }
            
            return null;
        } catch (error) {
            console.error('获取常见问题详情失败', error);
            return null;
        }
    }
    
    /**
     * 评价常见问题是否有帮助
     * @param faqId 常见问题ID
     * @param helpful 是否有帮助
     * @returns 是否评价成功
     */
    async rateFAQ(faqId: string, helpful: boolean): Promise<boolean> {
        console.log(`评价常见问题: ${faqId} - ${helpful ? '有帮助' : '无帮助'}`);
        
        try {
            // 在实际实现中，这里会调用云端API评价常见问题
            // const response = await fetch(`${this._cloudBaseUrl}/faqs/${faqId}/rate`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         helpful
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`评价常见问题失败: ${response.status} ${response.statusText}`);
            // }
            
            // 从本地评价常见问题
            const faq = this._faqs.find(f => f.id === faqId);
            
            if (faq) {
                if (helpful) {
                    faq.helpful++;
                } else {
                    faq.unhelpful++;
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('评价常见问题失败', error);
            return false;
        }
    }
    
    /**
     * 获取未读消息数量
     * @returns 未读消息数量
     */
    getUnreadMessageCount(): number {
        return this._unreadMessageCount;
    }
    
    /**
     * 设置新消息回调
     * @param callback 回调函数
     */
    setOnNewMessageCallback(callback: (message: MessageInfo) => void): void {
        this._onNewMessageCallback = callback;
    }
    
    /**
     * 设置检查间隔
     * @param interval 间隔（毫秒）
     */
    setCheckInterval(interval: number): void {
        this._checkInterval = interval;
        
        // 重启检查定时器
        this.startCheckTimer();
    }
    
    /**
     * 销毁服务
     */
    destroy(): void {
        // 停止检查定时器
        this.stopCheckTimer();
    }
}
