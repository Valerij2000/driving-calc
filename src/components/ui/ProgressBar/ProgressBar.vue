<template>
  <div class="progress-bar"><span :style="{ width: progress }" /></div>
</template>

<script lang="ts" setup>
interface ProgressBarProps {
  progress: string;
}

defineProps<ProgressBarProps>();
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 12px;
  background: #f1f3f1;
  position: relative;

  span {
    display: block;
    width: 0%;
    height: 100%;
    background: $color-green;
    border-radius: 12px;
    max-width: 100%;
  }
}
</style>
