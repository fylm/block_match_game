// UserExperienceValidator.ts - 用户体验验证器

/**
 * 用户体验评分标准枚举
 */
export enum UXRatingCriteria {
    USABILITY = 'usability',             // 易用性
    VISUAL_DESIGN = 'visual_design',     // 视觉设计
    RESPONSIVENESS = 'responsiveness',   // 响应性
    FEEDBACK = 'feedback',               // 反馈
    CONSISTENCY = 'consistency',         // 一致性
    LEARNABILITY = 'learnability',       // 可学习性
    SATISFACTION = 'satisfaction',       // 满意度
    ENGAGEMENT = 'engagement'            // 参与度
}

/**
 * 用户体验评分接口
 */
export interface UXRating {
    criteria: UXRatingCriteria;          // 评分标准
    score: number;                       // 分数（1-5）
    comments: string;                    // 评价
    suggestions?: string;                // 改进建议
}

/**
 * 用户体验验证结果接口
 */
export interface UXValidationResult {
    screenName: string;                  // 界面名称
    ratings: UXRating[];                 // 评分
    overallScore: number;                // 总体评分
    strengths: string[];                 // 优点
    weaknesses: string[];                // 缺点
    recommendations: string[];           // 建议
    screenshots?: string[];              // 截图
}

/**
 * 用户体验验证器类
 * 负责验证游戏的用户体验
 */
