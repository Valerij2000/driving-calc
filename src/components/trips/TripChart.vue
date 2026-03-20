<template>
  <div class="trip-chart">
    <h3 class="chart-title">
      <img src="/images/icons/ico_star_stat.svg" alt="" />
      {{ $t('trips.activity') }}
    </h3>
    <div class="chart-container">
      <svg viewBox="0 0 400 150" class="graph">
        <line x1="20" y1="130" x2="380" y2="130" stroke="#333" stroke-width="1" />
        
        <polyline
          fill="none"
          stroke="#00cc66"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          :points="points"
        />
        
        <circle 
          v-for="(p, i) in chartPoints" 
          :key="i"
          :cx="p.x" :cy="p.y" r="4" 
          fill="#00cc66"
          class="point"
        >
          <title>{{ p.date }}: {{ p.distance }} km</title>
        </circle>
      </svg>
      <div class="labels">
        <span v-for="d in days" :key="d">{{ formatDate(d) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useTripStore } from '@/stores/tripStore';

const { t } = useI18n();

const store = useTripStore();
const days = computed(() => store.chartData.map(d => d.date));

const chartPoints = computed(() => {
  const data = store.chartData;
  const maxDistance = Math.max(...data.map(d => d.distance), 1);
  
  return data.map((d, i) => ({
    x: (i * 55) + 35,
    y: 130 - (d.distance / maxDistance * 100),
    distance: d.distance,
    date: d.date
  }));
});

const points = computed(() => chartPoints.value.map(p => `${p.x},${p.y}`).join(' '));

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};
</script>

<style scoped lang="scss">
.trip-chart {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #000;
}

.chart-container {
  position: relative;
}

.graph {
  width: 100%;
  height: auto;
  overflow: visible;
}

.point {
  transition: r 0.2s ease;
  cursor: pointer;
  &:hover {
    r: 6;
  }
}

.labels {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
  
  span {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    transform: rotate(-45deg);
    white-space: nowrap;
    color: #000;
  }
}
</style>