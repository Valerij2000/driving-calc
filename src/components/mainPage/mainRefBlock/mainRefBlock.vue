<template>
  <div class="main-ref-block">
    <div class="main-ref-block-holder">
      <div class="main-ref-block-header" @click="storeRoot.setCurrentPage('invites')">
        <p class="main-ref-block-title">{{ $t('referal.title') }}</p>
        <button class="btn-reset" aria-label="to invites page">
          <img src="/images/icons/ico_arrow_right.svg" alt="" width="24" height="24" />
        </button>
      </div>
      <div class="main-ref-block-statuses">
        <div class="main-ref-block-status">
          <img src="/images/invites/ico_pending_invites.svg" width="18" height="18" alt="" />
          <p class="main-ref-block-status-text">
            {{ $t('referal.invites') }}: <span>{{ storeUser.userReferralPending }}</span>
          </p>
        </div>
        <div class="main-ref-block-status">
          <img src="/images/invites/ico_done_invites.svg" width="18" height="18" alt="" />
          <p class="main-ref-block-status-text">
            {{ $t('referal.compleated') }}: <span>{{ storeUser.userReferralFinished }}</span>
          </p>
        </div>
      </div>
      <div class="main-ref-block-share">
        <p>{{ $t('referal.shareTitle') }}:</p>
        <!-- <ul id="onboarding-step1">  -->
        <ul> 
          <li>
            <a
              @click="handleFacebookShare(`https://www.facebook.com/sharer/sharer.php?u=${storeRoot.refLink}`)"
              target="_blank"
              class="btn-share"
              aria-label="Facebook"
            >
              <img src="/images/invites/ico_share_fb.svg" alt="" />
            </a>
          </li>
          <li>
            <a  @click="handleFacebookShare(`https://api.whatsapp.com/send?text=${$t('referal.shareText')}%20${storeRoot.refLink}`)" target="_blank" class="btn-share"  aria-label="WhatsApp">
              <img src="/images/invites/ico_share_wa.svg" alt="" />
            </a>
          </li>
          <li>
            <button class="btn-reset btn-share" @click="copyLink" aria-label="copy link">
              <img src="/images/invites/ico_share_copy.svg" alt="" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';

interface mainRefBlockProps {}

defineProps<mainRefBlockProps>();

const storeExponea = useStoreExponea();
const storeRoot = useStoreRoot();
const storeUser = useStoreUser();

const isCopiedStatus = ref<null | 'done' | 'fail'>(null);

async function copyLink() {
  if(storeRoot.refLink){
    try {
      await navigator.clipboard.writeText(storeRoot.refLink);
      isCopiedStatus.value = 'done';
      storeExponea.sendAction('send', {type: "invite", url: storeRoot.refLink }, { doNotLoad: true });
    } catch (error) {
      console.log('failed to copy to clipboard. error=' + error);
      isCopiedStatus.value = 'fail';
    }
    setTimeout(() => {
      isCopiedStatus.value = null;
    }, 2000);
  }
}

function handleFacebookShare(link: string) {
   storeExponea.sendAction('send', {type: "invite", url: link }, { doNotLoad: true });
  const shareUrl = link;
  window.open(shareUrl, '_blank');
}
</script>

<style lang="scss" scoped src="./mainRefBlock.scss"></style>
