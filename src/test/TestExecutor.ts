// TestExecutor.ts - 测试执行器

import { TestCase, TestStatus, BugInfo, BugSeverity, BugStatus, TestPlan } from './TestPlan';

/**
 * 测试执行器类
 * 负责执行测试用例和记录结果
 */
export class TestExecutor {
    private _testPlan: TestPlan;
    private _currentTestCase: TestCase | null = null;
    private _testResults: Map<string, {
        passed: boolean;
        notes: string;
        executionTime: number;
        screenshots?: string[];
    }> = new Map();
    
    /**
     * 构造函数
     * @param testPlan 测试计划
     */
    constructor(testPlan: TestPlan) {
        this._testPlan = testPlan;
    }
    
    /**
     * 执行测试用例
     * @param testCaseId 测试用例ID
     * @returns 测试结果
     */
    async executeTestCase(testCaseId: string): Promise<boolean> {
        // 获取测试用例
        const testCase = this._testPlan.getTestCases().find(tc => tc.id === testCaseId);
        
        if (!testCase) {
            console.error(`测试用例 ${testCaseId} 不存在`);
            return false;
        }
        
        console.log(`开始执行测试用例: ${testCase.id} - ${testCase.name}`);
        
        // 更新测试用例状态为进行中
        this._testPlan.updateTestCaseStatus(testCase.id, TestStatus.IN_PROGRESS);
        
        // 记录当前测试用例
        this._currentTestCase = testCase;
        
        // 记录开始时间
        const startTime = Date.now();
        
        try {
            // 在实际实现中，这里会根据测试用例类型执行不同的测试逻辑
            // 这里模拟测试执行
            const result = await this.simulateTestExecution(testCase);
            
            // 记录结束时间
            const endTime = Date.now();
            
            // 记录测试结果
            this._testResults.set(testCase.id, {
                passed: result.passed,
                notes: result.notes,
                executionTime: endTime - startTime,
                screenshots: result.screenshots
            });
            
            // 更新测试用例状态
            this._testPlan.updateTestCaseStatus(
                testCase.id,
                result.passed ? TestStatus.PASSED : TestStatus.FAILED,
                result.notes
            );
            
            // 如果测试失败，创建Bug
            if (!result.passed) {
                this.createBugFromFailedTest(testCase, result.notes);
            }
            
            console.log(`测试用例 ${testCase.id} 执行${result.passed ? '成功' : '失败'}`);
            
            return result.passed;
        } catch (error) {
            console.error(`测试用例 ${testCase.id} 执行出错`, error);
            
            // 记录结束时间
            const endTime = Date.now();
            
            // 记录测试结果
            this._testResults.set(testCase.id, {
                passed: false,
                notes: `执行出错: ${error}`,
                executionTime: endTime - startTime
            });
            
            // 更新测试用例状态
            this._testPlan.updateTestCaseStatus(
                testCase.id,
                TestStatus.FAILED,
                `执行出错: ${error}`
            );
            
            // 创建Bug
            this.createBugFromFailedTest(testCase, `执行出错: ${error}`);
            
            return false;
        } finally {
            // 清除当前测试用例
            this._currentTestCase = null;
        }
    }
    
    /**
     * 模拟测试执行
     * @param testCase 测试用例
     * @returns 测试结果
     */
    private async simulateTestExecution(testCase: TestCase): Promise<{
        passed: boolean;
        notes: string;
        screenshots?: string[];
    }> {
        // 在实际实现中，这里会根据测试用例类型执行不同的测试逻辑
        // 这里模拟测试执行，随机成功或失败
        
        // 模拟测试执行时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // 模拟测试结果（80%概率成功）
        const passed = Math.random() > 0.2;
        
        if (passed) {
            return {
                passed: true,
                notes: '测试通过，所有步骤执行正常，结果符合预期。',
                screenshots: [
                    `/screenshots/${testCase.id}_step1.png`,
                    `/screenshots/${testCase.id}_step2.png`,
                    `/screenshots/${testCase.id}_result.png`
                ]
            };
        } else {
            // 模拟不同类型的失败
            const failureTypes = [
                '功能不符合预期',
                '界面显示异常',
                '性能不达标',
                '出现崩溃',
                '数据不一致'
            ];
            
            const failureType = failureTypes[Math.floor(Math.random() * failureTypes.length)];
            const failureStep = Math.floor(Math.random() * testCase.steps.length) + 1;
            
            return {
                passed: false,
                notes: `测试失败: 在步骤${failureStep}中出现"${failureType}"问题。详细信息: 执行"${testCase.steps[failureStep - 1]}"时，结果与预期不符。`,
                screenshots: [
                    `/screenshots/${testCase.id}_step${failureStep-1}.png`,
                    `/screenshots/${testCase.id}_failure.png`
                ]
            };
        }
    }
    
