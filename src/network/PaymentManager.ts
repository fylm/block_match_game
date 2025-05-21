// PaymentManager.ts - 支付系统管理类

/**
 * 货币类型枚举
 */
export enum CurrencyType {
    GOLD = 'gold',       // 金币（游戏内软货币）
    DIAMOND = 'diamond'  // 钻石（游戏内硬货币）
}

/**
 * 商品类型枚举
 */
export enum ProductType {
    CURRENCY = 'currency',   // 货币商品
    ITEM = 'item',           // 道具商品
    SKIN = 'skin',           // 皮肤商品
    THEME = 'theme',         // 主题商品
    NO_ADS = 'no_ads',       // 无广告特权
    SUBSCRIPTION = 'subscription' // 订阅服务
}

/**
 * 商品信息接口
 */
export interface ProductInfo {
    id: string;              // 商品ID
    type: ProductType;       // 商品类型
    name: string;            // 商品名称
    description: string;     // 商品描述
    icon: string;            // 商品图标
    price: number;           // 价格（人民币，单位：分）
    originalPrice?: number;  // 原价（人民币，单位：分）
    content: {               // 商品内容
        type: CurrencyType | string; // 货币类型或其他类型标识
        amount: number;      // 数量
    }[];
    isHot?: boolean;         // 是否热门商品
    isLimited?: boolean;     // 是否限时商品
    endTime?: number;        // 限时结束时间戳
    isOnSale?: boolean;      // 是否在售
}

/**
 * 订单信息接口
 */
export interface OrderInfo {
    orderId: string;         // 订单ID
    productId: string;       // 商品ID
    price: number;           // 价格（人民币，单位：分）
    status: 'pending' | 'success' | 'failed' | 'refunded'; // 订单状态
    createTime: number;      // 创建时间戳
    payTime?: number;        // 支付时间戳
}

/**
 * 支付系统管理类
 */
export class PaymentManager {
    private _products: Map<string, ProductInfo> = new Map();
    private _currencyBalance: Map<CurrencyType, number> = new Map();
    private _orders: OrderInfo[] = [];
    private _noAdsEnabled: boolean = false;
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化商品列表
        this.initializeProducts();
        
        // 初始化货币余额
        this._currencyBalance.set(CurrencyType.GOLD, 1000); // 初始赠送1000金币
        this._currencyBalance.set(CurrencyType.DIAMOND, 10); // 初始赠送10钻石
        
