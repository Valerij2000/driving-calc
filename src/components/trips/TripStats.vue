<template>
  <div class="trip-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">{{ $t('trips.totalDistance') }}</span>
        <span class="stat-value">{{ store.totalDistance.toFixed(1) }} km</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ $t('trips.totalCost') }}</span>
        <span class="stat-value">${{ store.totalCost.toFixed(2) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ $t('trips.avgCost') }}</span>
        <span class="stat-value">${{ store.averageCostPerKm.toFixed(2) }}/km</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ $t('trips.count') }}</span>
        <span class="stat-value">{{ store.totalTrips }}</span>
      </div>
    </div>

    <div class="actions-row">
      <button @click="exportToCSV" class="export-btn">
        {{ $t('trips.exportCSV') }}
      </button>
    </div>

    <div class="trip-list">
      <h3 class="list-title">{{ $t('trips.recentHistory') }}</h3>
      <div v-for="trip in sortedTrips" :key="trip.id" class="trip-item">
        <div class="trip-info">
          <div class="trip-main">
            <span class="trip-dest">{{ trip.destination }}</span>
            <span class="trip-cat" :class="trip.category">{{ $t(`trips.cat.${trip.category}`) }}</span>
          </div>
          <div class="trip-sub">
            <span>{{ formatDate(trip.date) }}</span>
            <span>{{ trip.distance }} km • ${{ trip.cost }}</span>
          </div>
        </div>
        <button @click="store.removeTrip(trip.id)" class="delete-btn">×</button>
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

const sortedTrips = computed(() => {
  return [...store.trips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const exportToCSV = () => {
  const headers = ['Date', 'Distance', 'Cost', 'Category', 'Destination'];
  const rows = store.trips.map(t => [
    new Date(t.date).toLocaleString(), 
    t.distance, 
    t.cost, 
    t.category, 
    t.destination
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `trips_report_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
</script>

<style scoped lang="scss">
.trip-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgb(10 8 8 / 5%);
  display: flex;
  flex-direction: column;
  gap: 4px;

  .stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #000;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #00cc66;
  }
}

.actions-row {
  display: flex;
  justify-content: flex-end;
}

.export-btn {
  background: transparent;
  border: 1px solid #00cc66;
  color: #00cc66;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    background: rgba(0, 204, 102, 0.1);
  }
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #000;
}

.trip-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(10 8 8 / 5%);

  .trip-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .trip-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .trip-dest {
    font-weight: 500;
    color: #000;
  }

  .trip-cat {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 700;

    &.personal { background: rgba(52, 152, 219, 0.2); color: #3498db; }
    &.work { background: rgba(155, 89, 182, 0.2); color: #9b59b6; }
    &.other { background: rgba(149, 165, 166, 0.2); color: #95a5a6; }
  }

  .trip-sub {
    font-size: 12px;
    color: #000;
    display: flex;
    gap: 8px;
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: rgba(28, 26, 26, 0.3);
    font-size: 24px;
    padding: 0 8px;
    cursor: pointer;
    line-height: 1;

    &:hover {
      color: #ff4d4d;
    }
  }
}
</style>