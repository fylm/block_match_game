// HotUpdateService.ts - 热更新服务

/**
 * 资源类型枚举
 */
export enum ResourceType {
    CONFIG = 'config',       // 配置文件
    SCRIPT = 'script',       // 脚本文件
    ASSET = 'asset',         // 资源文件
    LEVEL = 'level'          // 关卡数据
}

/**
 * 资源信息接口
 */
export interface ResourceInfo {
    id: string;              // 资源ID
    type: ResourceType;      // 资源类型
    version: string;         // 资源版本
    url: string;             // 资源URL
    md5: string;             // 资源MD5校验值
    size: number;            // 资源大小（字节）
    required: boolean;       // 是否必需
    dependencies?: string[]; // 依赖的其他资源ID
}

/**
 * 更新包信息接口
 */
export interface UpdatePackageInfo {
    version: string;         // 更新包版本
    resources: ResourceInfo[]; // 包含的资源
    releaseTime: number;     // 发布时间
    description: string;     // 更新说明
    forceUpdate: boolean;    // 是否强制更新
}

/**
 * 热更新服务类
 * 负责游戏内容和逻辑的在线更新
 */
export class HotUpdateService {
    private _cloudBaseUrl: string = 'https://api.example.com/update'; // 云端API基础URL
    private _currentVersion: string = '1.0.0'; // 当前版本
    private _localResourceVersions: Map<string, string> = new Map(); // 本地资源版本
    private _downloadQueue: ResourceInfo[] = []; // 下载队列
    private _isUpdating: boolean = false; // 是否正在更新
    private _updateProgress: number = 0; // 更新进度（0-100）
    private _onProgressCallback: ((progress: number) => void) | null = null; // 进度回调
    private _onCompleteCallback: ((success: boolean) => void) | null = null; // 完成回调
    
    /**
     * 构造函数
     */
    constructor() {
        // 从本地存储加载资源版本信息
        this.loadResourceVersions();
    }
    
    /**
     * 从本地存储加载资源版本信息
     */
    private loadResourceVersions(): void {
        // 在实际实现中，这里会从微信存储或云端加载数据
        console.log('从本地存储加载资源版本信息');
        
        try {
            // 模拟加载过程
            const resourceVersionsStr = localStorage.getItem('resourceVersions');
            const currentVersionStr = localStorage.getItem('currentVersion');
            
            if (resourceVersionsStr) {
                const resourceVersions = JSON.parse(resourceVersionsStr);
                this._localResourceVersions = new Map(resourceVersions);
            }
            
            if (currentVersionStr) {
                this._currentVersion = currentVersionStr;
            }
        } catch (error) {
            console.error('加载资源版本信息失败', error);
        }
    }
    
    /**
     * 保存资源版本信息到本地存储
     */
    private saveResourceVersions(): void {
        // 在实际实现中，这里会保存到微信存储或云端
        console.log('保存资源版本信息到本地存储');
        
        try {
            // 保存资源版本
            localStorage.setItem('resourceVersions', JSON.stringify(Array.from(this._localResourceVersions.entries())));
            
            // 保存当前版本
            localStorage.setItem('currentVersion', this._currentVersion);
        } catch (error) {
            console.error('保存资源版本信息失败', error);
        }
    }
    
    /**
     * 检查更新
     * @returns 是否有可用更新
     */
    async checkUpdate(): Promise<boolean> {
        console.log('检查更新');
        
        try {
            // 在实际实现中，这里会调用云端API检查更新
            // const response = await fetch(`${this._cloudBaseUrl}/check?version=${this._currentVersion}`, {
            //     method: 'GET'
            // });
            
            // if (!response.ok) {
            //     throw new Error(`检查更新失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.json();
            
            // 模拟从云端获取数据
            const data = {
                hasUpdate: true,
                updatePackage: {
                    version: '1.0.1',
                    resources: [
                        {
                            id: 'config_game',
                            type: ResourceType.CONFIG,
                            version: '1.0.1',
                            url: 'https://example.com/update/config_game_1.0.1.json',
                            md5: 'abc123',
                            size: 1024,
                            required: true
                        },
                        {
                            id: 'level_pack_1',
                            type: ResourceType.LEVEL,
                            version: '1.0.1',
                            url: 'https://example.com/update/level_pack_1_1.0.1.json',
                            md5: 'def456',
                            size: 2048,
                            required: false
                        }
                    ],
                    releaseTime: Date.now(),
                    description: '修复了一些bug，优化了游戏体验',
                    forceUpdate: false
                }
            };
            
            if (data.hasUpdate) {
                // 准备下载队列
                this._downloadQueue = data.updatePackage.resources.filter(resource => {
                    // 检查本地版本是否需要更新
                    const localVersion = this._localResourceVersions.get(resource.id);
                    return !localVersion || localVersion !== resource.version;
                });
                
                console.log(`发现${this._downloadQueue.length}个资源需要更新`);
                
                return this._downloadQueue.length > 0;
            }
            
            return false;
        } catch (error) {
            console.error('检查更新失败', error);
            return false;
        }
    }
    
