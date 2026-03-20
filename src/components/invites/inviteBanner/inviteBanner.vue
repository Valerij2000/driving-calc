<template>
  <div class="invite-banner">
    <p class="invite-banner-title">{{ $t('invitations.title') }}</p>
    <div class="invite-banner-statuses">
      <div class="invite-banner-status">
        <AwaitIcon />
        <p class="main-ref-block-status-text">
          {{ $t('invitations.invitesCountTitle')}}: <span>{{ storeUser.userReferralPending }}</span>
        </p>
      </div>
      <div class="invite-banner-status">
        <DoneIcon />
        <p class="main-ref-block-status-text">
          {{ $t('invitations.friendsCountTitle')}}: <span>{{ storeUser.userReferralFinished }}</span>
        </p>
      </div>
    </div>
    <div class="invite-banner-ref">
      <p class="invite-banner-ref-title">{{ $t('invitations.linkTitle')}}</p>
      <div
        class="invite-banner-ref-link"
        :class="{ success: isCopiedStatus === 'done', fail: isCopiedStatus === 'fail' }"
      >
        <p>
          {{ storeRoot.refLink }}
        </p>
        <button class="btn-reset" @click="copyLink">
          <img src="/images/icons/ico_copy.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DoneIcon from 'public/images/invites/ico_done_invites.svg?component';
import AwaitIcon from 'public/images/invites/ico_pending_invites.svg?component';
import { ref } from 'vue';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';
interface inviteBannerProps {}

defineProps<inviteBannerProps>();

const storeExponea = useStoreExponea();
const storeRoot = useStoreRoot();
const storeUser = useStoreUser();

const isCopiedStatus = ref<null | 'done' | 'fail'>(null);

async function copyLink() {
  if(storeRoot.refLink){
  try {
      await navigator.clipboard.writeText(storeRoot?.refLink);
      storeExponea.sendAction('send', {type: "invite", url: storeRoot.refLink }, { doNotLoad: true });
      isCopiedStatus.value = 'done';
    } catch (error) {
      console.log('failed to copy to clipboard. error=' + error);
      isCopiedStatus.value = 'fail';
    }

    setTimeout(() => {
      isCopiedStatus.value = null;
    }, 2000);
  }
  
}
</script>

<style lang="scss" scoped src="./inviteBanner.scss"></style>
