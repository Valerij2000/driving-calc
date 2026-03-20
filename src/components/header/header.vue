<template>
  <header id="header" class="header">
    <button class="btn-close" @click="goBackToMain">
      <ArrowIcon />
    </button>
  </header>
</template>

<script lang="ts" setup>
import ArrowIcon from 'public/images/icons/ico_arrow_left.svg?component';
import { useStoreRoot } from '@/stores/root';

const storeRoot = useStoreRoot();

const goBackToMain = () => {
  storeRoot.setCurrentPage(storeRoot.backToPage || 'home');
};
</script>

<style lang="scss" scoped src="./header.scss"></style>