    /**
     * 从失败的测试创建Bug
     * @param testCase 测试用例
     * @param notes 测试备注
     */
    private createBugFromFailedTest(testCase: TestCase, notes: string): void {
        // 生成Bug ID
        const bugId = `BUG_${testCase.id}_${Date.now()}`;
        
        // 从测试备注中提取失败信息
        const failureMatch = notes.match(/测试失败: 在步骤(\d+)中出现"([^"]+)"问题/);
        let failureStep = 0;
        let failureType = '未知问题';
        
        if (failureMatch) {
            failureStep = parseInt(failureMatch[1]);
            failureType = failureMatch[2];
        }
        
        // 确定Bug严重程度
        let severity: BugSeverity;
        switch (failureType) {
            case '出现崩溃':
                severity = BugSeverity.CRITICAL;
                break;
            case '功能不符合预期':
            case '数据不一致':
                severity = BugSeverity.MAJOR;
                break;
            case '界面显示异常':
                severity = BugSeverity.MINOR;
                break;
            case '性能不达标':
                severity = testCase.priority === TestPriority.CRITICAL ? BugSeverity.MAJOR : BugSeverity.MINOR;
                break;
            default:
                severity = BugSeverity.MINOR;
        }
        
        // 创建Bug
        const bug: BugInfo = {
            id: bugId,
            title: `[${testCase.module}] ${failureType} - ${testCase.name}`,
            description: `在执行测试用例"${testCase.name}"时发现问题。`,
            steps: testCase.steps.slice(0, failureStep),
            severity,
            priority: testCase.priority,
            status: BugStatus.NEW,
            module: testCase.module,
            reporter: 'Test Executor',
            environment: '测试环境',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            relatedTestCases: [testCase.id]
        };
        
        // 添加Bug
        this._testPlan.addBug(bug);
        
        // 关联Bug和测试用例
        this._testPlan.linkBugToTestCase(bugId, testCase.id);
        