    /**
     * 开始更新
     * @param onProgress 进度回调
     * @param onComplete 完成回调
     */
    startUpdate(onProgress?: (progress: number) => void, onComplete?: (success: boolean) => void): void {
        if (this._isUpdating) {
            console.log('更新已在进行中');
            return;
        }
        
        if (this._downloadQueue.length === 0) {
            console.log('没有需要更新的资源');
            if (onComplete) onComplete(true);
            return;
        }
        
        console.log('开始更新');
        
        this._isUpdating = true;
        this._updateProgress = 0;
        this._onProgressCallback = onProgress || null;
        this._onCompleteCallback = onComplete || null;
        
        // 开始下载资源
        this.downloadNextResource();
    }
    
    /**
     * 下载下一个资源
     */
    private async downloadNextResource(): Promise<void> {
        if (this._downloadQueue.length === 0) {
            // 所有资源下载完成
            this.completeUpdate(true);
            return;
        }
        
        // 获取下一个资源
        const resource = this._downloadQueue[0];
        
        console.log(`下载资源: ${resource.id}`);
        
        try {
            // 在实际实现中，这里会下载资源
            // const response = await fetch(resource.url);
            
            // if (!response.ok) {
            //     throw new Error(`下载资源失败: ${response.status} ${response.statusText}`);
            // }
            
            // const data = await response.arrayBuffer();
            
            // 模拟下载过程
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 模拟校验MD5
            // const md5 = calculateMD5(data);
            // if (md5 !== resource.md5) {
            //     throw new Error(`资源校验失败: ${resource.id}`);
            // }
            
            // 模拟保存资源
            // await saveResource(resource.id, data);
            
            // 更新本地版本信息
            this._localResourceVersions.set(resource.id, resource.version);
            
            // 从队列中移除
            this._downloadQueue.shift();
            
            // 更新进度
            this.updateProgress();
            
            // 下载下一个资源
            this.downloadNextResource();
        } catch (error) {
            console.error(`下载资源失败: ${resource.id}`, error);
            
            // 如果是必需资源，则更新失败
            if (resource.required) {
                this.completeUpdate(false);
            } else {
                // 否则跳过该资源，继续下载下一个
                this._downloadQueue.shift();
                this.updateProgress();
                this.downloadNextResource();
            }
        }
    }
    
    /**
     * 更新进度
     */
    private updateProgress(): void {
        // 计算进度
        const totalResources = this._downloadQueue.length + this._localResourceVersions.size;
        const downloadedResources = this._localResourceVersions.size;
        this._updateProgress = Math.floor((downloadedResources / totalResources) * 100);
        
        console.log(`更新进度: ${this._updateProgress}%`);
        
        // 调用进度回调
        if (this._onProgressCallback) {
            this._onProgressCallback(this._updateProgress);
        }
    }
    
    /**
     * 完成更新
     * @param success 是否成功
     */
    private completeUpdate(success: boolean): void {
        console.log(`更新${success ? '成功' : '失败'}`);
        
        this._isUpdating = false;
        
        if (success) {
            // 保存资源版本信息
            this.saveResourceVersions();
        }
        
        // 调用完成回调
        if (this._onCompleteCallback) {
            this._onCompleteCallback(success);
        }
    }
    
    /**
     * 取消更新
     */
    cancelUpdate(): void {
        if (!this._isUpdating) {
            return;
        }
        
        console.log('取消更新');
        
        this._isUpdating = false;
        this._downloadQueue = [];
        
        // 调用完成回调
        if (this._onCompleteCallback) {
            this._onCompleteCallback(false);
        }
    }
    
    /**
     * 获取当前版本
     */
    get currentVersion(): string {
        return this._currentVersion;
    }
    
    /**
     * 获取更新进度
     */
    get updateProgress(): number {
        return this._updateProgress;
    }
    
    /**
     * 是否正在更新
     */
    get isUpdating(): boolean {
        return this._isUpdating;
    }
    
    /**
     * 获取本地资源版本
     * @param resourceId 资源ID
     * @returns 资源版本
     */
    getResourceVersion(resourceId: string): string | undefined {
        return this._localResourceVersions.get(resourceId);
    }
    
    /**
     * 获取所有本地资源版本
     * @returns 资源版本映射
     */
    getAllResourceVersions(): Map<string, string> {
        return new Map(this._localResourceVersions);
    }
}
