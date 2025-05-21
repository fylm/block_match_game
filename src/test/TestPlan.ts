// TestPlan.ts - 测试计划与测试用例

/**
 * 测试类型枚举
 */
export enum TestType {
    UNIT = 'unit',               // 单元测试
    INTEGRATION = 'integration', // 集成测试
    FUNCTIONAL = 'functional',   // 功能测试
    PERFORMANCE = 'performance', // 性能测试
    SECURITY = 'security',       // 安全测试
    COMPATIBILITY = 'compatibility', // 兼容性测试
    USER_EXPERIENCE = 'user_experience' // 用户体验测试
}

/**
 * 测试优先级枚举
 */
export enum TestPriority {
    LOW = 'low',         // 低优先级
    MEDIUM = 'medium',   // 中优先级
    HIGH = 'high',       // 高优先级
    CRITICAL = 'critical' // 关键优先级
}

/**
 * 测试状态枚举
 */
export enum TestStatus {
    NOT_STARTED = 'not_started', // 未开始
    IN_PROGRESS = 'in_progress', // 进行中
    PASSED = 'passed',           // 通过
    FAILED = 'failed',           // 失败
    BLOCKED = 'blocked'          // 阻塞
}

/**
 * 测试用例接口
 */
export interface TestCase {
    id: string;                  // 测试用例ID
    name: string;                // 测试用例名称
    description: string;         // 测试用例描述
    type: TestType;              // 测试类型
    priority: TestPriority;      // 优先级
    module: string;              // 所属模块
    preconditions: string;       // 前置条件
    steps: string[];             // 测试步骤
    expectedResults: string[];   // 预期结果
    status: TestStatus;          // 测试状态
    assignee?: string;           // 负责人
    createdAt: number;           // 创建时间
    updatedAt: number;           // 更新时间
    executedAt?: number;         // 执行时间
    executionNotes?: string;     // 执行备注
    bugReferences?: string[];    // 关联的bug
}

/**
 * Bug严重程度枚举
 */
export enum BugSeverity {
    TRIVIAL = 'trivial',     // 轻微
    MINOR = 'minor',         // 次要
    MAJOR = 'major',         // 主要
    CRITICAL = 'critical',   // 严重
    BLOCKER = 'blocker'      // 阻塞
}

/**
 * Bug状态枚举
 */
export enum BugStatus {
    NEW = 'new',             // 新建
    ASSIGNED = 'assigned',   // 已分配
    FIXED = 'fixed',         // 已修复
    VERIFIED = 'verified',   // 已验证
    CLOSED = 'closed',       // 已关闭
    REOPENED = 'reopened'    // 重新打开
}

/**
 * Bug信息接口
 */
export interface BugInfo {
    id: string;              // Bug ID
    title: string;           // Bug标题
    description: string;     // Bug描述
    steps: string[];         // 重现步骤
    severity: BugSeverity;   // 严重程度
    priority: TestPriority;  // 优先级
    status: BugStatus;       // 状态
    module: string;          // 所属模块
    assignee?: string;       // 负责人
    reporter: string;        // 报告人
    environment: string;     // 环境信息
    attachments?: string[];  // 附件
    createdAt: number;       // 创建时间
    updatedAt: number;       // 更新时间
    fixedAt?: number;        // 修复时间
    verifiedAt?: number;     // 验证时间
    closedAt?: number;       // 关闭时间
    relatedTestCases?: string[]; // 关联的测试用例
}

/**
 * 测试计划类
 * 负责管理测试用例和Bug
 */
