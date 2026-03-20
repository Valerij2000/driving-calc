<template>
  <ModalWrapper
    is-without-close
    is-without-wow
    variant="bottom-slide-custom"
    class="modal-delete-confirmation"
    modal-height="auto"
    @close="$emit('close')"
  >
    <template #content>
      <div class="address-removed-content">
        <p>{{$t('places.adressRemoved')}}</p>
        <AppButton is-full-width class="btn-save" variant="big" @click="$emit('close')">
          {{$t('places.btnClose')}}
        </AppButton>
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import ModalWrapper from '@/components/modals/modalWrapper/modalWrapper.vue';
import { AppButton } from '@/components/ui';
</script>

<style lang="scss" scoped>
.address-removed-content{
  text-align: center;
  p{
    margin-bottom: 20px;
  }
}
</style>
