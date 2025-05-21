// 项目结构说明文档

/**
 * 《方块连连消》微信小程序游戏项目结构
 * 
 * 基于Cocos Creator引擎开发
 * 使用TypeScript作为主要开发语言
 */

// 目录结构
/**
 * /src                  - 源代码目录
 *   /core               - 核心游戏逻辑
 *     /block            - 方块相关类
 *     /board            - 游戏面板相关类
 *     /algorithm        - 连线判定、消除算法
 *     /effects          - 特效和动画
 *   /ui                 - 用户界面
 *     /scenes           - 游戏场景
 *     /components       - UI组件
 *     /popups           - 弹窗界面
 *   /manager            - 管理器类
 *     /audio            - 音频管理
 *     /resource         - 资源管理
 *     /level            - 关卡管理
 *     /user             - 用户数据管理
 *   /utils              - 工具类
 *   /config             - 配置文件
 *   /network            - 网络通信
 *   /platform           - 平台相关
 * 
 * /assets               - 资源文件目录
 *   /images             - 图片资源
 *     /blocks           - 方块图片
 *     /ui               - 界面图片
 *     /effects          - 特效图片
 *     /backgrounds      - 背景图片
 *   /audio              - 音频资源
 *     /bgm              - 背景音乐
 *     /sfx              - 音效
 *   /animations         - 动画资源
 *   /prefabs            - 预制体
 *   /fonts              - 字体资源
 *   /scenes             - 场景文件
 * 
 * /docs                 - 文档目录
 *   /design             - 设计文档
 *   /api                - API文档
 *   /tutorials          - 教程文档
 */

// 核心类设计
/**
 * Block类 - 方块基类
 * 属性:
 *   - id: 唯一标识
 *   - type: 方块类型(普通、炸弹、彩虹、直线消除)
 *   - color: 方块颜色
 *   - position: 网格位置
 *   - state: 方块状态(正常、选中、消除中)
 * 方法:
 *   - select(): 选中方块
 *   - deselect(): 取消选中
 *   - eliminate(): 消除方块
 *   - playAnimation(): 播放动画
 * 
 * Board类 - 游戏面板
 * 属性:
 *   - size: 面板大小
 *   - blocks: 方块二维数组
 *   - selectedBlocks: 当前选中的方块
 * 方法:
 *   - initialize(): 初始化面板
 *   - generateBlocks(): 生成方块
 *   - checkConnection(): 检查连接
 *   - eliminateBlocks(): 消除方块
 *   - fillEmptySpaces(): 填充空缺
 *   - checkGameState(): 检查游戏状态
 * 
 * LineDetector类 - 连线判定
 * 方法:
 *   - isConnectable(): 判断两个方块是否可连接
 *   - findPath(): 寻找连接路径
 *   - validateLine(): 验证连线是否有效
 * 
 * EliminationManager类 - 消除管理
 * 方法:
 *   - eliminateNormal(): 普通消除
 *   - eliminateBomb(): 炸弹消除
 *   - eliminateRainbow(): 彩虹消除
 *   - eliminateLine(): 直线消除
 *   - calculateScore(): 计算得分
 * 
 * EnergyManager类 - 能量管理
 * 属性:
 *   - currentEnergy: 当前能量值
 *   - maxEnergy: 最大能量值
 * 方法:
 *   - addEnergy(): 增加能量
 *   - useEnergy(): 使用能量
 *   - triggerEnergyBurst(): 触发能量爆发
 * 
 * LevelManager类 - 关卡管理
 * 属性:
 *   - currentLevel: 当前关卡
 *   - levelConfig: 关卡配置
 *   - objectives: 关卡目标
 * 方法:
 *   - loadLevel(): 加载关卡
 *   - checkObjectives(): 检查目标完成情况
 *   - endLevel(): 结束关卡
 * 
 * ItemManager类 - 道具管理
 * 属性:
 *   - items: 道具列表
 * 方法:
 *   - useItem(): 使用道具
 *   - addItem(): 添加道具
 *   - getItemCount(): 获取道具数量
 */

// 游戏主循环流程
/**
 * 1. 游戏初始化
 *    - 加载资源
 *    - 初始化管理器
 *    - 设置事件监听
 * 
 * 2. 关卡加载
 *    - 读取关卡配置
 *    - 生成游戏面板
 *    - 设置关卡目标
 * 
 * 3. 游戏主循环
 *    - 玩家输入处理
 *    - 连线判定
 *    - 消除处理
 *    - 填充空缺
 *    - 特殊效果处理
 *    - 目标检查
 *    - 游戏状态更新
 * 
 * 4. 结算处理
 *    - 计算最终得分
 *    - 判定星级评价
 *    - 保存游戏进度
 *    - 显示结算界面
 */
