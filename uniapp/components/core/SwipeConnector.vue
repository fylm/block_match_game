<template>
  <view 
    class="swipe-connector"
    :style="{ width: `${cols * (blockSize + 8)}rpx`, height: `${rows * (blockSize + 8)}rpx` }"
    @touchstart.prevent="preventDefaultEvent"
    @touchmove.prevent="preventDefaultEvent"
    @touchend.prevent="preventDefaultEvent"
  >
    <!-- 连接线 -->
    <view v-for="(line, index) in connectionLines" :key="`line-${index}`" 
      class="connection-line"
      :style="{
        left: `${line.x1}rpx`,
        top: `${line.y1}rpx`,
        width: `${line.length}rpx`,
        transform: `rotate(${line.angle}deg)`,
        transformOrigin: '0 50%',
        backgroundColor: line.color
      }"
    ></view>
    
    <!-- 触摸指示器 -->
    <view 
      v-if="touchIndicator.visible" 
      class="touch-indicator"
      :style="{
        left: `${touchIndicator.x}px`,
        top: `${touchIndicator.y}px`
      }"
    ></view>
    
    <!-- 方块网格区域 -->
    <view 
      v-for="(row, rowIndex) in rows" 
      :key="`row-${rowIndex}`" 
      class="block-row"
    >
      <view 
        v-for="(col, colIndex) in cols" 
        :key="`block-${rowIndex}-${colIndex}`"
        class="block-area"
        :style="{ 
          width: `${blockSize}rpx`, 
          height: `${blockSize}rpx`, 
          margin: '4rpx'
        }"
        @touchstart="handleStart($event, rowIndex, colIndex)"
        @touchmove="handleMove"
        @touchend="handleEnd"
        @touchcancel="handleEnd"
      ></view>
    </view>
    
    <!-- 选中块高亮显示 -->
    <view 
      v-for="(pathItem, index) in path" 
      :key="`selected-${index}`"
      class="selected-block"
      :style="{
        left: `${pathItem.col * (blockSize + 8) + 4}rpx`,
        top: `${pathItem.row * (blockSize + 8) + 4}rpx`,
        width: `${blockSize}rpx`,
        height: `${blockSize}rpx`,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '8rpx',
        zIndex: 1
      }"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'SwipeConnector',
  props: {
    rows: {
      type: Number,
      required: true
    },
    cols: {
      type: Number,
      required: true
    },
    blockColors: {
      type: Array,
      required: true
    },
    blockSize: {
      type: Number,
      default: 60
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    specialBlocks: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      path: [],
      isDragging: false,
      touchIndicator: {
        x: 0,
        y: 0,
        visible: false
      },
      connectionLines: [],
      lastBlock: null,
      boardRect: null
    }
  },
  mounted() {
    // 获取board的位置信息
    this.updateBoardRect();
    // 监听窗口大小变化，更新boardRect
    window.addEventListener('resize', this.updateBoardRect);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateBoardRect);
  },
  methods: {
    preventDefaultEvent(e) {
      // 阻止默认行为，防止页面滚动
    },
    
    updateBoardRect() {
      // 获取组件元素
      const element = this.$el;
      if (element) {
        this.boardRect = element.getBoundingClientRect();
      }
    },
    
    clearPath() {
      this.path = [];
      this.connectionLines = [];
      this.lastBlock = null;
    },
    
    handleStart(e, row, col) {
      if (!this.isEnabled) return;
      
      // 获取触摸位置
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;
      
      // 显示触摸指示器
      this.touchIndicator = {
        x: clientX,
        y: clientY,
        visible: true
      };
      
      // 开始新路径
      this.isDragging = true;
      this.path = [{row, col}];
      this.lastBlock = {row, col};
      
      // 更新boardRect
      this.updateBoardRect();
    },
    
    handleMove(e) {
      if (!this.isDragging || !this.isEnabled || !this.boardRect) return;
      
      // 获取触摸位置
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;
      
      // 更新触摸指示器位置
      this.touchIndicator = {
        x: clientX,
        y: clientY,
        visible: true
      };
      
      // 计算相对于board的位置
      const relativeX = clientX - this.boardRect.left;
      const relativeY = clientY - this.boardRect.top;
      
      // 计算当前触摸的方块行列
      const blockSizePx = this.blockSize * (uni.getSystemInfoSync().windowWidth / 750); // 将rpx转为px
      const gap = 8 * (uni.getSystemInfoSync().windowWidth / 750); // 间隙
      
      const col = Math.floor(relativeX / (blockSizePx + gap));
      const row = Math.floor(relativeY / (blockSizePx + gap));
      
      // 检查是否在有效范围内
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        // 检查是否与上一个方块相邻
        const lastBlock = this.lastBlock;
        if (lastBlock) {
          const isAdjacent = (
            (Math.abs(row - lastBlock.row) <= 1 && Math.abs(col - lastBlock.col) <= 1) &&
            !(row === lastBlock.row && col === lastBlock.col)
          );
          
          // 检查是否与路径中的第一个方块颜色相同
          const isSameColor = this.blockColors[row][col] === this.blockColors[this.path[0].row][this.path[0].col];
          
          // 检查是否已经在路径中
          const isInPath = this.path.some(p => p.row === row && p.col === col);
          
          // 如果相邻、颜色相同且不在路径中，添加到路径
          if (isAdjacent && isSameColor && !isInPath) {
            // 添加到路径
            this.path.push({row, col});
            
            // 更新连接线
            this.updateConnectionLines();
            
            // 更新最后一个方块
            this.lastBlock = {row, col};
          }
          // 如果是路径中的倒数第二个方块，允许返回（撤销最后一步）
          else if (this.path.length >= 2 && row === this.path[this.path.length - 2].row && col === this.path[this.path.length - 2].col) {
            // 移除路径中的最后一个方块
            this.path.pop();
            
            // 更新连接线
            this.updateConnectionLines();
            
            // 更新最后一个方块
            this.lastBlock = {row, col};
          }
        }
      }
    },
    
    handleEnd() {
      if (!this.isDragging || !this.isEnabled) return;
      
      // 隐藏触摸指示器
      this.touchIndicator.visible = false;
      
      // 结束拖动
      this.isDragging = false;
      
      // 如果路径长度大于等于3，触发回调
      if (this.path.length >= 3) {
        this.$emit('pathComplete', this.path);
      }
      
      // 清除路径
      this.clearPath();
    },
    
    updateConnectionLines() {
      if (this.path.length < 2) return;
      
      const newLines = [];
      
      // 获取第一个方块的颜色
      const pathColor = this.blockColors[this.path[0].row][this.path[0].col];
      
      // 为每对相邻方块创建连接线
      for (let i = 0; i < this.path.length - 1; i++) {
        const current = this.path[i];
        const next = this.path[i + 1];
        
        // 计算方块中心位置
        const x1 = (current.col * (this.blockSize + 8)) + (this.blockSize / 2);
        const y1 = (current.row * (this.blockSize + 8)) + (this.blockSize / 2);
        const x2 = (next.col * (this.blockSize + 8)) + (this.blockSize / 2);
        const y2 = (next.row * (this.blockSize + 8)) + (this.blockSize / 2);
        
        // 计算角度和长度
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // 添加连接线
        newLines.push({
          x1,
          y1,
          x2,
          y2,
          angle,
          length,
          color: pathColor
        });
      }
      
      this.connectionLines = newLines;
    }
  }
}
</script>

<style scoped>
.swipe-connector {
  position: relative;
  touch-action: none;
  padding: 12rpx;
  box-sizing: border-box;
}

.block-row {
  display: flex;
  flex-direction: row;
}

.block-area {
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}

.connection-line {
  position: absolute;
  height: 10rpx;
  border-radius: 5rpx;
  z-index: 1;
  opacity: 0.7;
}

.touch-indicator {
  position: fixed;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.selected-block {
  position: absolute;
  box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.8);
  transition: all 0.1s ease;
}
</style> 