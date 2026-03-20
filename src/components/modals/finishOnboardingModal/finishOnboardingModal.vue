<template>
  <ModalWrapper class="modal-finish-onboarding" @close="handleClose">
    <template #content>
      <div class="modal-inside-content">
        <img src="/images/modals/img_finish_onboarding.svg" alt="" />
        <p class="title">{{ $t('onboarding.finalModalTitle') }}</p>
        <p class="subtitle">
          {{ $t('onboarding.finalModalText') }}
        </p>
        <AppButton variant="big" is-full-width @click="handleClose">
          {{ $t('onboarding.finalModalBtn') }}
        </AppButton>
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import ModalWrapper from '../modalWrapper/modalWrapper.vue';
import { AppButton } from '@/components/ui';
const emit = defineEmits<{
  (e: 'close'): void;
}>();

function handleClose() {
  // Прокручиваем страницу вверх
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // плавная прокрутка
  });
  
  // Эмитим событие закрытия
  emit('close');
}

</script>

<style lang="scss" scoped>
.modal-inside-content {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 194px;
    display: block;
    margin: 0 0 10px;
  }

  .title {
    color: #000;
    text-align: center;
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 700;
  }

  .subtitle {
    font-size: 14px;
    line-height: normal;
    font-weight: 500;
    color: #000;
    text-align: center;
    margin: 0 auto 18px;
    max-width: 230px;
  }
}
</style>