export class UserExperienceValidator {
    private _validationResults: Map<string, UXValidationResult> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化
    }
    
    /**
     * 验证界面用户体验
     * @param screenName 界面名称
     * @param ratings 评分
     * @param strengths 优点
     * @param weaknesses 缺点
     * @param recommendations 建议
     * @param screenshots 截图
     * @returns 验证结果
     */
    validateScreen(
        screenName: string,
        ratings: UXRating[],
        strengths: string[],
        weaknesses: string[],
        recommendations: string[],
        screenshots?: string[]
    ): UXValidationResult {
        console.log(`验证界面用户体验: ${screenName}`);
        
        // 计算总体评分
        const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
        const overallScore = totalScore / ratings.length;
        
        // 创建验证结果
        const result: UXValidationResult = {
            screenName,
            ratings,
            overallScore,
            strengths,
            weaknesses,
            recommendations,
            screenshots
        };
        
        // 保存结果
        this._validationResults.set(screenName, result);
        
        return result;
    }
    
    /**
     * 获取验证结果
     * @param screenName 界面名称
     * @returns 验证结果
     */
    getValidationResult(screenName: string): UXValidationResult | undefined {
        return this._validationResults.get(screenName);
    }
    
    /**
     * 获取所有验证结果
     * @returns 所有验证结果
     */
    getAllValidationResults(): UXValidationResult[] {
        return Array.from(this._validationResults.values());
    }
    
    /**
     * 获取总体评分
     * @returns 总体评分
     */
    getOverallScore(): number {
        const results = this.getAllValidationResults();
        
        if (results.length === 0) {
            return 0;
        }
        
        const totalScore = results.reduce((sum, result) => sum + result.overallScore, 0);
        return totalScore / results.length;
    }
    
    /**
     * 获取评分最高的界面
     * @returns 评分最高的界面
     */
    getHighestRatedScreen(): UXValidationResult | undefined {
        const results = this.getAllValidationResults();
        
        if (results.length === 0) {
            return undefined;
        }
        
        return results.reduce((highest, current) => 
            current.overallScore > highest.overallScore ? current : highest
        );
    }
    
    /**
     * 获取评分最低的界面
     * @returns 评分最低的界面
     */
    getLowestRatedScreen(): UXValidationResult | undefined {
        const results = this.getAllValidationResults();
        
        if (results.length === 0) {
            return undefined;
        }
        
        return results.reduce((lowest, current) => 
            current.overallScore < lowest.overallScore ? current : lowest
        );
    }
    
    /**
     * 获取按标准分组的评分
     * @returns 按标准分组的评分
     */
    getRatingsByCriteria(): Map<UXRatingCriteria, {
        averageScore: number;
        ratings: UXRating[];
    }> {
        const results = this.getAllValidationResults();
        const criteriaMap = new Map<UXRatingCriteria, {
            totalScore: number;
            count: number;
            ratings: UXRating[];
        }>();
        
        // 初始化映射
        Object.values(UXRatingCriteria).forEach(criteria => {
            criteriaMap.set(criteria, {
                totalScore: 0,
                count: 0,
                ratings: []
            });
        });
        
        // 收集所有评分
        for (const result of results) {
            for (const rating of result.ratings) {
                const criteriaData = criteriaMap.get(rating.criteria)!;
                criteriaData.totalScore += rating.score;
                criteriaData.count++;
                criteriaData.ratings.push(rating);
            }
        }
        
        // 计算平均分
        const averageMap = new Map<UXRatingCriteria, {
            averageScore: number;
            ratings: UXRating[];
        }>();
        
        for (const [criteria, data] of criteriaMap.entries()) {
            averageMap.set(criteria, {
                averageScore: data.count > 0 ? data.totalScore / data.count : 0,
                ratings: data.ratings
            });
        }
        
        return averageMap;
    }
    
    /**
     * 获取最需要改进的方面
     * @param count 数量
     * @returns 最需要改进的方面
     */
    getMostNeededImprovements(count: number = 3): {
        criteria: UXRatingCriteria;
        averageScore: number;
        suggestions: string[];
    }[] {
        const criteriaRatings = this.getRatingsByCriteria();
        const improvements: {
            criteria: UXRatingCriteria;
            averageScore: number;
            suggestions: string[];
        }[] = [];
        
        for (const [criteria, data] of criteriaRatings.entries()) {
            const suggestions = data.ratings
                .filter(rating => rating.suggestions)
                .map(rating => rating.suggestions!)
                .filter((suggestion, index, self) => self.indexOf(suggestion) === index); // 去重
            
            improvements.push({
                criteria,
                averageScore: data.averageScore,
                suggestions
            });
        }
        
        // 按平均分升序排序
        improvements.sort((a, b) => a.averageScore - b.averageScore);
        
        // 返回前N个
        return improvements.slice(0, count);
    }
    
    /**
     * 生成用户体验验证报告
     * @returns 用户体验验证报告HTML
     */
    generateUXReport(): string {
        const results = this.getAllValidationResults();
        const overallScore = this.getOverallScore();
        const highestRated = this.getHighestRatedScreen();
        const lowestRated = this.getLowestRatedScreen();
        const criteriaRatings = this.getRatingsByCriteria();
        const improvements = this.getMostNeededImprovements(3);
        
        // 生成HTML报告
        let report = `
<!DOCTYPE html>
<html>
<head>
    <title>《方块连连消》用户体验验证报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .score { font-size: 18px; font-weight: bold; }
        .good { color: #4CAF50; }
        .average { color: #FF9800; }
        .poor { color: #f44336; }
        .summary { display: flex; justify-content: space-between; }
        .summary-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 30%; }
        .rating-bar { height: 20px; background-color: #f1f1f1; border-radius: 10px; margin-top: 5px; }
        .rating-fill { height: 100%; border-radius: 10px; }
    </style>
</head>
<body>
    <h1>《方块连连消》用户体验验证报告</h1>
    <p>生成时间: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <div class="summary-box">
            <h3>总体评分</h3>
            <p class="score ${overallScore >= 4 ? 'good' : (overallScore >= 3 ? 'average' : 'poor')}">${overallScore.toFixed(1)}/5.0</p>
            <div class="rating-bar">
                <div class="rating-fill" style="width: ${(overallScore / 5) * 100}%; background-color: ${overallScore >= 4 ? '#4CAF50' : (overallScore >= 3 ? '#FF9800' : '#f44336')};"></div>
            </div>
        </div>
        <div class="summary-box">
            <h3>最佳界面</h3>
            <p>${highestRated ? highestRated.screenName : 'N/A'}</p>
            <p class="score ${highestRated && highestRated.overallScore >= 4 ? 'good' : (highestRated && highestRated.overallScore >= 3 ? 'average' : 'poor')}">${highestRated ? highestRated.overallScore.toFixed(1) : 'N/A'}/5.0</p>
        </div>
        <div class="summary-box">
            <h3>需改进界面</h3>
            <p>${lowestRated ? lowestRated.screenName : 'N/A'}</p>
            <p class="score ${lowestRated && lowestRated.overallScore >= 4 ? 'good' : (lowestRated && lowestRated.overallScore >= 3 ? 'average' : 'poor')}">${lowestRated ? lowestRated.overallScore.toFixed(1) : 'N/A'}/5.0</p>
        </div>
    </div>
    
    <h2>评分标准分析</h2>
    <table>
        <tr>
            <th>评分标准</th>
            <th>平均分</th>
            <th>评分</th>
        </tr>`;
        
        // 添加评分标准行
        for (const criteria of Object.values(UXRatingCriteria)) {
            const data = criteriaRatings.get(criteria);
            
            if (data) {
                const averageScore = data.averageScore;
                
                report += `
        <tr>
            <td>${this.getCriteriaDisplayName(criteria)}</td>
            <td class="${averageScore >= 4 ? 'good' : (averageScore >= 3 ? 'average' : 'poor')}">${averageScore.toFixed(1)}</td>
            <td>
                <div class="rating-bar">
                    <div class="rating-fill" style="width: ${(averageScore / 5) * 100}%; background-color: ${averageScore >= 4 ? '#4CAF50' : (averageScore >= 3 ? '#FF9800' : '#f44336')};"></div>
                </div>
            </td>
        </tr>`;
            }
        }
        
        report += `
    </table>
    
    <h2>最需改进的方面</h2>
    <table>
        <tr>
            <th>评分标准</th>
            <th>平均分</th>
            <th>改进建议</th>
        </tr>`;
        
        // 添加改进建议行
        for (const improvement of improvements) {
            report += `
        <tr>
            <td>${this.getCriteriaDisplayName(improvement.criteria)}</td>
            <td class="${improvement.averageScore >= 4 ? 'good' : (improvement.averageScore >= 3 ? 'average' : 'poor')}">${improvement.averageScore.toFixed(1)}</td>
            <td>
                <ul>`;
            
            for (const suggestion of improvement.suggestions) {
                report += `
                    <li>${suggestion}</li>`;
            }
            
            report += `
                </ul>
            </td>
        </tr>`;
        }
        
        report += `
    </table>
    
    <h2>界面详细评分</h2>`;
        
        // 添加界面详细评分
        for (const result of results) {
            report += `
    <h3>${result.screenName} (${result.overallScore.toFixed(1)}/5.0)</h3>
    <table>
        <tr>
            <th>评分标准</th>
            <th>分数</th>
            <th>评价</th>
        </tr>`;
            
            for (const rating of result.ratings) {
                report += `
        <tr>
            <td>${this.getCriteriaDisplayName(rating.criteria)}</td>
            <td class="${rating.score >= 4 ? 'good' : (rating.score >= 3 ? 'average' : 'poor')}">${rating.score}</td>
            <td>${rating.comments}</td>
        </tr>`;
            }
            
            report += `
    </table>
    
    <h4>优点</h4>
    <ul>`;
            
            for (const strength of result.strengths) {
                report += `
        <li>${strength}</li>`;
            }
            
            report += `
    </ul>
    
    <h4>缺点</h4>
    <ul>`;
            
            for (const weakness of result.weaknesses) {
                report += `
        <li>${weakness}</li>`;
            }
            
            report += `
    </ul>
    
    <h4>建议</h4>
    <ul>`;
            
            for (const recommendation of result.recommendations) {
                report += `
        <li>${recommendation}</li>`;
            }
            
            report += `
    </ul>`;
        }
        
        report += `
</body>
</html>`;
        
        return report;
    }
    
    /**
     * 获取评分标准显示名称
     * @param criteria 评分标准
     * @returns 显示名称
     */
    private getCriteriaDisplayName(criteria: UXRatingCriteria): string {
        switch (criteria) {
            case UXRatingCriteria.USABILITY:
                return '易用性';
            case UXRatingCriteria.VISUAL_DESIGN:
                return '视觉设计';
            case UXRatingCriteria.RESPONSIVENESS:
                return '响应性';
            case UXRatingCriteria.FEEDBACK:
                return '反馈';
            case UXRatingCriteria.CONSISTENCY:
                return '一致性';
            case UXRatingCriteria.LEARNABILITY:
                return '可学习性';
            case UXRatingCriteria.SATISFACTION:
                return '满意度';
            case UXRatingCriteria.ENGAGEMENT:
                return '参与度';
            default:
                return criteria;
        }
    }
}
