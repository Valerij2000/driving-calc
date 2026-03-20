<template>
  <!-- <ModalWrapper
    class="modal-about-achivement"
    :class="{ 'modal-about-achivement-locked': !achivement.finished }"
  > -->
  <ModalWrapper
    class="modal-about-achivement"
    :class="{ 'modal-about-achivement-locked': !achivement.finished }"
    @close="$emit('close')"
  >
    <template #content>
      <div class="modal-inside-content">
        <img class="achiv-image" :src="imageUrl" alt="" />
        <div class="achiv-block-content">
          <p class="title" v-html="$t(`mainAchivs.${achivement.type}.title`)" />
          <p class="subtitle" v-if="achivement.progress || (!achivement.finished && !achivement.progress)" v-html="$t(`mainAchivs.${achivement.type}.text`)" />
          <div v-if="achivement.progress && achivement.progress[1] > 1" class="achiv-progress">
            <p>
             {{$t('mainAchivs.compleatedProgress')}}
              <strong>{{ currentProgress }} {{$t('mainAchivs.compleatedOutOfProgress')}} {{ achivement.progress[1] }}</strong>
            </p>
            <div class="bar">
              <span
                :style="{ '--progress': progressPercent + '%' }"
              >
            </span>
              <img :style="{ left: `calc(${progressPercent}% - 20px)` }" src="/images/icons/ico_car.svg" alt="" />
            </div>
          </div>
          <div class="subtitle-finish" v-if="achivement.finished && !achivement.progress">
            {{ $t(`mainAchivs.${achivement.type}.text`) }}
          </div>
          <p v-if="achivement.finished" class="achiv-unlocked-text">
          {{ randomModalText }}
          </p>
          <AppButton
              v-if="!achivement.finished && (achivement.type === 'home_sweet_home' || achivement.type === 'work_work_work')"
              variant="big"
              is-full-width
              @click="scrollToOnboarding"
            >
              {{ buttonText() }}
            </AppButton>
          <AppButton v-else-if="!achivement.finished && achivement.type == 'life_of_the_party'" variant="big" is-full-width @click="inviteButtonAction"> {{buttonText()}} </AppButton>
          <a v-else-if="!achivement.finished" class="btn-go" href="indrive://open/client/city">
            <AppButton variant="big" is-full-width>  {{buttonText()}} </AppButton>
          </a>
          <AppButton v-else variant="big" is-full-width @click="$emit('close')">{{$t('btns.awesome')}}</AppButton>
        </div>
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
// import IconShare from 'public/images/icons/ico_share.svg?component';
import { computed } from 'vue';
import ModalWrapper from '../modalWrapper/modalWrapper.vue';
import type { tAchievementItem } from '@/types/general';
import { AppButton } from '@/components/ui';
import { useStoreModals } from '@/stores/modals';
import { useI18n } from 'vue-i18n';
import { useStoreRoot } from '@/stores/root';
const storeRoot = useStoreRoot();
const storeModals = useStoreModals();
const achivement = computed((): tAchievementItem => storeModals.activeModal?.params?.achivement);
// const adressFilled = computed((): tAchievementItem => storeModals.activeModal?.params?.adressFilled);

const imageUrl = computed(
  () => `${import.meta.env.BASE_URL}images/achievements/img_${achivement.value.type}.svg`
);
const currentProgress = computed(() => {
  const [current, max] = achivement.value.progress;
  return Math.min(current, max);
});
const progressPercent = computed(() => {
  const [current, total] = achivement.value.progress;
  return Math.min((current / total) * 100, 100);
});


const { t, tm } = useI18n();
const randomModalText = computed(() => {
  const messages = tm('mainAchivs.compleatedModalText');
  const values = Object.values(messages);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
});
const buttonText = ()=>{
  const type = storeModals.activeModal?.params?.achivement.type;
  if (type === "home_sweet_home" || type === "work_work_work") {
  return t("btns.addAddress")
  }else if(type === "life_of_the_party"){
    return  t("btns.inviteFriends")
  }else{
    return t("btns.takeRide")
  }
}
const emit = defineEmits<{
  (e: 'close'): void;
}>();
const inviteButtonAction = ()=>{
  storeRoot.setCurrentPage('invites');
  emit('close');
}
const scrollToOnboarding = () => {
    const target = document.getElementById('onboarding-step3');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth',  block: 'center', });
    }
    emit('close');
  }
</script>

<style lang="scss" scoped src="./aboutAchivementModal.scss"></style>
