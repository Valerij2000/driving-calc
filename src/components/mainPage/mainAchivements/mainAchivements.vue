<template>
  <section class="main-achives" ref="achievementsContainer">
    <div id="onboarding-step3">
      <h2>{{ $t('mainAchivs.title') }}</h2>
      <div class="achives-grid">
        <MainAchivementsItem
          v-for="item in achivementsFirstThree"
          :key="item.type"
          class="main-shop-item-inside"
          :item="item"
          @click="openAboutModal(item)"
        />
      </div>
    </div>

    <div class="achives-grid">
      <MainAchivementsItem
        v-for="item in achivementsOther"
        :key="item.type"
        class="main-shop-item-inside"
        :item="item"
        @click="openAboutModal(item)"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import MainAchivementsItem from './mainAchivementsItem/mainAchivementsItem.vue';
import type { tAchievementItem } from '@/types/general';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreModals } from '@/stores/modals';
import { useStoreRoot } from '@/stores/root';

const storeExponea = useStoreExponea();
const storeModals = useStoreModals();
const storeRoot = useStoreRoot();
const achievementsContainer = ref<HTMLElement | null>(null)
// const achivementsSorted = computed(() =>
//   [...storeExponea.userAchivements].sort((a, b) => Number(b.temporar) - Number(a.temporar))
// );

const waitForAllImagesLoaded = async (rootEl: HTMLElement) : Promise<void> =>{
  const images = Array.from(rootEl.querySelectorAll('img'))
  const loading = images
    .filter(img => !img.complete)
    .map(img => new Promise<void>((resolve) => {
      img.addEventListener('load', () => resolve(), { once: true })
      img.addEventListener('error', () => resolve(), { once: true }) // даже с ошибкой засчитываем
    }))

  return Promise.all(loading).then(() => undefined)
}


const achivementsSorted = computed(() =>
  [...storeExponea.userAchivements].sort((a, b) => {
    // Сначала по завершённости: false (0) — выше
    const finishedDiff = Number(a.finished) - Number(b.finished);
    if (finishedDiff !== 0) return finishedDiff;

    // Затем по временности: true (1) — выше
    return Number(b.temporar) - Number(a.temporar);
  })
);

const achivementsFirstThree = computed(() => {
  return achivementsSorted.value.slice(0, 3);
});
const achivementsOther = computed(() => {
  return achivementsSorted.value.slice(3);
});

const openAboutModal = (item: tAchievementItem) => {
  storeModals.openModal({ name: 'aboutAchivementModal', params: { achivement: item} });
};
onMounted(async () => {
  await nextTick() // дождись рендера карточек
  if (achievementsContainer.value) {
    await waitForAllImagesLoaded(achievementsContainer.value)
    storeRoot.setAchievementsImagesLoaded(true)
  }
})
</script>

<style lang="scss" scoped src="./mainAchivements.scss"></style>
