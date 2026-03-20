<template>
  <div class="main-onboarding">
    <div class="main-onboarding-holder" @click="openOnboardingBtn">
      <img src="/images/icons/ico_star_rating.svg" alt="" />
      <p>{{ $t('onboarding.buttonToFinish')}}</p>
      <img src="/images/icons/ico_arrow_right.svg" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';

interface mainOnboardingProps {}

defineProps<mainOnboardingProps>();

const storeRoot = useStoreRoot();
const storeUser = useStoreUser();

const openOnboardingBtn = ()=>{
  storeRoot.setStartOnboarding(true)
  // storeUser.setOnboardingFinished();
}
</script>

<style lang="scss" scoped src="./mainOnboarding.scss"></style>
