

<template>
  <div class="trips-view">
    <div class="container">
      <header class="view-header">
        <h1>
          <img src="/images/preferences/ico_drive.svg" alt="" />
          {{ $t('trips.title') }}
        </h1>
        <!-- <button class="back-btn" @click="goBack">← {{ $t('general.back') }}</button> -->
      </header>

      <TripChart />
      
      <div class="view-content">
        <TripForm />
        <TripStats />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TripForm from '@/components/trips/TripForm.vue';
import TripStats from '@/components/trips/TripStats.vue';
import TripChart from '@/components/trips/TripChart.vue';
import { useStoreRoot } from '@/stores/root';

const storeRoot = useStoreRoot();

const { t } = useI18n();

const goBack = () => {
  storeRoot.setCurrentPage('home');
};
</script>

<style scoped lang="scss">
.trips-view {
  min-height: 100vh;
  color: #fff;
  padding: 20px;
  padding-bottom: 100px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 20px;
  background: #FFF;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
  }
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>