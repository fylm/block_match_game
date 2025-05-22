<template>
  <view 
    class="block" 
    :class="[
      `block-${type}`, 
      { 'selected': selected },
      { 'animated': animated }
    ]"
    :style="{
      backgroundColor: color,
      width: `${size}rpx`,
      height: `${size}rpx`
    }"
  >
    <view v-if="type !== 'normal'" class="block-icon">
      <view v-if="type === 'bomb'" class="bomb-icon"></view>
      <view v-if="type === 'rainbow'" class="rainbow-icon"></view>
      <view v-if="type === 'line'" class="line-icon"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BlockComponent',
  props: {
    color: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'normal',
      validator: (value) => ['normal', 'bomb', 'rainbow', 'line'].includes(value)
    },
    selected: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 60
    }
  }
}
</script>

<style scoped>
.block {
  border-radius: 8rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.block.selected {
  transform: scale(0.9);
  box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.block.animated {
  animation: pulse 0.5s ease;
}

.block-icon {
  position: absolute;
  width: 60%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bomb-icon {
  width: 70%;
  height: 70%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  position: relative;
}

.bomb-icon::after {
  content: '';
  position: absolute;
  top: -25%;
  right: -10%;
  width: 30%;
  height: 30%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.rainbow-icon {
  width: 80%;
  height: 40%;
  background: linear-gradient(to right, red, orange, yellow, green, blue, purple);
  border-radius: 20rpx;
}

.line-icon {
  width: 80%;
  height: 20%;
  background-color: rgba(255, 255, 255, 0.8);
  position: relative;
}

.line-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  transform: rotate(90deg);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style> 