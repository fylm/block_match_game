# 《方块连连消》微信小程序游戏运行与部署指南

本文档提供了《方块连连消》微信小程序游戏的完整运行与部署指南，包括本地开发环境配置、前端运行、后端服务启动以及生产环境部署等内容。

## 1. 环境准备

### 1.1 开发环境要求

- **Node.js**: v16.0.0 或更高版本
- **npm**: v8.0.0 或更高版本
- **Cocos Creator**: v3.6.0
- **微信开发者工具**: 最新版本
- **MongoDB**: v5.0 或更高版本
- **Redis**: v6.0 或更高版本

### 1.2 安装开发工具

1. **安装 Node.js 和 npm**:
   - 访问 [Node.js 官网](https://nodejs.org/) 下载并安装
   - 安装完成后，在终端中验证:
     ```bash
     node -v
     npm -v
     ```

2. **安装 Cocos Creator**:
   - 访问 [Cocos Creator 官网](https://www.cocos.com/creator) 下载 v3.6.0
   - 按照安装向导完成安装

3. **安装微信开发者工具**:
   - 访问 [微信开发者工具官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 下载最新版本
   - 按照安装向导完成安装

4. **安装 MongoDB**:
   - 访问 [MongoDB 官网](https://www.mongodb.com/try/download/community) 下载并安装
   - 或使用 Docker:
     ```bash
     docker run -d -p 27017:27017 --name mongodb mongo:5.0
     ```

5. **安装 Redis**:
   - 访问 [Redis 官网](https://redis.io/download) 下载并安装
   - 或使用 Docker:
     ```bash
     docker run -d -p 6379:6379 --name redis redis:6.0
     ```

## 2. 项目初始化

### 2.1 克隆项目

```bash
git clone <项目仓库地址> block_match_game
cd block_match_game
```

### 2.2 安装依赖

```bash
# 安装后端依赖
npm install
```

## 3. 后端服务运行

### 3.1 配置环境变量

创建 `.env` 文件在项目根目录:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/block_match_game
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_jwt_secret
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret
```

### 3.2 启动后端服务

```bash
# 开发模式启动
npm run dev

# 生产模式启动
npm run build
npm start
```

服务将在 http://localhost:3000 启动。

### 3.3 后端服务结构

后端服务代码位于 `src/backend` 目录，主要包含以下模块:

- `UserDataService.ts`: 用户数据服务
- `LeaderboardService.ts`: 排行榜服务
- `AchievementService.ts`: 成就与任务服务
- `HotUpdateService.ts`: 热更新服务
- `AnalyticsService.ts`: 数据埋点与分析服务
- `AntiAddictionService.ts`: 防沉迷系统
- `CustomerServiceSystem.ts`: 客服系统

## 4. 前端游戏运行

### 4.1 使用 Cocos Creator 打开项目

1. 启动 Cocos Creator
2. 选择"打开项目"
3. 浏览并选择项目根目录
4. 等待项目加载完成

### 4.2 本地预览运行

1. 在 Cocos Creator 中，点击顶部菜单的"项目" -> "运行预览"
2. 选择"浏览器"
3. 游戏将在默认浏览器中打开运行

### 4.3 构建微信小游戏

1. 在 Cocos Creator 中，点击顶部菜单的"项目" -> "构建发布"
2. 构建平台选择"微信小游戏"
3. 设置构建参数:
   - 设置游戏名称: "方块连连消"
   - 设置游戏版本号
   - 勾选"小游戏分包"选项
   - 配置资源服务器地址(如有)
4. 点击"构建"
5. 构建完成后，会在项目目录下生成 `build/wechatgame` 目录

### 4.4 在微信开发者工具中预览

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目构建目录 `build/wechatgame`
4. 填写微信小程序 AppID
5. 点击"导入"
6. 项目加载完成后，可以在模拟器中预览游戏

## 5. 前后端联调

### 5.1 配置前端 API 地址

1. 打开 `src/network/config.ts` 文件
2. 修改 API 地址配置:
   ```typescript
   export const API_BASE_URL = 'http://localhost:3000/api';
   ```

### 5.2 启用跨域支持

在后端服务中已配置 CORS 支持，允许本地开发环境的跨域请求。

## 6. 生产环境部署

### 6.1 后端服务部署

#### 6.1.1 服务器要求

- 操作系统: Ubuntu 20.04 LTS 或更高版本
- CPU: 2核或更高
- 内存: 4GB 或更高
- 磁盘: 40GB 或更高
- 带宽: 5Mbps 或更高

#### 6.1.2 服务器环境配置

1. 安装 Node.js 和 npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. 安装 MongoDB:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. 安装 Redis:
   ```bash
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

4. 安装 PM2:
   ```bash
   sudo npm install -g pm2
   ```

#### 6.1.3 部署后端服务

1. 将项目代码上传到服务器:
   ```bash
   scp -r block_match_game user@server_ip:/path/to/deploy
   ```

2. 登录服务器并进入项目目录:
   ```bash
   ssh user@server_ip
   cd /path/to/deploy/block_match_game
   ```

3. 安装依赖并构建:
   ```bash
   npm install
   npm run build
   ```

4. 使用 PM2 启动服务:
   ```bash
   pm2 start dist/server.js --name block_match_game
   pm2 save
   pm2 startup
   ```

5. 配置 Nginx 反向代理:
   ```bash
   sudo apt-get install nginx
   ```

   创建 Nginx 配置文件:
   ```bash
   sudo nano /etc/nginx/sites-available/block_match_game
   ```

   添加以下配置:
   ```
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   启用配置并重启 Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/block_match_game /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. 配置 SSL (推荐):
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your_domain.com
   ```

### 6.2 微信小游戏发布

#### 6.2.1 准备发布版本

1. 在 Cocos Creator 中构建微信小游戏版本:
   - 修改 API 地址为生产环境地址
   - 关闭调试信息
   - 开启代码混淆和资源压缩

2. 在微信开发者工具中测试:
   - 确保所有功能正常
   - 检查网络请求
   - 测试支付功能
   - 检查性能指标

#### 6.2.2 提交审核

1. 在微信开发者工具中点击"上传"
2. 填写版本号和更新说明
3. 上传成功后，登录[微信公众平台](https://mp.weixin.qq.com/)
4. 进入"版本管理"，选择刚上传的版本
5. 填写完整的审核资料:
   - 游戏简介
   - 游戏截图
   - 测试账号
   - 类目选择
   - 隐私政策
   - 用户协议
6. 提交审核
7. 审核通过后，可以发布正式版本

## 7. 常见问题与解决方案

### 7.1 后端服务启动问题

**问题**: 无法连接到 MongoDB 或 Redis
**解决方案**: 
- 检查 MongoDB 和 Redis 服务是否正常运行
- 检查连接字符串是否正确
- 检查防火墙设置

**问题**: 端口被占用
**解决方案**:
- 修改 `.env` 文件中的 PORT 设置
- 或终止占用端口的进程

### 7.2 前端构建问题

**问题**: Cocos Creator 构建失败
**解决方案**:
- 检查 Cocos Creator 版本是否为 3.6.0
- 清理项目缓存: 菜单 -> 开发者 -> 清理缓存
- 检查项目资源是否有损坏

**问题**: 微信开发者工具导入项目失败
**解决方案**:
- 确保 AppID 正确
- 检查构建目录路径是否正确
- 尝试重新构建项目

### 7.3 微信小游戏审核问题

**问题**: 审核被拒
**解决方案**:
- 仔细阅读拒绝原因
- 常见拒绝原因:
  - 游戏内容不符合要求
  - 未正确实现实名认证
  - 支付相关功能问题
  - 性能问题
- 修复问题后重新提交

## 8. 联系与支持

如有任何问题或需要技术支持，请联系项目维护团队:

- 邮箱: support@example.com
- 技术支持群: 123456789

---

© 2025 方块连连消团队 版权所有
