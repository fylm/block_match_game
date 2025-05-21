// FunctionalityVerifier.ts - 功能完整性验证器

/**
 * 功能状态枚举
 */
export enum FunctionalityStatus {
    VERIFIED = 'verified',           // 已验证
    PARTIALLY_VERIFIED = 'partially_verified', // 部分验证
    FAILED = 'failed',               // 验证失败
    NOT_VERIFIED = 'not_verified'    // 未验证
}

/**
 * 功能验证结果接口
 */
export interface FunctionalityVerificationResult {
    moduleId: string;                // 模块ID
    moduleName: string;              // 模块名称
    features: {                      // 功能列表
        id: string;                  // 功能ID
        name: string;                // 功能名称
        description: string;         // 功能描述
        status: FunctionalityStatus; // 验证状态
        notes: string;               // 验证备注
        issues?: string[];           // 发现的问题
    }[];
    overallStatus: FunctionalityStatus; // 整体状态
    verificationDate: number;        // 验证日期
    verifier: string;                // 验证人
}

/**
 * 功能完整性验证器类
 * 负责验证游戏功能的完整性
 */
export class FunctionalityVerifier {
    private _verificationResults: Map<string, FunctionalityVerificationResult> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化
    }
    
    /**
     * 验证模块功能
     * @param moduleId 模块ID
     * @param moduleName 模块名称
     * @param features 功能列表
     * @param verifier 验证人
     * @returns 验证结果
     */
    verifyModule(
        moduleId: string,
        moduleName: string,
        features: {
            id: string;
            name: string;
            description: string;
            status: FunctionalityStatus;
            notes: string;
            issues?: string[];
        }[],
        verifier: string
    ): FunctionalityVerificationResult {
        console.log(`验证模块功能: ${moduleName}`);
        
        // 计算整体状态
        let overallStatus: FunctionalityStatus;
        
        const verifiedCount = features.filter(f => f.status === FunctionalityStatus.VERIFIED).length;
        const failedCount = features.filter(f => f.status === FunctionalityStatus.FAILED).length;
        
        if (verifiedCount === features.length) {
            overallStatus = FunctionalityStatus.VERIFIED;
        } else if (failedCount > 0) {
            overallStatus = FunctionalityStatus.FAILED;
        } else if (verifiedCount > 0) {
            overallStatus = FunctionalityStatus.PARTIALLY_VERIFIED;
        } else {
            overallStatus = FunctionalityStatus.NOT_VERIFIED;
        }
        
        // 创建验证结果
        const result: FunctionalityVerificationResult = {
            moduleId,
            moduleName,
            features,
            overallStatus,
            verificationDate: Date.now(),
            verifier
        };
        
        // 保存结果
        this._verificationResults.set(moduleId, result);
        
        return result;
    }
    
    /**
     * 获取验证结果
     * @param moduleId 模块ID
     * @returns 验证结果
     */
    getVerificationResult(moduleId: string): FunctionalityVerificationResult | undefined {
        return this._verificationResults.get(moduleId);
    }
    
    /**
     * 获取所有验证结果
     * @returns 所有验证结果
     */
    getAllVerificationResults(): FunctionalityVerificationResult[] {
        return Array.from(this._verificationResults.values());
    }
    
    /**
     * 获取整体验证状态
     * @returns 整体验证状态
     */
    getOverallStatus(): FunctionalityStatus {
        const results = this.getAllVerificationResults();
        
        if (results.length === 0) {
            return FunctionalityStatus.NOT_VERIFIED;
        }
        
        const verifiedCount = results.filter(r => r.overallStatus === FunctionalityStatus.VERIFIED).length;
        const failedCount = results.filter(r => r.overallStatus === FunctionalityStatus.FAILED).length;
        
        if (verifiedCount === results.length) {
            return FunctionalityStatus.VERIFIED;
        } else if (failedCount > 0) {
            return FunctionalityStatus.FAILED;
        } else {
            return FunctionalityStatus.PARTIALLY_VERIFIED;
        }
    }
    
    /**
     * 获取所有问题
     * @returns 所有问题
     */
    getAllIssues(): {
        moduleId: string;
        moduleName: string;
        featureId: string;
        featureName: string;
        issue: string;
    }[] {
        const issues: {
            moduleId: string;
            moduleName: string;
            featureId: string;
            featureName: string;
            issue: string;
        }[] = [];
        
        for (const result of this._verificationResults.values()) {
            for (const feature of result.features) {
                if (feature.issues && feature.issues.length > 0) {
                    for (const issue of feature.issues) {
                        issues.push({
                            moduleId: result.moduleId,
                            moduleName: result.moduleName,
                            featureId: feature.id,
                            featureName: feature.name,
                            issue
                        });
                    }
                }
            }
        }
        
        return issues;
    }
    
    /**
     * 生成功能完整性验证报告
     * @returns 功能完整性验证报告HTML
     */
    generateFunctionalityReport(): string {
        const results = this.getAllVerificationResults();
        const overallStatus = this.getOverallStatus();
        const issues = this.getAllIssues();
        
        // 计算统计数据
        const totalModules = results.length;
        const verifiedModules = results.filter(r => r.overallStatus === FunctionalityStatus.VERIFIED).length;
        const partiallyVerifiedModules = results.filter(r => r.overallStatus === FunctionalityStatus.PARTIALLY_VERIFIED).length;
        const failedModules = results.filter(r => r.overallStatus === FunctionalityStatus.FAILED).length;
        
        let totalFeatures = 0;
        let verifiedFeatures = 0;
        let failedFeatures = 0;
        
        for (const result of results) {
            totalFeatures += result.features.length;
            verifiedFeatures += result.features.filter(f => f.status === FunctionalityStatus.VERIFIED).length;
            failedFeatures += result.features.filter(f => f.status === FunctionalityStatus.FAILED).length;
        }
        
        // 生成HTML报告
        let report = `
<!DOCTYPE html>
<html>
<head>
    <title>《方块连连消》功能完整性验证报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .verified { color: #4CAF50; font-weight: bold; }
        .partially-verified { color: #FF9800; font-weight: bold; }
        .failed { color: #f44336; font-weight: bold; }
        .not-verified { color: #9e9e9e; font-weight: bold; }
        .summary { display: flex; justify-content: space-between; }
        .summary-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 22%; }
        .progress-container { width: 100%; background-color: #f1f1f1; border-radius: 5px; }
        .progress-bar { height: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>《方块连连消》功能完整性验证报告</h1>
    <p>生成时间: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <div class="summary-box">
            <h3>总体状态</h3>
            <p class="${this.getStatusClass(overallStatus)}">${this.getStatusDisplayName(overallStatus)}</p>
        </div>
        <div class="summary-box">
            <h3>模块数</h3>
            <p>${verifiedModules}/${totalModules} 已验证</p>
        </div>
        <div class="summary-box">
            <h3>功能数</h3>
            <p>${verifiedFeatures}/${totalFeatures} 已验证</p>
        </div>
        <div class="summary-box">
            <h3>问题数</h3>
            <p>${issues.length}</p>
        </div>
    </div>
    
    <h2>验证进度</h2>
    <h3>模块验证进度</h3>
    <div class="progress-container">
        <div class="progress-bar verified" style="width: ${(verifiedModules / totalModules) * 100}%; float: left;"></div>
        <div class="progress-bar partially-verified" style="width: ${(partiallyVerifiedModules / totalModules) * 100}%; float: left;"></div>
        <div class="progress-bar failed" style="width: ${(failedModules / totalModules) * 100}%; float: left;"></div>
    </div>
    <div style="clear: both; margin-bottom: 10px;"></div>
    <div>
        <span style="background-color: #4CAF50; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span> 已验证 (${verifiedModules})
        <span style="background-color: #FF9800; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 部分验证 (${partiallyVerifiedModules})
        <span style="background-color: #f44336; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 验证失败 (${failedModules})
    </div>
    
    <h3>功能验证进度</h3>
    <div class="progress-container">
        <div class="progress-bar verified" style="width: ${(verifiedFeatures / totalFeatures) * 100}%; float: left;"></div>
        <div class="progress-bar failed" style="width: ${(failedFeatures / totalFeatures) * 100}%; float: left;"></div>
        <div class="progress-bar not-verified" style="width: ${((totalFeatures - verifiedFeatures - failedFeatures) / totalFeatures) * 100}%; float: left;"></div>
    </div>
    <div style="clear: both; margin-bottom: 10px;"></div>
    <div>
        <span style="background-color: #4CAF50; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span> 已验证 (${verifiedFeatures})
        <span style="background-color: #f44336; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 验证失败 (${failedFeatures})
        <span style="background-color: #9e9e9e; width: 20px; height: 20px; display: inline-block; margin: 0 5px 0 15px;"></span> 未验证 (${totalFeatures - verifiedFeatures - failedFeatures})
    </div>
    
    <h2>模块验证详情</h2>`;
        
        // 添加模块验证详情
        for (const result of results) {
            report += `
    <h3>${result.moduleName} <span class="${this.getStatusClass(result.overallStatus)}">(${this.getStatusDisplayName(result.overallStatus)})</span></h3>
    <p>验证人: ${result.verifier} | 验证日期: ${new Date(result.verificationDate).toLocaleString()}</p>
    <table>
        <tr>
            <th>功能</th>
            <th>描述</th>
            <th>状态</th>
            <th>备注</th>
        </tr>`;
            
            for (const feature of result.features) {
                report += `
        <tr>
            <td>${feature.name}</td>
            <td>${feature.description}</td>
            <td class="${this.getStatusClass(feature.status)}">${this.getStatusDisplayName(feature.status)}</td>
            <td>${feature.notes}</td>
        </tr>`;
            }
            
            report += `
    </table>`;
        }
        
        if (issues.length > 0) {
            report += `
    <h2>发现的问题</h2>
    <table>
        <tr>
            <th>模块</th>
            <th>功能</th>
            <th>问题描述</th>
        </tr>`;
            
            for (const issue of issues) {
                report += `
        <tr>
            <td>${issue.moduleName}</td>
            <td>${issue.featureName}</td>
            <td>${issue.issue}</td>
        </tr>`;
            }
            
            report += `
    </table>`;
        }
        
        report += `
</body>
</html>`;
        
        return report;
    }
    
    /**
     * 获取状态CSS类
     * @param status 状态
     * @returns CSS类
     */
    private getStatusClass(status: FunctionalityStatus): string {
        switch (status) {
            case FunctionalityStatus.VERIFIED:
                return 'verified';
            case FunctionalityStatus.PARTIALLY_VERIFIED:
                return 'partially-verified';
            case FunctionalityStatus.FAILED:
                return 'failed';
            case FunctionalityStatus.NOT_VERIFIED:
                return 'not-verified';
            default:
                return '';
        }
    }
    
    /**
     * 获取状态显示名称
     * @param status 状态
     * @returns 显示名称
     */
    private getStatusDisplayName(status: FunctionalityStatus): string {
        switch (status) {
            case FunctionalityStatus.VERIFIED:
                return '已验证';
            case FunctionalityStatus.PARTIALLY_VERIFIED:
                return '部分验证';
            case FunctionalityStatus.FAILED:
                return '验证失败';
            case FunctionalityStatus.NOT_VERIFIED:
                return '未验证';
            default:
                return status;
        }
    }
}
