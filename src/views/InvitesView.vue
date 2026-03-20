<template>
  <div class="invites-view">
    <div class="invites-info-content">
      <InviteBanner />
      <div v-if="listToShow.length" class="invites-list">
        <InviteItem
          v-for="invite in listToShow"
          :key="invite.hard_id"
          :invite="invite"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { InviteItem, InviteBanner } from '@/components/invites';
// import { AppButton } from '@/components/ui';
import { useStoreExponea } from '@/stores/exponea';
// import { useStoreModals } from '@/stores/modals';
import { useStoreRoot } from '@/stores/root';
import { sendMessage } from '@/utils/helpers';
import type { TaskInvite } from '@/types/general';

const storeRoot = useStoreRoot();
const storeExponea = useStoreExponea();
// const storeModals = useStoreModals();

const { t } = useI18n();

// const isProgressModalClosed = ref(false);
// const isLoading = ref(false);

// const progressModalToShow = computed(() => {
//   const doneClaimedInvites = pastInvitesList.value.filter(
//     (invite) => invite.state === 'done' && invite.claimed
//   );
//   const isEightDoneInvites = doneClaimedInvites.length >= 5;
//   if (isEightDoneInvites && !localStorage.getItem('refProgressModal_5')) {
//     return 5;
//   }
//   const isThreeDoneInvites = doneClaimedInvites.length >= 3 && doneClaimedInvites.length < 8;
//   if (isThreeDoneInvites && !localStorage.getItem('refProgressModal_3')) {
//     return 3;
//   }

//   return false;
// });

// const awaitingList = computed(() =>
//   storeExponea.userInvites.filter((invite) => invite.state === 'awaiting')
// );
// const pastInvitesList = computed(() =>
//   storeExponea.userInvites.filter((invite) => invite.state !== 'awaiting')
// );

// const pastInvitesList = computed(() =>
//   storeExponea.userInvites.filter((invite) => invite.state !== 'awaiting')
// );

// const listToShow = computed(() => {
//   console.log(storeExponea.userInvites)
//   return storeExponea.userInvites;
// });

// const claimCoins = async (inviteId: string) => {
//   isLoading.value = true;
//   storeExponea.sendAction('take', { type: 'invite', id: inviteId });
//   isLoading.value = false;
// };

// watch(
//   () => progressModalToShow.value,
//   (val) => {
//     if (val) {
//       if (val === 5) {
//         localStorage.setItem(`refProgressModal_3`, 'true');
//       }
//       localStorage.setItem(`refProgressModal_${val}`, 'true');
//       storeModals.openModal({ name: 'invitesGoalDoneModal', params: { progress: val } });
//     }
//   },
//   { immediate: true }
// );
const listToShow = ref<TaskInvite[]>([]);
onMounted(() => {
  if (!storeRoot.refLink && !storeRoot.initLinkRequest) {
    sendMessage({
      action: 'get_marketing_referral_link',
    });
  }
  listToShow.value = storeExponea.userInvites;
});
</script>

<style lang="scss" scoped src="./InvitesView.scss"></style>
