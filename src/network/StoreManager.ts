// StoreManager.ts - 商店管理类

import { ItemType, ItemInfo } from '../core/item/ItemManager';
import { CurrencyType, ProductType } from './PaymentManager';

/**
 * 皮肤信息接口
 */
export interface SkinInfo {
    id: string;              // 皮肤ID
    name: string;            // 皮肤名称
    description: string;     // 皮肤描述
    preview: string;         // 预览图片
    price: {                 // 价格信息
        currency: CurrencyType; // 货币类型
        amount: number;      // 价格
    };
    isUnlocked: boolean;     // 是否已解锁
    isSelected: boolean;     // 是否已选中
    category: string;        // 分类
}

/**
 * 主题信息接口
 */
export interface ThemeInfo {
    id: string;              // 主题ID
    name: string;            // 主题名称
    description: string;     // 主题描述
    preview: string;         // 预览图片
    price: {                 // 价格信息
        currency: CurrencyType; // 货币类型
        amount: number;      // 价格
    };
    isUnlocked: boolean;     // 是否已解锁
    isSelected: boolean;     // 是否已选中
    assets: {                // 资源文件
        background: string;  // 背景图片
        music: string;       // 背景音乐
        blockSet: string;    // 方块图片集
        uiSet: string;       // UI图片集
    };
}

/**
 * 商店管理类
 */
export class StoreManager {
    private _skins: Map<string, SkinInfo> = new Map();
    private _themes: Map<string, ThemeInfo> = new Map();
    private _selectedSkin: string = 'default';
    private _selectedTheme: string = 'default';
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化皮肤和主题
        this.initializeSkins();
        this.initializeThemes();
        
