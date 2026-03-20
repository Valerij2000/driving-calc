<template>
  <div id="app-wrapper" class="app-wrapper">
    <template v-if="storeExponea.isUserDataLoaded">
      <AppHeader v-if="storeRoot.currentPage !== 'home'" />
      <select aria-label="change lang"
        id="locale-select"
        v-model="$i18n.locale"
        style="position: fixed; top: 0; z-index: 9999999; pointer-events: all;"
      >
        <option v-for="lang in LANGS" :key="lang" :value="lang">{{ lang }}</option>
      </select>
      <HomeView v-if="storeRoot.currentPage === 'home'"/>
      <!-- <InvitesView v-if="storeRoot.currentPage === 'invites'" /> -->
      <TripsView v-if="storeRoot.currentPage === 'trips'" />
    </template>
    <div v-else class="loader-wrapper">
      <span class="loader" />
    </div>
    <ModalsHolder />
    <!-- <Onboarding v-if="storeRoot.startOnboarding || (storeRoot.isAchievementsImagesLoaded && !storeUser.onboardingFinished)" /> -->
    <Onboarding v-if="storeRoot.startOnboarding && storeRoot.isAchievementsImagesLoaded && (storeUser.onboardingCounter < 2)" />
    <canvas
      id="canvas-confetti"
      :class="{ 'canvas-confetti-unlock': storeExponea.isUserFirstVisit }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
// import { useI18n } from 'vue-i18n';
import { useStoreModals } from './stores/modals';
import { useStoreRoot } from './stores/root';
// import { sendMessage } from './utils/helpers';
import HomeView from './views/HomeView.vue';
// import InvitesView from './views/InvitesView.vue';
import TripsView from './views/TripsView.vue';
import type { ExponeaUserData } from './types/general';
import AppHeader from '@/components/header/header.vue';
import ModalsHolder from '@/components/modals/modalsHolder/modalsHolder.vue';
import Onboarding from '@/components/onboarding/onboarding.vue';
import { useStoreExponea } from '@/stores/exponea';
import { LANGS } from './utils/constants';
import { useStoreUser } from './stores/user';

const storeUser = useStoreUser();
const storeExponea = useStoreExponea();
const storeModals = useStoreModals();
const storeRoot = useStoreRoot();
// const isFullyLoaded = ref(false)
// const { locale } = useI18n();

const handleEvent = (event: any) => {
  console.log(event.detail)
  const customData: ExponeaUserData = {
    ...event.detail,
    discount: {
      ...event.detail.discount,
      has_discount: true
    }
   
    // achievements: [
    //   { type: 'weekend_warrior', active: false, state: 'waiting', progress: [5, 5], temporar: true },
    //   { type: 'night_rider', active: true, state: 'waiting', progress: [5, 5], temporar: true},
    // ],
  };
  storeExponea.setUserData(customData);
  // storeExponea.setUserData(event.detail);
};

watch(
  () => storeRoot.stopScrolling,
  (val) => {
    if (val) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }
);
// watch(
//   () => storeExponea.isUserFirstVisit,
//   (val) => {
//     if (val) {
//       storeRoot.setStartOnboarding(true);
//     }
//   }
// );

watch(
  () => storeRoot.isAchievementsImagesLoaded,
  (val) => {
    if (val && storeExponea.isUserFirstVisit) {
      storeRoot.setStartOnboarding(true)
    }
  }
)

watch(
  () => storeRoot.currentPage,
  (val, oldVal) => {
    if (val !== oldVal) {
      window.scrollTo(0, 0);
      storeExponea.triggerLoadOnce();
    }
  }
);

// watch(
//   () => locale.value,
//   (val) => {
//     storeRoot.setLocale(val);
//     if (val === 'ar') {
//       document.documentElement.setAttribute('dir', 'rtl');
//       document.body.classList.add('rtl');
//     } else {
//       document.documentElement.removeAttribute('dir');
//       document.body.classList.remove('rtl');
//     }
//   },
//   { immediate: true }
// );
onMounted(async () => {
   
  
  window.addEventListener('userData', handleEvent);
 
  // const storageRefLink = localStorage.getItem('refLink');
  // if (storageRefLink) {
  //   storeRoot.setRefLink(storageRefLink);
  // }

  // window.addEventListener('message', (event) => {
  //   try {
  //     const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
  //     if (data.action === 'send_marketing_referral_link') {
  //       if (data.success) {
  //         storeRoot.setRefLink(data.payload.referral_link);
  //       } else {
  //         console.warn('Не удалось получить реферальную ссылку');
  //       }
  //     }
  //   } catch (e) {
  //     console.error('Ошибка при обработке сообщения из WebView', e);
  //   } finally {
  //     storeRoot.setLinkRequestStatus(false);
  //   }
  // });

  // if (!storeRoot.refLink && !storeRoot.initLinkRequest) {
  //   sendMessage({
  //     action: 'get_marketing_referral_link',
  //   });
  // }

  const canvas = document.querySelector<HTMLCanvasElement>('#canvas-confetti');
  if (canvas) {
    await storeRoot.initConfetti(canvas);
  }
  await storeExponea.triggerLoad();
 
  storeModals.executeQueue(); // ??

  storeExponea.sendAction('show', {}, { doNotLoad: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      storeExponea.triggerLoadOnce();
    }
  });

  // test
//  console.log(storeExponea.userAchivements[0].active)
  // storeModals.openModal({ name: 'aboutAchivementModal', params: {achivement: storeExponea.userAchivements[1], reachedAchive: true} });
  storeExponea.userAchivements.forEach((achivement) => {
    if (achivement.finished === true && achivement.popup_shown === false && !storeExponea.userData?.first_visit) {
      storeModals.openModal({
        name: 'aboutAchivementModal',
        params: {
          achivement,
          confetti: true,
          sendExponiaTrack: true
        },
      });
    }
  });
  // if (document.readyState === 'complete') {
  //   isFullyLoaded.value = true
  // } else {
  //   window.addEventListener('load', () => {
  //     isFullyLoaded.value = true
  //   })
  // }
  
});

</script>

<style scoped lang="scss">
.loader-wrapper {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid $color-green;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.views-holder {
  height: 100%;
}

.app-wrapper {
  // max-height: calc(100vh - 18px);
  // max-height: calc(100dvh - 18px);
  height: 100%;
  // background: $color-bg-content;
  // border-radius: 16px 16px 0px 0px;
  // overflow-x: hidden;
  // overflow-y: auto;
  position: relative;
  padding-bottom: 16px;

  // overscroll-behavior: contain;
  &.no-bot-menu {
    padding-bottom: 32px;
  }

  &.no-padding {
    padding: 0;
    height: 100vh;
    height: 100dvh;
  }
}

#canvas-confetti {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  pointer-events: none;
}
</style>
