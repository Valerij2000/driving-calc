<template>
  <div class="invite-item">
    <div class="invite-item-top">
      <p class="invite-item-name">{{ invite.name }}</p>
      <div v-if="invite.ride_exists === '1'" class="invite-item-status done">
        <IconDone />
        <p>{{ $t('invitations.completedText') }}</p>
      </div>
      <div v-if="invite.ride_exists === '0'" class="invite-item-status">
        <IconClock />
        <p>{{ $t('invitations.pendingText') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconClock from 'public/images/icons/ico_clock.svg?component';
import IconDone from 'public/images/icons/ico_done.svg?component';
import type { TaskInvite } from '@/types/general';

interface inviteItemProps {
  invite: TaskInvite;
}

const props = defineProps<inviteItemProps>();

// const emit = defineEmits<{
//   (e: 'claimCoins', id: string): void;
// }>();
</script>

<style lang="scss" scoped src="./inviteItem.scss"></style>
