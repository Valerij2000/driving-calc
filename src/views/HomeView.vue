<template>
  <main class="home-page">
    <MainUserData />
    <!-- <MainRefBlock /> -->
    <MainPreferences />
    <!-- <MainPlaces /> -->
    <MainStats />
    <MainOnboarding v-if="isShowOnboardingBlock" />
    <MainAchivements />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  MainUserData,
  MainAchivements,
  MainStats,
  MainRefBlock,
  MainPreferences,
  MainPlaces,
  MainOnboarding,
} from '@/components/mainPage';
// import { useStoreExponea } from '@/stores/exponea';
// import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';

// const storeExponea = useStoreExponea();
// const storeRoot = useStoreRoot();
const storeUser = useStoreUser();

const isOnboardingTimeGome = ref(false);

const isShowOnboardingBlock = computed(() => {
  return (
    // !storeExponea.isUserFirstVisit &&
    // !storeRoot.startOnboarding &&
    storeUser.onboardingCounter < 2 &&
    // !storeUser.onboardingFinished &&
    !isOnboardingTimeGome.value
  );
});

onMounted(() => {
  /** Скрвывать кнопку онбординга если прошло 3 дня */
  const now = Date.now();
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  const storedTime = localStorage.getItem('firstOnboardingTime');
  if (!storedTime) {
    localStorage.setItem('firstOnboardingTime', now.toString());
  } else {
    const firstShown = Number(storedTime);
    if (now - firstShown >= THREE_DAYS) {
      isOnboardingTimeGome.value = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  // height: calc(100vh - 56px);
  // height: calc(100dvh - 56px);
}
</style>
