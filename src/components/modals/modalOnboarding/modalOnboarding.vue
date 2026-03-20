<template>
<ModalWrapper first-image-src="onboarding-img.svg" @close="triggerToStartOnboarding()" :variant="'full-size'">
    <template #heading>{{ $t('onboardingPopup.onboardingPopupTitle') }}</template>
    <template #text>
    
    </template>
    <template #button>
      <AppButton variant="big" is-full-width @click="triggerToStartOnboarding()">
        {{ $t('onboardingPopup.onboardingPopupBtn') }}
      </AppButton>
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import ModalWrapper from '@/components/modals/modalWrapper/modalWrapper.vue';
import AppButton from '@/components/ui/AppButton/AppButton.vue';
// import { useStoreExponea } from '@/stores/exponea';
// import { useStoreUser } from '@/stores/user';
import { useStoreRoot } from '@/stores/root';
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'startOnboarding'): void;
}>();

// const storeModals = useStoreModals();
const storeRoot = useStoreRoot();

const triggerToStartOnboarding = ()=>{
    emit('close');
   storeRoot.setCloseOnboardingModal(true);
}

onMounted(() => {
  // storeExponea.notClaimedInvites.forEach((invite, i) => {
  //   storeUser.setClaimedInviteIds(invite.hard_id);
  //   storeExponea.sendAction(
  //     'take',
  //     { type: 'invite', id: invite.hard_id },
  //     { loadOnce: i !== storeExponea.notClaimedInvites.length - 1 }
  //   );
  // });
});
</script>

<style lang="scss" scoped>

</style>
