<template>
  <div class="achives-item" :class="{ 'achives-item-blocked': !item.finished }">
    <div class="achives-item-img-block">
      <img class="achives-item-img" width="128" height="108" :src="imageUrl" alt="" />
    </div>
    <p class="achives-item-title" v-html="$t(`mainAchivs.${item.type}.title`)" />
    <p v-if="!item.finished" class="achives-item-not-done" v-html="$t('mainAchivs.compleateStatusNotFinish')" />
    <p v-else class="achives-item-done" v-html="$t('mainAchivs.compleateStatusFinish')" />
    <p class="achives-item-subtitle" v-html="$t(`mainAchivs.${item.type}.text`)" />
  </div>
</template>

<script lang="ts" setup>
// import BlockedIcon from 'public/images/achievements/img_locked.svg?component';
import { computed } from 'vue';
import type { tAchievementItem } from '@/types/general';
import { useStoreExponea } from '@/stores/exponea';
interface mainShopItemProps {
  item: tAchievementItem;
}

const props = defineProps<mainShopItemProps>();

defineEmits<{
  (e: 'btnClick', item: tAchievementItem): void;
  (e: 'btnHowClick'): void;
}>();

const storeExponea = useStoreExponea();

const imageUrl = computed(
  () => `${import.meta.env.BASE_URL}images/achievements/img_${props.item.type}.svg`
);
</script>

<style lang="scss" scoped src="./mainAchivementsItem.scss"></style>
