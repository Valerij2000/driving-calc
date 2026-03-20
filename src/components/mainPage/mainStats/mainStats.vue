<template>
  <div class="main-stats">
    <div class="main-stats-holder">
      <p class="title">{{ $t('mainStats.title') }}</p>
      <ul>
        <li>
          <img src="/images/icons/ico_star_stat.svg" alt="" />
          <div class="main-stats-item-title">
            <span class="list-title">{{ $t('mainStats.totalRides') }}:</span>
            <span class="list-text">{{ ridesRangeText }}</span>
          </div>
          <span class="list-value">
          {{ storeUser.getRidesMonth }} {{ $t('mainStats.rides', storeUser.getRidesMonth) }}
          </span>
        </li>
        <li>
          <img src="/images/icons/ico_star_stat.svg" alt="" />
          <div class="main-stats-item-title">
            <span class="list-title">{{ $t('mainStats.ridesPrise') }}:</span>
            <span class="list-text">{{ longestRideRangeText }}</span>
          </div>
          <span class="list-value">
             {{ storeUser.getRidesYourPrise }} {{ $t('mainStats.rides', storeUser.getRidesYourPrise) }}
          </span>
        </li>
        <li>
          <img src="/images/icons/ico_star_stat.svg" alt="" />
          <div class="main-stats-item-title">
            <span class="list-title">{{ $t('mainStats.preferedTime') }}:</span>
            <span class="list-text">{{ preferedTimeRangeText[0] }}</span>
          </div>
          <span class="list-value" v-if="preferedTimeRangeText[1]">
             {{ preferedTimeRangeText[1] }}
          </span>
        </li>
      </ul>
      <button class="preset-btn" @click="navigateToTrips">
        {{ $t('mainStats.viewTrips') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useStoreUser } from '@/stores/user';
import { useStoreRoot } from '@/stores/root';
import { computed } from 'vue';


const { t } = useI18n();
const storeUser = useStoreUser();
const storeRoot = useStoreRoot();

const ridesRangeText = computed(() => {
  const count = storeUser.getRidesMonth;
  if (count === 0) return t('mainStats.ridesRanges.range0')
  if (count >= 1 && count <= 5) return t('mainStats.ridesRanges.range1');
  if (count >= 6 && count <= 15) return t('mainStats.ridesRanges.range2');
  if (count >= 16 && count <= 30) return t('mainStats.ridesRanges.range3');
  if (count >= 31 && count <= 50) return t('mainStats.ridesRanges.range4');
  if (count > 50) return t('mainStats.ridesRanges.range5');
  return '';
});


const longestRideRangeText = computed(() => {
  const count = storeUser.getRidesYourPrise;
   if (count === 0) return t('mainStats.ridesRangesPrice.range0')
  if (count >= 1 && count <= 3) return t('mainStats.ridesRangesPrice.range1');
  if (count >= 4 && count <= 10) return t('mainStats.ridesRangesPrice.range2');
  if (count >= 11 && count <= 20) return t('mainStats.ridesRangesPrice.range3');
  if (count > 20) return t('mainStats.ridesRangesPrice.range4');
  return '';
});

const preferedTimeRangeText = computed(() => {
  const hour = storeUser.getPreferedTime;
  if (hour == null) {
    return [t('mainStats.ridesPrefTime.empty'), null];
  }
  if (hour >= 5 && hour < 12) return [t('mainStats.ridesPrefTime.morningText'), t('mainStats.ridesPrefTime.morning')];
  if (hour >= 12 && hour < 17) return [t('mainStats.ridesPrefTime.afternoonText'), t('mainStats.ridesPrefTime.afternoon')];
  if (hour >= 17 && hour < 23) return [t('mainStats.ridesPrefTime.eveningText'), t('mainStats.ridesPrefTime.evening')];
  return [t('mainStats.ridesPrefTime.nightText'), t('mainStats.ridesPrefTime.night')];
});

const navigateToTrips = () => {
  storeRoot.setCurrentPage('trips');
};

</script>

<style lang="scss" scoped src="./mainStats.scss"></style>
