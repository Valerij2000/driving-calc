<template>
  <div class="holder">
    <ModalWrapper
      :is-prevent-close="isNeedDeleteConfirm"
      is-without-wow
      variant="bottom-slide-custom"
      class="modal-add-place"
      @close="$emit('close')"
    >
      <template #content>
        <div class="modal-inside-content">
          <div class="my-place-form">
            <p class="title">{{ $t('places.placesTitle') }}</p>
            <form>
              <div class="name-input">
                <img :src="placeIconSrc" alt="" />
                <p>
                 {{ placeType === 'home' ? $t('places.homeTitle') : placeType === 'work' ? $t('places.workTitle') : $t('places.additionalTitle') }}
                </p>
              </div>
              <div class="input-address">
                <input type="text" name="city" :placeholder="$t('places.placeholderCity')" v-model="city"  :class="{ 'input-error': errors.city }"  maxlength="100"/>
              </div>
              <div class="two-inputs">
                <div class="input-address">
                  <input type="text" name="street" :placeholder="$t('places.placeholderStreet')" v-model="street"  :class="{ 'input-error': errors.street }"  maxlength="100"/>
                </div>
                <div class="input-address">
                  <input type="text" name="house" :placeholder="$t('places.placeholderHouse')" v-model="house"  :class="{ 'input-error': errors.house }" maxlength="100" />
                </div>
              </div>
            </form>
          </div>
          <div>
          <div class="btns-block">
            <AppButton is-full-width class="btn-save" @click="confirmSave"> {{$t('places.btnSave')}} </AppButton>
            <AppButton v-if="adress !== 'None'"
              is-full-width
              class="btn-save"
              color="black"
              @click="isNeedDeleteConfirm = true"
            >
              {{$t('places.btnDelete')}}
            </AppButton>
            <AppButton v-else
              is-full-width
              class="btn-save"
              color="black"
              @click="$emit('close')"
            >
              {{$t('places.btnBack')}}
            </AppButton>
          </div>
          <a href="https://promotion.indrive.com/en/web/rh/pe/cons/terms-and-conditions/get-discount-on-trip?browser=true" target="_blank" class="terms-link">{{$t('places.terms')}}</a>
          </div>
        </div>
      </template>
    </ModalWrapper>
    <ModalWrapper
      v-if="isNeedDeleteConfirm"
      is-without-close
      is-without-wow
      variant="bottom-slide-custom"
      class="modal-delete-confirmation"
      modal-height="auto"
      @close="isNeedDeleteConfirm = false"
    >
      <template #content>
        <div class="del-confirm-content">
          <p>
            <strong>{{$t('places.sureDelete')}}</strong>
            <br />{{$t('places.actionUndone')}}
          </p>
          <div class="del-confirm-btns-block">
            <AppButton
              is-full-width
              class="btn-save"
              variant="big"
              @click="isNeedDeleteConfirm = false"
            >
               {{$t('places.btnBack')}}
            </AppButton>
            <AppButton
              is-full-width
              variant="big"
              class="btn-save"
              color="black"
              @click="confirmDelete"
            >
              {{$t('places.btnDelete')}}
            </AppButton>
          </div>
        </div>
      </template>
    </ModalWrapper>
  </div>
</template>

<script lang="ts" setup>
// import IconShare from 'public/images/icons/ico_share.svg?component';

import { computed, ref,  watch } from 'vue';
import ModalWrapper from '@/components/modals/modalWrapper/modalWrapper.vue';
import { AppButton } from '@/components/ui';
import { useStoreModals } from '@/stores/modals';
// import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';
import { useStoreExponea } from '@/stores/exponea';
import homeIcon from '/images/places/ico_home.svg';
import workIcon from '/images/places/ico_job.svg';
import pinIcon from '/images/places/ico_pin.svg';
const storeModals = useStoreModals();
// const storeRoot = useStoreRoot();
const storeUser = useStoreUser();
const storeExponea = useStoreExponea();
const isNeedDeleteConfirm = ref(false);

const placeType = computed(() => storeModals.activeModal?.params?.placeType);
const achiveId = computed(() => storeModals.activeModal?.params?.achiveId);

const city = ref('');
const street = ref('');
const house = ref('');

const adress = ref('');
watch(
  () => storeUser.getAdresses(placeType.value),
  (newVal) => {
    adress.value = newVal || '';
  },
  { immediate: true }
);

if (adress.value && adress.value !== 'None') {
  const parts = adress.value.split(',').map(s => s.trim());
  city.value = parts[0] || '';
  street.value = parts[1] || '';
  house.value = parts[2] || '';
}

const placeIconSrc = computed(() => {
  if (!placeType.value) return;
  switch (placeType.value) {
    case 'home':
      return homeIcon;
    case 'work':
      return workIcon;
    case 'additional':
      return pinIcon;
    default:
      return;
  }
});
const errors = ref<{ city: boolean; street: boolean; house: boolean }>({
  city: false,
  street: false,
  house: false
});

const confirmSave= () => {
  if (!placeType.value) return;
  errors.value.city = !city.value.trim();
  errors.value.street = !street.value.trim();
  errors.value.house = !house.value.trim();
  const hasErrors = Object.values(errors.value).some(Boolean);
  if (hasErrors) return;
  const fullAddress = [city.value, street.value, house.value].join(', ');
  storeExponea.sendAction('update address', {[placeType.value]: fullAddress }, { doNotLoad: true });
  storeUser.setUserAddress(placeType.value, fullAddress);
  storeModals.openModal({ name: 'addressAddModal', params: { placeType: placeType.value, achiveId: achiveId.value} });
  storeModals.closeModals();

};

const confirmDelete = () => {
  storeExponea.sendAction('update address', {[placeType.value]: "None" }, { doNotLoad: true });
  storeUser.setUserAddress(placeType.value, "None")
  storeModals.openModal({ name: 'addressRemovedModal' });
  storeModals.closeModals();
};
</script>

<style lang="scss" scoped src="./addPlaceModal.scss"></style>