        // 从本地存储加载数据
        this.loadData();
    }
    
    /**
     * 初始化皮肤
     */
    private initializeSkins(): void {
        // 默认皮肤（免费）
        this.addSkin({
            id: 'default',
            name: '默认皮肤',
            description: '基础方块皮肤',
            preview: 'skin_default_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 0
            },
            isUnlocked: true,
            isSelected: true,
            category: 'basic'
        });
        
        // 普通皮肤
        this.addSkin({
            id: 'candy',
            name: '糖果皮肤',
            description: '甜蜜可口的糖果方块',
            preview: 'skin_candy_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 2000
            },
            isUnlocked: false,
            isSelected: false,
            category: 'food'
        });
        
        this.addSkin({
            id: 'space',
            name: '太空皮肤',
            description: '星际探索主题方块',
            preview: 'skin_space_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 3000
            },
            isUnlocked: false,
            isSelected: false,
            category: 'sci-fi'
        });
        
        // 高级皮肤
        this.addSkin({
            id: 'dragon',
            name: '龙之皮肤',
            description: '神秘的龙族方块，带有特殊动画效果',
            preview: 'skin_dragon_preview.png',
            price: {
                currency: CurrencyType.DIAMOND,
                amount: 50
            },
            isUnlocked: false,
            isSelected: false,
            category: 'fantasy'
        });
        
        this.addSkin({
            id: 'neon',
            name: '霓虹皮肤',
            description: '炫酷的霓虹灯效果方块',
            preview: 'skin_neon_preview.png',
            price: {
                currency: CurrencyType.DIAMOND,
                amount: 80
            },
            isUnlocked: false,
            isSelected: false,
            category: 'modern'
        });
    }
    
    /**
     * 初始化主题
     */
    private initializeThemes(): void {
        // 默认主题（免费）
        this.addTheme({
            id: 'default',
            name: '默认主题',
            description: '基础游戏主题',
            preview: 'theme_default_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 0
            },
            isUnlocked: true,
            isSelected: true,
            assets: {
                background: 'bg_default.png',
                music: 'bgm_default.mp3',
                blockSet: 'blocks_default.png',
                uiSet: 'ui_default.png'
            }
        });
        
        // 普通主题
        this.addTheme({
            id: 'forest',
            name: '森林主题',
            description: '清新自然的森林主题',
            preview: 'theme_forest_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 5000
            },
            isUnlocked: false,
            isSelected: false,
            assets: {
                background: 'bg_forest.png',
                music: 'bgm_forest.mp3',
                blockSet: 'blocks_forest.png',
                uiSet: 'ui_forest.png'
            }
        });
        
        this.addTheme({
            id: 'ocean',
            name: '海洋主题',
            description: '清凉海洋风格主题',
            preview: 'theme_ocean_preview.png',
            price: {
                currency: CurrencyType.GOLD,
                amount: 5000
            },
            isUnlocked: false,
            isSelected: false,
            assets: {
                background: 'bg_ocean.png',
                music: 'bgm_ocean.mp3',
                blockSet: 'blocks_ocean.png',
                uiSet: 'ui_ocean.png'
            }
        });
        
        // 高级主题
        this.addTheme({
            id: 'night',
            name: '星空主题',
            description: '梦幻星空主题，带有特殊粒子效果',
            preview: 'theme_night_preview.png',
            price: {
                currency: CurrencyType.DIAMOND,
                amount: 100
            },
            isUnlocked: false,
            isSelected: false,
            assets: {
                background: 'bg_night.png',
                music: 'bgm_night.mp3',
                blockSet: 'blocks_night.png',
                uiSet: 'ui_night.png'
            }
        });
        
        this.addTheme({
            id: 'festival',
            name: '节日主题',
            description: '欢乐节日主题，带有特殊音效和动画',
            preview: 'theme_festival_preview.png',
            price: {
                currency: CurrencyType.DIAMOND,
                amount: 150
            },
            isUnlocked: false,
            isSelected: false,
            assets: {
                background: 'bg_festival.png',
                music: 'bgm_festival.mp3',
                blockSet: 'blocks_festival.png',
                uiSet: 'ui_festival.png'
            }
        });
    }
    
    /**
     * 添加皮肤
     * @param skin 皮肤信息
     */
    private addSkin(skin: SkinInfo): void {
        this._skins.set(skin.id, skin);
    }
    
    /**
     * 添加主题
     * @param theme 主题信息
     */
    private addTheme(theme: ThemeInfo): void {
        this._themes.set(theme.id, theme);
    }
    
    /**
     * 从本地存储加载数据
     */
    private loadData(): void {
        // 在实际实现中，这里会从微信存储或云端加载数据
        console.log('从本地存储加载商店数据');
        
        try {
            // 模拟加载过程
            const unlockedSkinsStr = localStorage.getItem('unlockedSkins');
            const unlockedThemesStr = localStorage.getItem('unlockedThemes');
            const selectedSkinStr = localStorage.getItem('selectedSkin');
            const selectedThemeStr = localStorage.getItem('selectedTheme');
            
            if (unlockedSkinsStr) {
                const unlockedSkins = JSON.parse(unlockedSkinsStr) as string[];
                unlockedSkins.forEach(skinId => {
                    const skin = this._skins.get(skinId);
                    if (skin) {
                        skin.isUnlocked = true;
                    }
                });
            }
            
            if (unlockedThemesStr) {
                const unlockedThemes = JSON.parse(unlockedThemesStr) as string[];
                unlockedThemes.forEach(themeId => {
                    const theme = this._themes.get(themeId);
                    if (theme) {
                        theme.isUnlocked = true;
                    }
                });
            }
            
            if (selectedSkinStr) {
                this.selectSkin(selectedSkinStr);
            }
            
            if (selectedThemeStr) {
                this.selectTheme(selectedThemeStr);
            }
        } catch (error) {
            console.error('加载商店数据失败', error);
        }
    }
    
    /**
     * 保存数据到本地存储
     */
    private saveData(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存商店数据到本地存储');
        
        try {
            // 保存已解锁的皮肤
            const unlockedSkins = Array.from(this._skins.values())
                .filter(skin => skin.isUnlocked)
                .map(skin => skin.id);
            localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));
            
            // 保存已解锁的主题
            const unlockedThemes = Array.from(this._themes.values())
                .filter(theme => theme.isUnlocked)
                .map(theme => theme.id);
            localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
            
            // 保存选中的皮肤和主题
            localStorage.setItem('selectedSkin', this._selectedSkin);
            localStorage.setItem('selectedTheme', this._selectedTheme);
        } catch (error) {
            console.error('保存商店数据失败', error);
        }
    }
    
    /**
     * 获取所有皮肤
     * @returns 皮肤列表
     */
    getAllSkins(): SkinInfo[] {
        return Array.from(this._skins.values());
    }
    
    /**
     * 获取所有主题
     * @returns 主题列表
     */
    getAllThemes(): ThemeInfo[] {
        return Array.from(this._themes.values());
    }
    
    /**
     * 获取皮肤信息
     * @param skinId 皮肤ID
     * @returns 皮肤信息
     */
    getSkin(skinId: string): SkinInfo | undefined {
        return this._skins.get(skinId);
    }
    
    /**
     * 获取主题信息
     * @param themeId 主题ID
     * @returns 主题信息
     */
    getTheme(themeId: string): ThemeInfo | undefined {
        return this._themes.get(themeId);
    }
    
    /**
     * 解锁皮肤
     * @param skinId 皮肤ID
     * @param paymentManager 支付管理器
     * @returns 是否成功解锁
     */
    unlockSkin(skinId: string, paymentManager: any): boolean {
        const skin = this._skins.get(skinId);
        if (!skin) {
            console.error(`皮肤 ${skinId} 不存在`);
            return false;
        }
        
        // 检查是否已解锁
        if (skin.isUnlocked) {
            console.log(`皮肤 ${skinId} 已解锁`);
            return true;
        }
        
        // 检查货币是否足够
        const balance = paymentManager.getCurrencyBalance(skin.price.currency);
        if (balance < skin.price.amount) {
            console.error(`货币不足，无法解锁皮肤 ${skinId}`);
            return false;
        }
        
        // 扣除货币
        const success = paymentManager.consumeCurrency(skin.price.currency, skin.price.amount);
        if (!success) {
            console.error(`扣除货币失败，无法解锁皮肤 ${skinId}`);
            return false;
        }
        
        // 解锁皮肤
        skin.isUnlocked = true;
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 解锁主题
     * @param themeId 主题ID
     * @param paymentManager 支付管理器
     * @returns 是否成功解锁
     */
    unlockTheme(themeId: string, paymentManager: any): boolean {
        const theme = this._themes.get(themeId);
        if (!theme) {
            console.error(`主题 ${themeId} 不存在`);
            return false;
        }
        
        // 检查是否已解锁
        if (theme.isUnlocked) {
            console.log(`主题 ${themeId} 已解锁`);
            return true;
        }
        
        // 检查货币是否足够
        const balance = paymentManager.getCurrencyBalance(theme.price.currency);
        if (balance < theme.price.amount) {
            console.error(`货币不足，无法解锁主题 ${themeId}`);
            return false;
        }
        
        // 扣除货币
        const success = paymentManager.consumeCurrency(theme.price.currency, theme.price.amount);
        if (!success) {
            console.error(`扣除货币失败，无法解锁主题 ${themeId}`);
            return false;
        }
        
        // 解锁主题
        theme.isUnlocked = true;
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 选择皮肤
     * @param skinId 皮肤ID
     * @returns 是否成功选择
     */
    selectSkin(skinId: string): boolean {
        const skin = this._skins.get(skinId);
        if (!skin) {
            console.error(`皮肤 ${skinId} 不存在`);
            return false;
        }
        
        // 检查是否已解锁
        if (!skin.isUnlocked) {
            console.error(`皮肤 ${skinId} 未解锁`);
            return false;
        }
        
        // 取消之前选中的皮肤
        const previousSkin = this._skins.get(this._selectedSkin);
        if (previousSkin) {
            previousSkin.isSelected = false;
        }
        
        // 选中新皮肤
        skin.isSelected = true;
        this._selectedSkin = skinId;
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 选择主题
     * @param themeId 主题ID
     * @returns 是否成功选择
     */
    selectTheme(themeId: string): boolean {
        const theme = this._themes.get(themeId);
        if (!theme) {
            console.error(`主题 ${themeId} 不存在`);
            return false;
        }
        
        // 检查是否已解锁
        if (!theme.isUnlocked) {
            console.error(`主题 ${themeId} 未解锁`);
            return false;
        }
        
        // 取消之前选中的主题
        const previousTheme = this._themes.get(this._selectedTheme);
        if (previousTheme) {
            previousTheme.isSelected = false;
        }
        
        // 选中新主题
        theme.isSelected = true;
        this._selectedTheme = themeId;
        
        // 保存数据
        this.saveData();
        
        return true;
    }
    
    /**
     * 获取当前选中的皮肤
     * @returns 皮肤信息
     */
    getSelectedSkin(): SkinInfo | undefined {
        return this._skins.get(this._selectedSkin);
    }
    
    /**
     * 获取当前选中的主题
     * @returns 主题信息
     */
    getSelectedTheme(): ThemeInfo | undefined {
        return this._themes.get(this._selectedTheme);
    }
    
    /**
     * 获取已解锁的皮肤
     * @returns 皮肤列表
     */
    getUnlockedSkins(): SkinInfo[] {
        return Array.from(this._skins.values()).filter(skin => skin.isUnlocked);
    }
    
    /**
     * 获取已解锁的主题
     * @returns 主题列表
     */
    getUnlockedThemes(): ThemeInfo[] {
        return Array.from(this._themes.values()).filter(theme => theme.isUnlocked);
    }
}
