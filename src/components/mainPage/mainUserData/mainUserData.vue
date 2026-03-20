<template>
  <div class="main-user-data">
    <div class="main-user-data-holder">
      <p class="main-user-data-name">{{ storeUser.userName }}</p>
      <p class="main-user-data-rating">
        <span>{{storeUser.userRating}}</span>
        <img src="/images/icons/ico_star_rating.svg" width="16" height="17" alt="★" />
      </p>
      <p class="main-user-data-rides">{{ $t('mainData.ridesInfo') }}: {{storeUser.userTotalRides}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStoreUser } from '@/stores/user';

const storeUser = useStoreUser();
</script>

<style lang="scss" scoped src="./mainUserData.scss"></style>
