<template>
  <div id="modals-holder" :data-modal-name="activeModalName">
    <component v-if="activeModalNoTransition"
        :is="currentModalComponent"
        :key="activeModalName"
        @close="storeModals.closeModals()"
      />
    <transition name="slide-up" mode="out-in" v-else>
      <component
        :is="currentModalComponent"
        :key="activeModalName"
        @close="storeModals.closeModals()"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, markRaw, shallowRef, watchEffect } from 'vue';

// import ModalWelcome from '../onboardingModal/onboardingModal.vue';
import { useStoreModals } from '@/stores/modals';

const storeModals = useStoreModals();

const activeModalName = computed(() => storeModals.activeModal?.name);
const activeModalNoTransition = computed(() => storeModals.activeModal?.params?.notransition);

const currentModalComponent = shallowRef();

watchEffect(() => {
  if (activeModalName.value) {
    currentModalComponent.value = markRaw(
      defineAsyncComponent(
        () => import(`@/components/modals/${activeModalName.value}/${activeModalName.value}.vue`)
      )
    );
  } else {
    currentModalComponent.value = null;
  }
});
</script>

<style lang="scss" scoped>
// .slide-up-enter-from,
// .slide-up-leave-to {
//   background: rgba(0, 0, 0, 0) !important;
//   transform: translateY(100%);
// }
// .slide-up-enter-to,
// .slide-up-leave-from {
//   transform: translateY(0);
// }
// .slide-up-enter-to {
//   background: rgba(0, 0, 0, 0.5) !important;
//   &.modal-full-size {
//     background: rgba(20, 20, 20, 0.8) !important;
//   }
// }
// .slide-up-leave-from {
//   transition: background 0s ease !important;
//   background: rgba(0, 0, 0, 0) !important;
// }
// .slide-up-enter-active,
// .slide-up-leave-active {
//   transition: transform 0.4s ease, opacity 0.4s ease, background 0.1s 0.1s ease;
// }
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

/* Плавный фон */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

/* Всплытие снизу */
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
</style>
