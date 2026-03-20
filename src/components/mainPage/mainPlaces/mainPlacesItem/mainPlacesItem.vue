<template>
  <div class="main-places-item">
     <div class="main-places-item-header">
          <slot name="icon" />
          <div class="main-places-item-title-holder">
            <p class="main-places-item-title">{{ title }}</p>
             <button v-if="!isAdress"
              class="btn-reset main-places-item-add"
              @click="
                storeModals.openModal({ name: 'addPlaceModal', params: { placeType: adressType, achiveId: achiveId} })
              "
            >
              {{ newAdress }}
            </button>
          </div>
          <button v-if="isAdress"
            class="btn-reset main-places-item-go-arrow"
            @click="
              storeModals.openModal({ name: 'addPlaceModal', params: { placeType: adressType, achiveId: achiveId } })
            "
          >
            <img src="/images/icons/ico_arrow_right.svg" width="24" height="24" alt=">" />
          </button>
        </div>
        <p v-if="isAdress" class="main-places-item-value">
          {{ adress }}
        </p>
  </div>
</template>

<script lang="ts" setup>

import { useStoreModals } from '@/stores/modals';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const storeModals = useStoreModals();
const { t } = useI18n();
interface mainPlacesItemProps {
  title: string,
  adressType: 'home' | 'work' | 'additional',
  adress: string,
  achiveId?: string
}

const props = defineProps<mainPlacesItemProps>();

const isAdress = computed(() => props.adress !== 'None');
const newAdress = computed(() => {
  if(props.adressType == 'home'){
    return t('places.addHomePlace');
  }else if(props.adressType == 'work'){
    return t('places.addWorkPlace');
  }else{
    return t('places.addNewPlace');
  }
} );
// const achive = computed(() => props.achiveId);

</script>

<style lang="scss" scoped src="../mainPlaces.scss"></style>