        console.log(`创建Bug: ${bugId} - ${bug.title}`);
    }
    
    /**
     * 批量执行测试用例
     * @param testCaseIds 测试用例ID数组
     * @returns 测试结果
     */
    async executeTestCases(testCaseIds: string[]): Promise<{
        total: number;
        passed: number;
        failed: number;
        results: Map<string, boolean>;
    }> {
        console.log(`开始批量执行${testCaseIds.length}个测试用例`);
        
        let passed = 0;
        let failed = 0;
        const results = new Map<string, boolean>();
        
        for (const id of testCaseIds) {
            const result = await this.executeTestCase(id);
            results.set(id, result);
            
            if (result) {
                passed++;
            } else {
                failed++;
            }
        }
        
        console.log(`批量执行完成: 总计${testCaseIds.length}个, 通过${passed}个, 失败${failed}个`);
        
        return {
            total: testCaseIds.length,
            passed,
            failed,
            results
        };
    }
    
    /**
     * 执行所有测试用例
     * @returns 测试结果
     */
    async executeAllTestCases(): Promise<{
        total: number;
        passed: number;
        failed: number;
        results: Map<string, boolean>;
    }> {
        const testCases = this._testPlan.getTestCases();
        const testCaseIds = testCases.map(tc => tc.id);
        
        return this.executeTestCases(testCaseIds);
    }
    
    /**
     * 获取测试结果
     * @param testCaseId 测试用例ID
     * @returns 测试结果
     */
    getTestResult(testCaseId: string): {
        passed: boolean;
        notes: string;
        executionTime: number;
        screenshots?: string[];
    } | undefined {
        return this._testResults.get(testCaseId);
    }
    
    /**
     * 获取所有测试结果
     * @returns 所有测试结果
     */
    getAllTestResults(): Map<string, {
        passed: boolean;
        notes: string;
        executionTime: number;
        screenshots?: string[];
    }> {
        return new Map(this._testResults);
    }
    
    /**
     * 生成测试执行报告
     * @returns 测试执行报告HTML
     */
    generateExecutionReport(): string {
        const results = this.getAllTestResults();
        const testCases = this._testPlan.getTestCases();
        
        // 计算统计数据
        let total = 0;
        let passed = 0;
        let failed = 0;
        let notExecuted = 0;
        let totalExecutionTime = 0;
        
        for (const tc of testCases) {
            total++;
            
            const result = results.get(tc.id);
            if (result) {
                if (result.passed) {
                    passed++;
                } else {
                    failed++;
                }
                totalExecutionTime += result.executionTime;
            } else {
                notExecuted++;
            }
        }
        
        // 生成HTML报告
        let report = `
<!DOCTYPE html>
<html>
<head>
    <title>《方块连连消》测试执行报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2, h3 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .passed { color: #4CAF50; font-weight: bold; }
        .failed { color: #f44336; font-weight: bold; }
        .not-executed { color: #9e9e9e; }
        .summary { display: flex; justify-content: space-between; }
        .summary-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 22%; }
    </style>
</head>
<body>
    <h1>《方块连连消》测试执行报告</h1>
    <p>生成时间: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <div class="summary-box">
            <h3>总测试用例</h3>
            <p style="font-size: 24px; font-weight: bold;">${total}</p>
        </div>
        <div class="summary-box">
            <h3>通过</h3>
            <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${passed}</p>
        </div>
        <div class="summary-box">
            <h3>失败</h3>
            <p style="font-size: 24px; font-weight: bold; color: #f44336;">${failed}</p>
        </div>
        <div class="summary-box">
            <h3>未执行</h3>
            <p style="font-size: 24px; font-weight: bold; color: #9e9e9e;">${notExecuted}</p>
        </div>
    </div>
    
    <h2>执行统计</h2>
    <p>通过率: ${total > 0 ? ((passed / (passed + failed)) * 100).toFixed(2) : 0}%</p>
    <p>总执行时间: ${(totalExecutionTime / 1000).toFixed(2)}秒</p>
    <p>平均执行时间: ${(passed + failed) > 0 ? (totalExecutionTime / (passed + failed) / 1000).toFixed(2) : 0}秒/测试</p>
    
    <h2>测试用例执行详情</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>名称</th>
            <th>模块</th>
            <th>优先级</th>
            <th>状态</th>
            <th>执行时间</th>
            <th>备注</th>
        </tr>`;
        
        // 添加测试用例行
        for (const tc of testCases) {
            const result = results.get(tc.id);
            
            let statusClass = 'not-executed';
            let statusText = '未执行';
            let executionTime = '-';
            let notes = '-';
            
            if (result) {
                statusClass = result.passed ? 'passed' : 'failed';
                statusText = result.passed ? '通过' : '失败';
                executionTime = `${(result.executionTime / 1000).toFixed(2)}秒`;
                notes = result.notes;
            }
            
            report += `
        <tr>
            <td>${tc.id}</td>
            <td>${tc.name}</td>
            <td>${tc.module}</td>
            <td>${tc.priority}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${executionTime}</td>
            <td>${notes}</td>
        </tr>`;
        }
        
        report += `
    </table>
    
    <h2>失败的测试用例</h2>`;
        
        // 检查是否有失败的测试用例
        const failedTests = Array.from(results.entries())
            .filter(([_, result]) => !result.passed)
            .map(([id, _]) => testCases.find(tc => tc.id === id))
            .filter(tc => tc !== undefined) as TestCase[];
        
        if (failedTests.length > 0) {
            report += `
    <table>
        <tr>
            <th>ID</th>
            <th>名称</th>
            <th>模块</th>
            <th>失败原因</th>
            <th>相关Bug</th>
        </tr>`;
            
            for (const tc of failedTests) {
                const result = results.get(tc.id);
                const bugs = tc.bugReferences || [];
                
                report += `
        <tr>
            <td>${tc.id}</td>
            <td>${tc.name}</td>
            <td>${tc.module}</td>
            <td>${result?.notes || '-'}</td>
            <td>${bugs.join(', ') || '-'}</td>
        </tr>`;
            }
            
            report += `
    </table>`;
        } else {
            report += `
    <p>没有失败的测试用例。</p>`;
        }
        
        report += `
</body>
</html>`;
        
        return report;
    }
}
