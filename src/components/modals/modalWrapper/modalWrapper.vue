<template>
  <div v-if="variant !== 'full-size'"
    class="modal"
    :class="{
      'modal-slide-bottom': variant === 'bottom-slide',
      'modal-slide-bottom-custom': variant === 'bottom-slide-custom',
      'modal-page-style': isPage && variant === 'bottom-slide',
    }"
    :style="{ '--modal-height': modalHeight }"
    @click="clickModalHolder"
  >
    <div class="modal-scroller">
      <div ref="modalContentRef" class="modal-content" @scroll="scrollHandler">
        <div v-if="variant === 'bottom-slide-custom'" class="modal-grapper" />
        <button v-if="!isWithoutClose" class="btn-reset modal-close-btn" @click="close">
          <CloseIcon />
        </button>
        <slot name="content" />
      </div>
    </div>
  </div>
    <div v-else
    class="modal modal-full-size"
    :style="{ '--modal-height': modalHeight }"
    @click="clickModalHolder"
  >
    <!-- <template v-if="!isWithoutWow">
      <img class="modal-wow modal-wow-left" src="/images/img_wow_left.png" alt="" />
      <img class="modal-wow modal-wow-right" src="/images/img_wow_right.png" alt="" />
    </template> -->

    <button v-if="!isWithoutClose" class="modal-close-btn" @click="$emit('close')">
      <CloseIcon />
    </button>
    <div class="modal-scroller">
      <div class="modal-content">
        <div v-if="$slots['custom-content']">
          <slot name="custom-content" />
        </div>
        <template v-else>
          <div v-if="firstImageSrc" class="modal-first-image-block">
            <img class="modal-first-image" :src="imgUrl" alt="" />
            <!-- <div class="modal-star">
              <img src="/images/popups/img_star.png" alt="" />
            </div> -->
          </div>
          <slot name="top-content" />

          <p class="modal-header">
            <slot name="heading" />
          </p>
          <p v-if="$slots.text" class="modal-text">
            <slot name="text" />
          </p>
          <div class="modal-button">
            <slot name="button" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CloseIcon from 'public/images/icons/ico_close.svg?component';
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
interface modalWrapperProps {
  isWithoutClose?: boolean;
  isClickOutsideDisabled?: boolean;
  isPreventClose?: boolean;
  isPage?: boolean;
  firstImageSrc?: string;
  modalHeight?: string;
  variant?: 'bottom-slide' | 'full-size' | 'bottom-slide-custom';
}
const imgUrl = computed(() => `${import.meta.env.BASE_URL}images/modals/${props.firstImageSrc}`);

const props = defineProps<modalWrapperProps>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'btnClick'): void;
}>();

const touchstartY = ref(0);
const touchendY = ref(0);
const scrolledRecently = ref(false);
const scrolledRecentlyTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const modalContentRef = ref<HTMLElement | null>(null);

const close = () => {
  if (!props.isPreventClose) {
    emit('close');
  }
};

const clickModalHolder = (e: Event) => {
  if (
    !props.isClickOutsideDisabled &&
    e.target &&
    (e.target as HTMLElement).classList.contains('modal-scroller') &&
    props.variant !== 'full-size' &&
    props.variant !== 'bottom-slide'
  ) {
    close();
  }
};

function checkDirection() {
  if (
    touchendY.value > touchstartY.value + 100 &&
    modalContentRef.value?.scrollTop === 0 &&
    !scrolledRecently.value
  ) {
    close();
  }
}

const scrollHandler = () => {
  if (scrolledRecentlyTimer.value) {
    clearTimeout(scrolledRecentlyTimer.value);
  }
  scrolledRecently.value = true;
  scrolledRecentlyTimer.value = setTimeout(() => {
    scrolledRecently.value = false;
  }, 500);
};

const touchstartHandler = (e: TouchEvent) => {
  touchstartY.value = e.changedTouches[0].screenY;
};
const touchendHandler = (e: TouchEvent) => {
  touchendY.value = e.changedTouches[0].screenY;
  checkDirection();
};

onMounted(() => {
  if (props.variant === 'bottom-slide-custom') {
    document.addEventListener('touchstart', touchstartHandler);

    document.addEventListener('touchend', touchendHandler);
  }
});

onBeforeUnmount(() => {
  if (props.variant === 'bottom-slide-custom') {
    document.removeEventListener('touchstart', touchstartHandler);

    document.removeEventListener('touchend', touchendHandler);
  }
});
</script>

<style lang="scss" scoped src="./modalWrapper.scss"></style>
