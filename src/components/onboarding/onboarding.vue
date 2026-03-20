<template>
  <VOnboardingWrapper
    ref="wrapper"
    :options="{ overlay: { padding: 4, borderRadius: 20, preventOverlayInteraction: true}, popper: {placement: 'top', disableAutoFlip: true,   modifiers: [ {name: 'flip', enabled: false }, { name: 'offset', options: { offset: [-200, -10]}}]}}"
    :steps="steps"
    @finish="finish"
    @exit="exit"
  >
    <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
      <VOnboardingStep class="onboarding-step" :class="`step-${index}`">
        <button class="btn-reset onboarding-btn-close" @click="exit">
          <img src="/images/icons/ico_close_circle.svg" alt="x" />
        </button>
        <div class="onboarding-dialog">
          <p>{{ step.content.description }}</p>
          <div class="onboarding-nav">
            <span>
              <button v-if="!isFirst" class="btn-reset btn-nav btn-prev" @click="previous">
                <ArrowIcon />
                <span> {{ $t('onboarding.btnPrev') }} </span>
              </button>
            </span>

            <button v-if="!isLast" class="btn-reset btn-nav btn-next" @click="next">
              <span> {{ $t('onboarding.btnNext') }} </span>
              <ArrowIcon />
            </button>
            <button v-if="isLast" class="btn-reset btn-nav btn-next" @click="next">
              <span> {{ $t('onboarding.btnFinish') }} </span>
              <ArrowIcon />
            </button>
          </div>
          <img class="image-tip" src="/images/icons/ico_tip.png" alt="" />
        </div>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
</template>

<script lang="ts" setup>
import ArrowIcon from 'public/images/icons/ico_arrow_right.svg?component';
import { VOnboardingWrapper, useVOnboarding, VOnboardingStep } from 'v-onboarding';
// import { VOnboardingWrapper, useVOnboarding, VOnboardingStep } from '@/vendor/v-onboarding/v-onboarding.es.js';
// import 'v-onboarding/dist/style.css';
import { onMounted, ref, watch, nextTick, computed  } from 'vue';
import { onBeforeUnmount } from 'vue';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreModals } from '@/stores/modals';
import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';
import { useI18n } from 'vue-i18n';
interface onboardingProps {}

defineProps<onboardingProps>();

const storeRoot = useStoreRoot();
const storeModals = useStoreModals();
const storeUser = useStoreUser();
const storeExponea = useStoreExponea();
const { t } = useI18n();
const wrapper = ref(null);
const { start } = useVOnboarding(wrapper);
// const steps =  [
//   // {
//   //   attachTo: { element: '#onboarding-step1' },
//   //   content: { description: t('onboarding.onboardingTitle1') },
//   //   // content: { description: 'Invite friends and track their status here' },
//   //   options: {
//   //     popper: {
//   //       // placement: 'top',
//   //       // disableAutoFlip: true, 
//   //        modifiers: [
//   //         {
//   //           name: 'offset',
//   //           options: {
//   //             offset: [0, 0], // смещение влево
//   //           },
//   //         },
//   //       ],
//   //     }
//   //   }
//   // },
//   {
//     attachTo: { element: '#onboarding-step1' },
//     content: { description: t('onboarding.onboardingTitle1') },
//   },
//   {
//     attachTo: { element: '#onboarding-step2' },
//     content: { description: t('onboarding.onboardingTitle2') },
//     options:{
//       overlay: { padding: { top: 0, right: 16, bottom: 0, left: 16 }},
//     }
//   },
//   {
//     attachTo: { element: '#onboarding-step3' },
//     content: { description: t('onboarding.onboardingTitle3') },
//   },
//   // {
//   //   attachTo: { element: '#onboarding-step3' },
//   //   content: { description: t('onboarding.onboardingTitle3') },
//   // },
// ];


const steps =  computed(() => ([
  
  {
    attachTo: { element: '#onboarding-step1' },
    content: { description: t('onboarding.onboardingTitle1') },
  },
  {
    attachTo: { element: '#onboarding-step2' },
    content: { description: t('onboarding.onboardingTitle2') },
    options:{
      overlay: { padding: { top: 0, right: 16, bottom: 0, left: 16 }},
    }
  },
  {
    attachTo: { element: '#onboarding-step3' },
    content: { description: t('onboarding.onboardingTitle3') },
  },
]));
watch(
  () => storeRoot.closeOnboardingModal,
  (val) => {
    if (val) {
     start();
    }
  }
);
const finish = () => {
  if(!storeUser.onboardingFinished){
    storeModals.openModal({ name: 'finishOnboardingModal' });
    storeRoot.launchConfetti(() => {});
  }
  storeRoot.setStartOnboarding(false);
  storeExponea.triggerLoadOnce();
  storeUser.setOnboardingFinished();
  storeUser.onboardingCounterIncrement();
};
const exit = () => {
  storeModals.executeQueue();
  storeRoot.setStartOnboarding(false);
};

function waitForElements(selectors: string[], callback: () => void, timeout = 2000) {
  const interval = setInterval(() => {
    const allReady = selectors.every((selector) => document.querySelector(selector));
    if (allReady) {
      clearInterval(interval);
      callback();
    }
  }, 50);

  setTimeout(() => clearInterval(interval), timeout); // safety timeout
}

onMounted(() => {
  // storeUser.onboardingCounterIncrement();
  const selectors = steps.value.map(step => step.attachTo.element);
  if(storeExponea.userData?.first_visit && !storeRoot.closeOnboardingModal && !storeUser.onboardingFinished){
    storeModals.openModal({ name: 'modalOnboarding', params: {confetti: true, notransition: true} });
  }else{
    nextTick(() => {
      waitForElements(selectors, () => {
      start();
    });
  });
  }
});
onBeforeUnmount(() => {
  document.body.style.pointerEvents = null;
});
</script>

<style lang="scss" scoped src="./onboarding.scss"></style>
