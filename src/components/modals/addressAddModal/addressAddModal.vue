<template>
  <ModalWrapper
    is-without-close
    is-without-wow
    variant="bottom-slide-custom"
    class="modal-delete-confirmation"
    modal-height="auto"
  >
    <template #content>
      <div class="address-add-content">
        <p>{{$t('places.adressSaved')}}</p>
        <AppButton is-full-width class="btn-save" variant="big" @click="closeSuccessSave">
          {{$t('places.btnClose')}}
        </AppButton>
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import ModalWrapper from '@/components/modals/modalWrapper/modalWrapper.vue';
import { AppButton } from '@/components/ui';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreModals } from '@/stores/modals';
import { useStoreUser } from '@/stores/user';
import { computed } from 'vue';
const storeModals = useStoreModals();
const storeUser = useStoreUser();
const storeExponea = useStoreExponea();
const adress = computed(() => storeModals.activeModal?.params?.placeType);
const emit = defineEmits<{
  (e: 'close'): void;
}>();
const closeSuccessSave = ()=>{
  // let achiveName = '';
  // const placeType = storeModals.activeModal?.params?.placeType;

  // switch (placeType) {
  //   case 'home':
  //     achiveName = 'home_sweet_home';
  //     break;
  //   case 'work':
  //     achiveName = 'work_work_work';
  //     break;
  //   default:
  //     achiveName = "";
  //       break;
  // }

  // const achievement = storeExponea.userData?.achievements?.find(
  //   (a) => a.type === achiveName
  // );
  let achievement = storeExponea.userData?.achievements?.find(
    (a) => a.type === storeModals.activeModal?.params?.achiveId
  );

  if(storeModals.activeModal?.params?.achiveId){
    storeUser.getAchivementByType(storeModals.activeModal?.params?.achiveId);
    // storeUser.getuserAchivements()
    achievement = storeExponea.userData?.achievements?.find(
      (a) => a.type === storeModals.activeModal?.params?.achiveId
    );
  }
  console.log(storeUser.getAdresses(adress.value), achievement, achievement?.popup_shown)
  if(storeUser.getAdresses(adress.value) !== 'None' && achievement && !achievement?.popup_shown){
    storeModals.openModal({
      name: 'aboutAchivementModal',
      params: {
        achivement: achievement,
        // adressFilled: true,
        confetti: true,
        sendExponiaTrack: true
      },
    });
    storeUser.setAchiveToSession(storeModals.activeModal?.params?.achiveId);
  }
 
 emit('close');
}
</script>

<style lang="scss" scoped>
.address-add-content{
  text-align: center;
  p{
    margin-bottom: 20px;
  }
}
</style>