        // 从本地存储加载数据
        this.loadData();
    }
    
    /**
     * 初始化商品列表
     */
    private initializeProducts(): void {
        // 货币商品
        this.addProduct({
            id: 'gold_small',
            type: ProductType.CURRENCY,
            name: '小袋金币',
            description: '1000金币',
            icon: 'gold_small.png',
            price: 600, // 6元
            content: [{ type: CurrencyType.GOLD, amount: 1000 }],
            isOnSale: true
        });
        
        this.addProduct({
            id: 'gold_medium',
            type: ProductType.CURRENCY,
            name: '中袋金币',
            description: '3000金币',
            icon: 'gold_medium.png',
            price: 1800, // 18元
            originalPrice: 2000,
            content: [{ type: CurrencyType.GOLD, amount: 3000 }],
            isHot: true,
            isOnSale: true
        });
        
        this.addProduct({
            id: 'gold_large',
            type: ProductType.CURRENCY,
            name: '大袋金币',
            description: '6000金币',
            icon: 'gold_large.png',
            price: 3000, // 30元
            originalPrice: 4000,
            content: [{ type: CurrencyType.GOLD, amount: 6000 }],
            isOnSale: true
        });
        
        this.addProduct({
            id: 'diamond_small',
            type: ProductType.CURRENCY,
            name: '小袋钻石',
            description: '60钻石',
            icon: 'diamond_small.png',
            price: 600, // 6元
            content: [{ type: CurrencyType.DIAMOND, amount: 60 }],
            isOnSale: true
        });
        
        this.addProduct({
            id: 'diamond_medium',
            type: ProductType.CURRENCY,
            name: '中袋钻石',
            description: '180钻石',
            icon: 'diamond_medium.png',
            price: 1800, // 18元
            originalPrice: 2000,
            content: [{ type: CurrencyType.DIAMOND, amount: 180 }],
            isOnSale: true
        });
        
        // 道具商品
        this.addProduct({
            id: 'item_package_basic',
            type: ProductType.ITEM,
            name: '基础道具包',
            description: '包含各种基础道具',
            icon: 'item_package_basic.png',
            price: 1200, // 12元
            content: [
                { type: 'undo', amount: 5 },
                { type: 'refresh', amount: 3 },
                { type: 'extraMoves', amount: 2 }
            ],
            isOnSale: true
        });
        
        // 皮肤商品
        this.addProduct({
            id: 'skin_package_1',
            type: ProductType.SKIN,
            name: '方块皮肤包1',
            description: '可爱动物系列方块皮肤',
            icon: 'skin_package_1.png',
            price: 1800, // 18元
            content: [
                { type: 'skin_cat', amount: 1 },
                { type: 'skin_dog', amount: 1 },
                { type: 'skin_rabbit', amount: 1 }
            ],
            isOnSale: true
        });
        
        // 主题商品
        this.addProduct({
            id: 'theme_ocean',
            type: ProductType.THEME,
            name: '海洋主题',
            description: '清凉海洋风格游戏主题',
            icon: 'theme_ocean.png',
            price: 1200, // 12元
            content: [{ type: 'theme_ocean', amount: 1 }],
            isOnSale: true
        });
        
        // 无广告特权
        this.addProduct({
            id: 'no_ads',
            type: ProductType.NO_ADS,
            name: '永久去除广告',
            description: '一次性购买，永久去除所有广告',
            icon: 'no_ads.png',
            price: 3000, // 30元
            content: [{ type: 'no_ads', amount: 1 }],
            isOnSale: true
        });
        
        // 订阅服务
        this.addProduct({
            id: 'vip_monthly',
            type: ProductType.SUBSCRIPTION,
            name: 'VIP月卡',
            description: '每日登录奖励、去除广告、专属皮肤',
            icon: 'vip_monthly.png',
            price: 1800, // 18元
            content: [
                { type: 'vip_status', amount: 30 }, // 30天VIP
                { type: 'daily_reward', amount: 1 }, // 每日奖励
                { type: 'no_ads', amount: 1 } // 去除广告
            ],
            isOnSale: true
        });
    }
    
    /**
     * 添加商品
     * @param product 商品信息
     */
    private addProduct(product: ProductInfo): void {
        this._products.set(product.id, product);
    }
    
    /**
     * 从本地存储加载数据
     */
    private loadData(): void {
        // 在实际实现中，这里会从微信存储或云端加载数据
        console.log('从本地存储加载支付数据');
        
        try {
            // 模拟加载过程
            const currencyBalanceStr = localStorage.getItem('currencyBalance');
            const noAdsEnabledStr = localStorage.getItem('noAdsEnabled');
            
            if (currencyBalanceStr) {
                const balance = JSON.parse(currencyBalanceStr);
                this._currencyBalance = new Map(balance);
            }
            
            if (noAdsEnabledStr) {
                this._noAdsEnabled = JSON.parse(noAdsEnabledStr);
            }
        } catch (error) {
            console.error('加载支付数据失败', error);
        }
    }
    
    /**
     * 保存数据到本地存储
     */
    private saveData(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存支付数据到本地存储');
        
        try {
            // 保存货币余额
            localStorage.setItem('currencyBalance', JSON.stringify(Array.from(this._currencyBalance.entries())));
            
            // 保存无广告状态
            localStorage.setItem('noAdsEnabled', JSON.stringify(this._noAdsEnabled));
        } catch (error) {
            console.error('保存支付数据失败', error);
        }
    }
    
    /**
     * 获取商品列表
     * @param type 商品类型（可选）
     * @returns 商品列表
     */
    getProducts(type?: ProductType): ProductInfo[] {
        const products = Array.from(this._products.values());
        
        // 如果指定了类型，则过滤
        if (type) {
            return products.filter(product => product.type === type && product.isOnSale);
        }
        
        // 否则返回所有在售商品
        return products.filter(product => product.isOnSale);
    }
    
    /**
     * 获取商品信息
     * @param productId 商品ID
     * @returns 商品信息
     */
    getProduct(productId: string): ProductInfo | undefined {
        return this._products.get(productId);
    }
    
    /**
     * 创建订单
     * @param productId 商品ID
     * @returns 订单信息
     */
    async createOrder(productId: string): Promise<OrderInfo | null> {
        // 获取商品信息
        const product = this._products.get(productId);
        if (!product || !product.isOnSale) {
            console.error(`商品 ${productId} 不存在或未在售`);
            return null;
        }
        
        // 在实际实现中，这里会调用微信支付API创建订单
        console.log(`创建订单: 商品${productId}, 价格${product.price}分`);
        
        try {
            // 生成订单ID
            const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            
            // 创建订单
            const order: OrderInfo = {
                orderId,
                productId,
                price: product.price,
                status: 'pending',
                createTime: Date.now()
            };
            
            // 添加到订单列表
            this._orders.push(order);
            
            return order;
        } catch (error) {
            console.error('创建订单失败', error);
            return null;
        }
    }
    
    /**
     * 支付订单
     * @param orderId 订单ID
     * @returns 是否支付成功
     */
    async payOrder(orderId: string): Promise<boolean> {
        // 查找订单
        const orderIndex = this._orders.findIndex(order => order.orderId === orderId);
        if (orderIndex === -1) {
            console.error(`订单 ${orderId} 不存在`);
            return false;
        }
        
        const order = this._orders[orderIndex];
        
        // 检查订单状态
        if (order.status !== 'pending') {
            console.error(`订单 ${orderId} 状态不是待支付`);
            return false;
        }
        
        // 在实际实现中，这里会调用微信支付API发起支付
        console.log(`支付订单: ${orderId}`);
        
        try {
            // 模拟支付过程
            // 1. 调用微信支付API
            // 2. 等待用户完成支付
            // 3. 接收支付结果回调
            
            // 模拟支付成功
            order.status = 'success';
            order.payTime = Date.now();
            
            // 更新订单
            this._orders[orderIndex] = order;
            
            // 处理商品内容
            await this.processOrderContent(order);
            
            return true;
        } catch (error) {
            console.error('支付订单失败', error);
            
            // 更新订单状态为失败
            order.status = 'failed';
            this._orders[orderIndex] = order;
            
            return false;
        }
    }
    
    /**
     * 处理订单内容
     * @param order 订单信息
     */
    private async processOrderContent(order: OrderInfo): Promise<void> {
        // 获取商品信息
        const product = this._products.get(order.productId);
        if (!product) {
            console.error(`商品 ${order.productId} 不存在`);
            return;
        }
        
        // 处理商品内容
        for (const item of product.content) {
            switch (item.type) {
                case CurrencyType.GOLD:
                case CurrencyType.DIAMOND:
                    // 增加货币
                    this.addCurrency(item.type, item.amount);
                    break;
                    
                case 'no_ads':
                    // 启用无广告特权
                    this._noAdsEnabled = true;
                    break;
                    
                default:
                    // 其他类型的内容（道具、皮肤、主题等）
                    // 在实际实现中，这里会调用相应的管理器添加物品
                    console.log(`添加物品: 类型${item.type}, 数量${item.amount}`);
                    break;
            }
        }
        
        // 保存数据
        this.saveData();
    }
    
    /**
     * 增加货币
     * @param type 货币类型
     * @param amount 数量
     * @returns 增加后的余额
     */
    addCurrency(type: CurrencyType, amount: number): number {
        const currentBalance = this._currencyBalance.get(type) || 0;
        const newBalance = currentBalance + amount;
        this._currencyBalance.set(type, newBalance);
        
        // 保存数据
        this.saveData();
        
        return newBalance;
    }
    
    /**
     * 消费货币
     * @param type 货币类型
     * @param amount 数量
     * @returns 是否消费成功
     */
    consumeCurrency(type: CurrencyType, amount: number): boolean {
        const currentBalance = this._currencyBalance.get(type) || 0;
        
        // 检查余额是否足够
        if (currentBalance < amount) {
            return false;
        }
        
        // 扣除货币
        const newBalance = currentBalance - amount;
        this._currencyBalance.set(type, newBalance);
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取货币余额
     * @param type 货币类型
     * @returns 余额
     */
    getCurrencyBalance(type: CurrencyType): number {
        return this._currencyBalance.get(type) || 0;
    }
    
    /**
     * 获取订单列表
     * @returns 订单列表
     */
    getOrders(): OrderInfo[] {
        return [...this._orders];
    }
    
    /**
     * 获取订单信息
     * @param orderId 订单ID
     * @returns 订单信息
     */
    getOrder(orderId: string): OrderInfo | undefined {
        return this._orders.find(order => order.orderId === orderId);
    }
    
    /**
     * 是否启用无广告特权
     */
    get noAdsEnabled(): boolean {
        return this._noAdsEnabled;
    }
}
