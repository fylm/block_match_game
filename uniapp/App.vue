<script>
	export default {
		onLaunch: function() {
			console.log('方块连连消游戏启动');
			// 初始化游戏数据
			this.checkStorageData();
		},
		onShow: function() {
			console.log('游戏显示');
		},
		onHide: function() {
			console.log('游戏隐藏');
		},
		methods: {
			checkStorageData() {
				// 检查并初始化游戏数据
				const highScore = uni.getStorageSync('highScore');
				if (!highScore) {
					uni.setStorageSync('highScore', '0');
				}
				
				const gameIntroShown = uni.getStorageSync('gameIntroShown');
				if (!gameIntroShown) {
					uni.setStorageSync('gameIntroShown', 'false');
				}
			}
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f8f8f8;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: #333;
	}
	
	/* 游戏颜色变量 */
	:root {
		--primary-color: #45B7D1;
		--secondary-color: #FF6B6B;
		--accent-color: #FFC857;
		--background-color: #f8f8f8;
		--text-color: #333333;
		--border-color: #e0e0e0;
	}
	
	/* 弹性布局 */
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	
	/* 按钮样式 */
	.game-button {
		background-color: var(--primary-color);
		color: white;
		border-radius: 8rpx;
		padding: 16rpx 24rpx;
		font-weight: bold;
		border: none;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	.game-button:active {
		opacity: 0.8;
		transform: translateY(2rpx);
	}
</style>
