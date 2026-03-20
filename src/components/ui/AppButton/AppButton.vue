<template>
  <button
    class="app-button"
    :class="[
      {
        'app-button-loading': isLoading,
        'app-button-fullwidth': isFullWidth,
        'app-button-disabled': isDisabled,
      },
      variant ? `app-button-${variant}` : null,
      color ? `app-button-${color}` : null,
    ]"
  >
    <span class="text-inside">
      <slot />
    </span>
    <span v-if="$slots['append-icon']" class="append-icon">
      <slot name="append-icon" />
    </span>
    <span v-if="isLoading" class="app-button-loader">
      <img src="/images/icons/ico_loader.png" alt="" />
    </span>
  </button>
</template>

<script lang="ts" setup>
interface AppButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: 'big';
  isFullWidth?: boolean;
  color?: 'grey' | 'black';
}

defineProps<AppButtonProps>();
</script>

<style lang="scss" scoped src="./AppButton.scss"></style>