export class TestPlan {
    private _testCases: Map<string, TestCase> = new Map();
    private _bugs: Map<string, BugInfo> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化测试用例
        this.initializeTestCases();
    }
    
    /**
     * 初始化测试用例
     */
    private initializeTestCases(): void {
        // 核心玩法测试用例
        this.addTestCase({
            id: 'TC001',
            name: '方块生成与布局测试',
            description: '测试游戏开始时方块的生成和布局是否正确',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '核心玩法',
            preconditions: '游戏已启动，进入游戏界面',
            steps: [
                '1. 开始新游戏',
                '2. 观察方块生成情况',
                '3. 检查方块布局是否符合设计'
            ],
            expectedResults: [
                '1. 游戏成功开始',
                '2. 方块正确生成，无缺失或重叠',
                '3. 方块布局符合设计，颜色分布均匀'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC002',
            name: '连线判定算法测试',
            description: '测试连线判定算法是否正确识别有效的连线',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.CRITICAL,
            module: '核心玩法',
            preconditions: '游戏已启动，进入游戏界面，有可连接的方块',
            steps: [
                '1. 选择一个方块',
                '2. 尝试连接相邻的同色方块',
                '3. 尝试连接非相邻的同色方块',
                '4. 尝试连接不同色的方块',
                '5. 尝试水平、垂直、对角线连接'
            ],
            expectedResults: [
                '1. 方块被选中，有高亮效果',
                '2. 相邻同色方块成功连接',
                '3. 非相邻同色方块无法连接',
                '4. 不同色方块无法连接',
                '5. 水平、垂直、对角线连接均正确判定'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC003',
            name: '消除机制测试',
            description: '测试方块消除机制是否正常工作',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '核心玩法',
            preconditions: '游戏已启动，进入游戏界面，有可连接的方块',
            steps: [
                '1. 连接3个相同颜色的方块',
                '2. 连接4个相同颜色的方块',
                '3. 连接5个及以上相同颜色的方块',
                '4. 观察消除动画和音效'
            ],
            expectedResults: [
                '1. 3个方块成功消除',
                '2. 4个方块成功消除，可能生成特殊方块',
                '3. 5个及以上方块成功消除，生成更强力的特殊方块',
                '4. 消除动画流畅，音效正确'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC004',
            name: '特殊方块功能测试',
            description: '测试特殊方块的功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '核心玩法',
            preconditions: '游戏已启动，进入游戏界面，有特殊方块',
            steps: [
                '1. 使用炸弹方块',
                '2. 使用彩虹方块',
                '3. 使用直线消除方块',
                '4. 观察特殊方块的效果'
            ],
            expectedResults: [
                '1. 炸弹方块消除周围3x3范围内的所有方块',
                '2. 彩虹方块可以匹配任意颜色的方块',
                '3. 直线消除方块消除整行或整列的方块',
                '4. 特殊方块效果显示正确，有相应的动画和音效'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC005',
            name: '能量槽系统测试',
            description: '测试能量槽系统是否正常工作',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.MEDIUM,
            module: '核心玩法',
            preconditions: '游戏已启动，进入游戏界面',
            steps: [
                '1. 消除方块，观察能量槽变化',
                '2. 使用特殊方块，观察能量槽变化',
                '3. 能量槽充满后点击释放',
                '4. 观察能量爆发效果'
            ],
            expectedResults: [
                '1. 消除方块后能量槽增加',
                '2. 使用特殊方块后能量槽增加更多',
                '3. 能量槽充满后可以点击释放',
                '4. 能量爆发效果正确，清除大范围方块'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 社交与互动功能测试用例
        this.addTestCase({
            id: 'TC006',
            name: '微信登录测试',
            description: '测试微信账号登录功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.CRITICAL,
            module: '社交与互动',
            preconditions: '游戏已启动，用户未登录',
            steps: [
                '1. 点击登录按钮',
                '2. 选择微信登录',
                '3. 授权微信登录',
                '4. 观察登录结果'
            ],
            expectedResults: [
                '1. 显示登录选项',
                '2. 跳转到微信授权页面',
                '3. 授权成功',
                '4. 成功登录游戏，显示用户信息'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC007',
            name: '好友排行榜测试',
            description: '测试好友排行榜功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.MEDIUM,
            module: '社交与互动',
            preconditions: '游戏已启动，用户已登录',
            steps: [
                '1. 进入排行榜界面',
                '2. 切换到好友排行榜',
                '3. 查看好友排名和分数',
                '4. 点击好友头像'
            ],
            expectedResults: [
                '1. 成功进入排行榜界面',
                '2. 显示好友排行榜',
                '3. 正确显示好友排名和分数',
                '4. 显示好友详细信息'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC008',
            name: '省份战队系统测试',
            description: '测试省份战队系统功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.MEDIUM,
            module: '社交与互动',
            preconditions: '游戏已启动，用户已登录',
            steps: [
                '1. 进入省份战队界面',
                '2. 选择加入省份',
                '3. 为省份贡献分数',
                '4. 查看省份排名'
            ],
            expectedResults: [
                '1. 成功进入省份战队界面',
                '2. 成功加入选择的省份',
                '3. 分数成功贡献给省份',
                '4. 正确显示省份排名'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 变现功能测试用例
        this.addTestCase({
            id: 'TC009',
            name: '激励视频广告测试',
            description: '测试激励视频广告功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '变现功能',
            preconditions: '游戏已启动，有激励视频广告场景',
            steps: [
                '1. 触发激励视频广告场景（如复活、获取道具等）',
                '2. 点击观看广告按钮',
                '3. 完整观看广告',
                '4. 观察奖励发放'
            ],
            expectedResults: [
                '1. 正确显示激励视频广告选项',
                '2. 成功加载并播放广告',
                '3. 广告播放完成',
                '4. 正确发放奖励'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC010',
            name: '商城购买测试',
            description: '测试商城购买功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '变现功能',
            preconditions: '游戏已启动，用户已登录，进入商城界面',
            steps: [
                '1. 浏览商品列表',
                '2. 选择一个商品',
                '3. 点击购买按钮',
                '4. 完成支付',
                '5. 观察商品发放'
            ],
            expectedResults: [
                '1. 正确显示商品列表',
                '2. 显示商品详情',
                '3. 跳转到支付界面',
                '4. 支付成功',
                '5. 正确发放商品'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 后端服务测试用例
        this.addTestCase({
            id: 'TC011',
            name: '用户数据同步测试',
            description: '测试用户数据同步功能是否正常',
            type: TestType.INTEGRATION,
            priority: TestPriority.CRITICAL,
            module: '后端服务',
            preconditions: '游戏已启动，用户已登录',
            steps: [
                '1. 进行游戏操作（如完成关卡、获得分数等）',
                '2. 退出游戏',
                '3. 重新登录游戏',
                '4. 检查数据是否同步'
            ],
            expectedResults: [
                '1. 游戏操作正常',
                '2. 成功退出游戏',
                '3. 成功重新登录',
                '4. 数据正确同步，无丢失'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC012',
            name: '热更新机制测试',
            description: '测试热更新机制是否正常工作',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.HIGH,
            module: '后端服务',
            preconditions: '游戏已启动，有可用更新',
            steps: [
                '1. 启动游戏',
                '2. 检查更新',
                '3. 下载更新',
                '4. 应用更新',
                '5. 验证更新内容'
            ],
            expectedResults: [
                '1. 游戏成功启动',
                '2. 成功检测到更新',
                '3. 成功下载更新',
                '4. 成功应用更新',
                '5. 更新内容正确生效'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 性能测试用例
        this.addTestCase({
            id: 'TC013',
            name: '游戏启动性能测试',
            description: '测试游戏启动时间和资源加载性能',
            type: TestType.PERFORMANCE,
            priority: TestPriority.MEDIUM,
            module: '性能',
            preconditions: '游戏未启动',
            steps: [
                '1. 启动游戏',
                '2. 记录启动时间',
                '3. 记录资源加载时间',
                '4. 记录内存占用'
            ],
            expectedResults: [
                '1. 游戏成功启动',
                '2. 启动时间在可接受范围内（<3秒）',
                '3. 资源加载时间在可接受范围内（<5秒）',
                '4. 内存占用在可接受范围内（<100MB）'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC014',
            name: '游戏帧率测试',
            description: '测试游戏在各种操作下的帧率表现',
            type: TestType.PERFORMANCE,
            priority: TestPriority.HIGH,
            module: '性能',
            preconditions: '游戏已启动，进入游戏界面',
            steps: [
                '1. 记录静态界面帧率',
                '2. 进行方块连接和消除操作，记录帧率',
                '3. 触发特殊方块效果，记录帧率',
                '4. 触发能量爆发效果，记录帧率'
            ],
            expectedResults: [
                '1. 静态界面帧率稳定在60fps',
                '2. 方块操作时帧率不低于50fps',
                '3. 特殊方块效果时帧率不低于45fps',
                '4. 能量爆发效果时帧率不低于40fps'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 兼容性测试用例
        this.addTestCase({
            id: 'TC015',
            name: '设备兼容性测试',
            description: '测试游戏在不同设备上的兼容性',
            type: TestType.COMPATIBILITY,
            priority: TestPriority.HIGH,
            module: '兼容性',
            preconditions: '准备不同型号的设备',
            steps: [
                '1. 在低端设备上运行游戏',
                '2. 在中端设备上运行游戏',
                '3. 在高端设备上运行游戏',
                '4. 检查UI适配情况',
                '5. 检查性能表现'
            ],
            expectedResults: [
                '1. 低端设备上游戏可正常运行，可能有性能降级但功能完整',
                '2. 中端设备上游戏正常运行，性能良好',
                '3. 高端设备上游戏运行流畅，效果最佳',
                '4. UI在各种屏幕尺寸和分辨率下正确适配',
                '5. 性能根据设备等级有合理的表现'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 安全测试用例
        this.addTestCase({
            id: 'TC016',
            name: '数据安全测试',
            description: '测试游戏数据的安全性',
            type: TestType.SECURITY,
            priority: TestPriority.CRITICAL,
            module: '安全',
            preconditions: '游戏已启动，用户已登录',
            steps: [
                '1. 检查数据传输加密',
                '2. 检查本地数据存储安全',
                '3. 尝试篡改本地数据',
                '4. 检查服务器验证机制'
            ],
            expectedResults: [
                '1. 数据传输使用HTTPS加密',
                '2. 本地敏感数据有加密保护',
                '3. 篡改本地数据后服务器能检测并拒绝',
                '4. 服务器有有效的数据验证机制'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        // 用户体验测试用例
        this.addTestCase({
            id: 'TC017',
            name: '新手引导测试',
            description: '测试新手引导流程的用户体验',
            type: TestType.USER_EXPERIENCE,
            priority: TestPriority.HIGH,
            module: '用户体验',
            preconditions: '新用户首次启动游戏',
            steps: [
                '1. 首次启动游戏',
                '2. 跟随新手引导流程',
                '3. 完成引导任务',
                '4. 评估引导的清晰度和易用性'
            ],
            expectedResults: [
                '1. 游戏首次启动自动显示新手引导',
                '2. 引导流程清晰，步骤合理',
                '3. 引导任务容易完成',
                '4. 引导结束后用户能理解基本玩法'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC018',
            name: '游戏难度曲线测试',
            description: '测试游戏难度曲线的合理性',
            type: TestType.USER_EXPERIENCE,
            priority: TestPriority.MEDIUM,
            module: '用户体验',
            preconditions: '游戏已启动，可访问多个关卡',
            steps: [
                '1. 完成初始关卡',
                '2. 逐步挑战更高难度关卡',
                '3. 记录每个关卡的完成情况',
                '4. 评估难度递增的合理性'
            ],
            expectedResults: [
                '1. 初始关卡容易完成',
                '2. 难度随关卡递增而平滑上升',
                '3. 关卡难度与玩家技能成长匹配',
                '4. 难度曲线合理，既有挑战性又不会过于挫折'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC019',
            name: '游戏反馈与奖励测试',
            description: '测试游戏反馈与奖励机制的用户体验',
            type: TestType.USER_EXPERIENCE,
            priority: TestPriority.HIGH,
            module: '用户体验',
            preconditions: '游戏已启动，进入游戏界面',
            steps: [
                '1. 进行方块连接和消除操作',
                '2. 触发连击奖励',
                '3. 完成关卡目标',
                '4. 评估视觉和音效反馈'
            ],
            expectedResults: [
                '1. 操作有即时的视觉和音效反馈',
                '2. 连击奖励明显且令人满足',
                '3. 完成目标有清晰的庆祝反馈',
                '4. 整体反馈系统增强游戏乐趣'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        this.addTestCase({
            id: 'TC020',
            name: '防沉迷系统测试',
            description: '测试防沉迷系统功能是否正常',
            type: TestType.FUNCTIONAL,
            priority: TestPriority.CRITICAL,
            module: '后端服务',
            preconditions: '游戏已启动，模拟未成年用户',
            steps: [
                '1. 以未成年用户身份登录',
                '2. 进行实名认证',
                '3. 持续游戏超过规定时间',
                '4. 在夜间禁止时段尝试游戏',
                '5. 检查游戏时间限制提醒'
            ],
            expectedResults: [
                '1. 成功登录',
                '2. 实名认证流程正确',
                '3. 超过时间限制后强制退出',
                '4. 夜间禁止时段无法游戏',
                '5. 时间限制提醒正确显示'
            ],
            status: TestStatus.NOT_STARTED,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }
    
    /**
     * 添加测试用例
     * @param testCase 测试用例
     */
    addTestCase(testCase: TestCase): void {
        this._testCases.set(testCase.id, testCase);
    }
    
    /**
     * 添加Bug
     * @param bug Bug信息
     */
    addBug(bug: BugInfo): void {
        this._bugs.set(bug.id, bug);
    }
    
    /**
     * 获取所有测试用例
     * @param type 测试类型（可选）
     * @param status 测试状态（可选）
     * @returns 测试用例列表
     */
    getTestCases(type?: TestType, status?: TestStatus): TestCase[] {
        let testCases = Array.from(this._testCases.values());
        
        if (type) {
            testCases = testCases.filter(tc => tc.type === type);
        }
        
        if (status) {
            testCases = testCases.filter(tc => tc.status === status);
        }
        
        return testCases;
    }
    
    /**
     * 获取所有Bug
     * @param status Bug状态（可选）
     * @param severity Bug严重程度（可选）
     * @returns Bug列表
     */
    getBugs(status?: BugStatus, severity?: BugSeverity): BugInfo[] {
        let bugs = Array.from(this._bugs.values());
        
        if (status) {
            bugs = bugs.filter(bug => bug.status === status);
        }
        
        if (severity) {
            bugs = bugs.filter(bug => bug.severity === severity);
        }
        
        return bugs;
    }
    
    /**
     * 更新测试用例状态
     * @param id 测试用例ID
     * @param status 新状态
     * @param executionNotes 执行备注
     * @returns 是否更新成功
     */
    updateTestCaseStatus(id: string, status: TestStatus, executionNotes?: string): boolean {
        const testCase = this._testCases.get(id);
        
        if (!testCase) {
            return false;
        }
        
        testCase.status = status;
        testCase.updatedAt = Date.now();
        
        if (status === TestStatus.PASSED || status === TestStatus.FAILED) {
            testCase.executedAt = Date.now();
        }
        
        if (executionNotes) {
            testCase.executionNotes = executionNotes;
        }
        
        this._testCases.set(id, testCase);
        
        return true;
    }
    
    /**
     * 更新Bug状态
     * @param id Bug ID
     * @param status 新状态
     * @returns 是否更新成功
     */
    updateBugStatus(id: string, status: BugStatus): boolean {
        const bug = this._bugs.get(id);
        
        if (!bug) {
            return false;
        }
        
        bug.status = status;
        bug.updatedAt = Date.now();
        
        switch (status) {
            case BugStatus.FIXED:
                bug.fixedAt = Date.now();
                break;
            case BugStatus.VERIFIED:
                bug.verifiedAt = Date.now();
                break;
            case BugStatus.CLOSED:
                bug.closedAt = Date.now();
                break;
        }
        
        this._bugs.set(id, bug);
        
        return true;
    }
    
    /**
     * 关联Bug和测试用例
     * @param bugId Bug ID
     * @param testCaseId 测试用例ID
     * @returns 是否关联成功
     */
    linkBugToTestCase(bugId: string, testCaseId: string): boolean {
        const bug = this._bugs.get(bugId);
        const testCase = this._testCases.get(testCaseId);
        
        if (!bug || !testCase) {
            return false;
        }
        
        // 更新Bug关联的测试用例
        if (!bug.relatedTestCases) {
            bug.relatedTestCases = [];
        }
        
        if (!bug.relatedTestCases.includes(testCaseId)) {
            bug.relatedTestCases.push(testCaseId);
        }
        
        // 更新测试用例关联的Bug
        if (!testCase.bugReferences) {
            testCase.bugReferences = [];
        }
        
        if (!testCase.bugReferences.includes(bugId)) {
            testCase.bugReferences.push(bugId);
        }
        
        // 更新时间
        bug.updatedAt = Date.now();
        testCase.updatedAt = Date.now();
        
        // 保存更新
        this._bugs.set(bugId, bug);
        this._testCases.set(testCaseId, testCase);
        
        return true;
    }
    
    /**
     * 获取测试进度统计
     * @returns 测试进度统计
     */
    getTestProgress(): {
        total: number;
        notStarted: number;
        inProgress: number;
        passed: number;
        failed: number;
        blocked: number;
        passRate: number;
    } {
        const testCases = Array.from(this._testCases.values());
        const total = testCases.length;
        const notStarted = testCases.filter(tc => tc.status === TestStatus.NOT_STARTED).length;
        const inProgress = testCases.filter(tc => tc.status === TestStatus.IN_PROGRESS).length;
        const passed = testCases.filter(tc => tc.status === TestStatus.PASSED).length;
        const failed = testCases.filter(tc => tc.status === TestStatus.FAILED).length;
        const blocked = testCases.filter(tc => tc.status === TestStatus.BLOCKED).length;
        
        const executed = passed + failed;
        const passRate = executed > 0 ? (passed / executed) * 100 : 0;
        
        return {
            total,
            notStarted,
            inProgress,
            passed,
            failed,
            blocked,
            passRate
        };
    }
    
    /**
     * 获取Bug统计
     * @returns Bug统计
     */
    getBugStatistics(): {
        total: number;
        new: number;
        assigned: number;
        fixed: number;
        verified: number;
        closed: number;
        reopened: number;
        bySeverity: {
            trivial: number;
            minor: number;
            major: number;
            critical: number;
            blocker: number;
        };
    } {
        const bugs = Array.from(this._bugs.values());
        const total = bugs.length;
        const newBugs = bugs.filter(bug => bug.status === BugStatus.NEW).length;
        const assigned = bugs.filter(bug => bug.status === BugStatus.ASSIGNED).length;
        const fixed = bugs.filter(bug => bug.status === BugStatus.FIXED).length;
        const verified = bugs.filter(bug => bug.status === BugStatus.VERIFIED).length;
        const closed = bugs.filter(bug => bug.status === BugStatus.CLOSED).length;
        const reopened = bugs.filter(bug => bug.status === BugStatus.REOPENED).length;
        
        const trivial = bugs.filter(bug => bug.severity === BugSeverity.TRIVIAL).length;
        const minor = bugs.filter(bug => bug.severity === BugSeverity.MINOR).length;
        const major = bugs.filter(bug => bug.severity === BugSeverity.MAJOR).length;
        const critical = bugs.filter(bug => bug.severity === BugSeverity.CRITICAL).length;
        const blocker = bugs.filter(bug => bug.severity === BugSeverity.BLOCKER).length;
        
        return {
            total,
            new: newBugs,
            assigned,
            fixed,
            verified,
            closed,
            reopened,
            bySeverity: {
                trivial,
                minor,
                major,
                critical,
                blocker
            }
        };
    }
    
    /**
     * 生成测试报告
     * @returns 测试报告HTML
     */
    generateTestReport(): string {
        const progress = this.getTestProgress();
        const bugStats = this.getBugStatistics();
        
        // 生成HTML报告
        let report = `
<!DOCTYPE html>
<html>
<head>
    <title>《方块连连消》测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .progress-container { width: 100%; background-color: #f1f1f1; border-radius: 5px; }
        .progress-bar { height: 20px; border-radius: 5px; }
        .passed { background-color: #4CAF50; }
        .failed { background-color: #f44336; }
        .not-started { background-color: #9e9e9e; }
        .in-progress { background-color: #2196F3; }
        .blocked { background-color: #FF9800; }
        .summary { display: flex; justify-content: space-between; }
        .summary-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 30%; }
    </style>
</head>
<body>
    <h1>《方块连连消》测试报告</h1>
    <p>生成时间: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <div class="summary-box">
            <h3>测试用例总数</h3>
            <p style="font-size: 24px; font-weight: bold;">${progress.total}</p>
        </div>
        <div class="summary-box">
            <h3>通过率</h3>
            <p style="font-size: 24px; font-weight: bold;">${progress.passRate.toFixed(2)}%</p>
        </div>
        <div class="summary-box">
            <h3>Bug总数</h3>
            <p style="font-size: 24px; font-weight: bold;">${bugStats.total}</p>
        </div>
    </div>
    
    <h2>测试进度</h2>
    <div class="progress-container">
        <div class="progress-bar passed" style="width: ${(progress.passed / progress.total) * 100}%; float: left;"></div>
        <div class="progress-bar failed" style="width: ${(progress.failed / progress.total) * 100}%; float: left;"></div>
        <div class="progress-bar in-progress" style="width: ${(progress.inProgress / progress.total) * 100}%; float: left;"></div>
        <div class="progress-bar blocked" style="width: ${(progress.blocked / progress.total) * 100}%; float: left;"></div>
        <div class="progress-bar not-started" style="width: ${(progress.notStarted / progress.total) * 100}%; float: left;"></div>
    </div>
    <div style="clear: both; margin-bottom: 10px;"></div>
    <div>
        <span style="background-color: #4CAF50; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span> 通过 (${progress.passed})
        <span style="background-color: #f44336; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 失败 (${progress.failed})
        <span style="background-color: #2196F3; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 进行中 (${progress.inProgress})
        <span style="background-color: #FF9800; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 阻塞 (${progress.blocked})
        <span style="background-color: #9e9e9e; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 未开始 (${progress.notStarted})
    </div>
    
    <h2>Bug统计</h2>
    <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%;">
            <h3>按状态</h3>
            <table>
                <tr>
                    <th>状态</th>
                    <th>数量</th>
                </tr>
                <tr>
                    <td>新建</td>
                    <td>${bugStats.new}</td>
                </tr>
                <tr>
                    <td>已分配</td>
                    <td>${bugStats.assigned}</td>
                </tr>
                <tr>
                    <td>已修复</td>
                    <td>${bugStats.fixed}</td>
                </tr>
                <tr>
                    <td>已验证</td>
                    <td>${bugStats.verified}</td>
                </tr>
                <tr>
                    <td>已关闭</td>
                    <td>${bugStats.closed}</td>
                </tr>
                <tr>
                    <td>重新打开</td>
                    <td>${bugStats.reopened}</td>
                </tr>
            </table>
        </div>
        <div style="width: 48%;">
            <h3>按严重程度</h3>
            <table>
                <tr>
                    <th>严重程度</th>
                    <th>数量</th>
                </tr>
                <tr>
                    <td>阻塞</td>
                    <td>${bugStats.bySeverity.blocker}</td>
                </tr>
                <tr>
                    <td>严重</td>
                    <td>${bugStats.bySeverity.critical}</td>
                </tr>
                <tr>
                    <td>主要</td>
                    <td>${bugStats.bySeverity.major}</td>
                </tr>
                <tr>
                    <td>次要</td>
                    <td>${bugStats.bySeverity.minor}</td>
                </tr>
                <tr>
                    <td>轻微</td>
                    <td>${bugStats.bySeverity.trivial}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <h2>测试用例详情</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>名称</th>
            <th>模块</th>
            <th>类型</th>
            <th>优先级</th>
            <th>状态</th>
        </tr>`;
        
        // 添加测试用例行
        const testCases = Array.from(this._testCases.values());
        testCases.sort((a, b) => a.id.localeCompare(b.id));
        
        for (const tc of testCases) {
            report += `
        <tr>
            <td>${tc.id}</td>
            <td>${tc.name}</td>
            <td>${tc.module}</td>
            <td>${tc.type}</td>
            <td>${tc.priority}</td>
            <td>${tc.status}</td>
        </tr>`;
        }
        
        report += `
    </table>
    
    <h2>Bug详情</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>标题</th>
            <th>模块</th>
            <th>严重程度</th>
            <th>优先级</th>
            <th>状态</th>
            <th>报告人</th>
        </tr>`;
        
        // 添加Bug行
        const bugs = Array.from(this._bugs.values());
        bugs.sort((a, b) => a.id.localeCompare(b.id));
        
        for (const bug of bugs) {
            report += `
        <tr>
            <td>${bug.id}</td>
            <td>${bug.title}</td>
            <td>${bug.module}</td>
            <td>${bug.severity}</td>
            <td>${bug.priority}</td>
            <td>${bug.status}</td>
            <td>${bug.reporter}</td>
        </tr>`;
        }
        
        report += `
    </table>
</body>
</html>`;
        
        return report;
    }
}
