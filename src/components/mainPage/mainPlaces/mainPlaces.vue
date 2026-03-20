<template>
  <div class="main-places">
    <div class="main-places-holder">
       <p class="main-places-title">{{ $t('places.placesTitle') }}</p>
       <div class="main-places-list">
        <mainPlacesItem 
          :title="$t('places.homeTitle')"
          :adressType="'home'"
          :adress="homeAdress"
          :achiveId="'home_sweet_home'"
        >
          <template #icon>
               <img class="main-places-item-icon" src="/images/places/ico_home.svg" width="24" height="24" alt="" />
          </template>
        </mainPlacesItem>
        <mainPlacesItem 
          :title="$t('places.workTitle')"
          :adressType="'work'"
          :adress="workAdress"
          :achiveId="'work_work_work'"
        >
          <template #icon>
                <img class="main-places-item-icon" src="/images/places/ico_job.svg" width="24" height="24" alt="" />
          </template>
        </mainPlacesItem>
        <mainPlacesItem 
          :title="$t('places.additionalTitle')"
          :adressType="'additional'"
          :adress="additionalAdress"
        >
          <template #icon>
               <img class="main-places-item-icon" src="/images/places/ico_pin.svg" width="24" height="24" alt="" />
          </template>
        </mainPlacesItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import mainPlacesItem from './mainPlacesItem/mainPlacesItem.vue';
import { useStoreUser } from '@/stores/user';
import {computed } from 'vue';
interface mainPlacesProps {}

defineProps<mainPlacesProps>();

const storeUser = useStoreUser();

const homeAdress = computed(() => storeUser.getAdresses('home'));
const workAdress = computed(() => storeUser.getAdresses('work'));
const additionalAdress = computed(() => storeUser.getAdresses('additional'));

</script>

<style lang="scss" scoped src="./mainPlaces.scss"></style>
