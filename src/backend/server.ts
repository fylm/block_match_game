import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// 创建Express应用
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS中间件
const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
};

// 应用CORS中间件
app.use(corsMiddleware);

// 环境变量
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/block_match_game';
const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';

// API路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: '《方块连连消》游戏后端服务正在运行' });
});

// 用户数据API
app.get('/api/user/:id', (req: Request, res: Response) => {
  res.json({ 
    id: req.params.id,
    username: `用户${req.params.id}`,
    level: 10,
    score: 5000,
    coins: 1000,
    gems: 50,
    items: [
      { id: 'item1', name: '悔棋', count: 5 },
      { id: 'item2', name: '刷新', count: 3 },
      { id: 'item3', name: '指定消除', count: 2 }
    ]
  });
});

// 排行榜API
app.get('/api/leaderboard', (req: Request, res: Response) => {
  res.json([
    { rank: 1, userId: 'user1', username: '玩家1', score: 9500 },
    { rank: 2, userId: 'user2', username: '玩家2', score: 9200 },
    { rank: 3, userId: 'user3', username: '玩家3', score: 8800 },
    { rank: 4, userId: 'user4', username: '玩家4', score: 8500 },
    { rank: 5, userId: 'user5', username: '玩家5', score: 8200 }
  ]);
});

// 省份战队API
app.get('/api/province-teams', (req: Request, res: Response) => {
  res.json([
    { province: '北京', score: 125000, members: 50 },
    { province: '上海', score: 120000, members: 48 },
    { province: '广东', score: 118000, members: 55 },
    { province: '四川', score: 105000, members: 42 },
    { province: '浙江', score: 98000, members: 40 }
  ]);
});

// 成就API
app.get('/api/achievements/:userId', (req: Request, res: Response) => {
  res.json([
    { id: 'ach1', name: '初级玩家', description: '完成10个关卡', completed: true, progress: 10, total: 10 },
    { id: 'ach2', name: '中级玩家', description: '完成50个关卡', completed: false, progress: 30, total: 50 },
    { id: 'ach3', name: '高级玩家', description: '完成100个关卡', completed: false, progress: 30, total: 100 },
    { id: 'ach4', name: '连击大师', description: '达成10次连击', completed: true, progress: 15, total: 10 },
    { id: 'ach5', name: '收集达人', description: '收集所有皮肤', completed: false, progress: 5, total: 10 }
  ]);
});

// 每日任务API
app.get('/api/daily-tasks/:userId', (req: Request, res: Response) => {
  res.json([
    { id: 'task1', name: '完成3个关卡', reward: { type: 'coins', amount: 100 }, completed: false, progress: 1, total: 3 },
    { id: 'task2', name: '使用2个道具', reward: { type: 'gems', amount: 10 }, completed: true, progress: 2, total: 2 },
    { id: 'task3', name: '达成5次连击', reward: { type: 'item', itemId: 'item1', amount: 1 }, completed: false, progress: 3, total: 5 }
  ]);
});

// 商店API
app.get('/api/store/items', (req: Request, res: Response) => {
  res.json([
    { id: 'item1', name: '悔棋', description: '撤销上一步操作', price: { type: 'coins', amount: 50 }, imageUrl: '/assets/items/undo.png' },
    { id: 'item2', name: '刷新', description: '重新排列所有方块', price: { type: 'coins', amount: 100 }, imageUrl: '/assets/items/refresh.png' },
    { id: 'item3', name: '指定消除', description: '消除指定方块', price: { type: 'gems', amount: 5 }, imageUrl: '/assets/items/remove.png' },
    { id: 'item4', name: '时间延长', description: '延长关卡时间30秒', price: { type: 'gems', amount: 10 }, imageUrl: '/assets/items/time.png' },
    { id: 'item5', name: '能量加速', description: '能量槽充能速度提升50%', price: { type: 'gems', amount: 15 }, imageUrl: '/assets/items/energy.png' }
  ]);
});

// 皮肤商店API
app.get('/api/store/skins', (req: Request, res: Response) => {
  res.json([
    { id: 'skin1', name: '经典皮肤', description: '默认方块皮肤', price: { type: 'free' }, imageUrl: '/assets/skins/classic.png' },
    { id: 'skin2', name: '水晶皮肤', description: '闪亮的水晶方块', price: { type: 'coins', amount: 500 }, imageUrl: '/assets/skins/crystal.png' },
    { id: 'skin3', name: '水果皮肤', description: '可爱的水果方块', price: { type: 'coins', amount: 800 }, imageUrl: '/assets/skins/fruit.png' },
    { id: 'skin4', name: '太空皮肤', description: '炫酷的太空方块', price: { type: 'gems', amount: 50 }, imageUrl: '/assets/skins/space.png' },
    { id: 'skin5', name: '节日皮肤', description: '喜庆的节日方块', price: { type: 'gems', amount: 80 }, imageUrl: '/assets/skins/festival.png' }
  ]);
});

// 热更新API
app.get('/api/hot-update/check', (req: Request, res: Response) => {
  res.json({
    hasUpdate: false,
    version: '1.0.0',
    updateUrl: '',
    updateSize: 0,
    updateDescription: ''
  });
});

// 防沉迷API
app.post('/api/anti-addiction/verify', (req: Request, res: Response) => {
  const { userId, idCard, realName } = req.body;
  res.json({
    success: true,
    isMinor: false,
    playTimeLimit: 0,
    message: '实名认证成功'
  });
});

// Socket.IO连接
io.on('connection', (socket) => {
  console.log('用户已连接:', socket.id);

  // 加入房间
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
  });

  // 离开房间
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`用户 ${socket.id} 离开房间 ${roomId}`);
  });

  // 发送消息
  socket.on('send-message', (data: { roomId: string, message: string }) => {
    const { roomId, message } = data;
    io.to(roomId).emit('receive-message', {
      senderId: socket.id,
      message,
      timestamp: Date.now()
    });
  });

  // 游戏状态更新
  socket.on('update-game-state', (data: { roomId: string, gameState: any }) => {
    const { roomId, gameState } = data;
    socket.to(roomId).emit('game-state-updated', gameState);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户已断开连接:', socket.id);
  });
});

// 启动服务器
server.listen(PORT, async () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  
  // 尝试连接MongoDB（如果可用）
  try {
    // 注释掉实际的MongoDB连接，以便在没有MongoDB的环境中也能运行
    // await mongoose.connect(MONGODB_URI);
    console.log('MongoDB连接已准备就绪（模拟）');
  } catch (error) {
    console.log('MongoDB连接失败（模拟）:', error);
  }
  
  // 尝试连接Redis（如果可用）
  try {
    // 注释掉实际的Redis连接，以便在没有Redis的环境中也能运行
    // const redisClient = createClient({ url: REDIS_URI });
    // await redisClient.connect();
    console.log('Redis连接已准备就绪（模拟）');
  } catch (error) {
    console.log('Redis连接失败（模拟）:', error);
  }
  
  console.log('《方块连连消》游戏后端服务已启动');
});

export default app;
