<template>
  <div class="trip-form">
    <h3 class="form-title">{{ $t('trips.addNew') }}</h3>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label>{{ $t('trips.distance') }} (km)</label>
        <div class="input-wrapper">
          <input 
            v-model.number="newTrip.distance" 
            type="number" 
            step="0.1" 
            required 
            class="input-field"
            :class="{ 'input-error': newTrip.distance === 0 }"
            placeholder="0.0"
          />
          <span v-if="newTrip.distance === 0" class="error-tooltip">
            {{ $t('trips.errors') }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <label>{{ $t('trips.cost') }}</label>
        <div class="input-wrapper">
          <input 
            v-model.number="newTrip.cost" 
            type="number" 
            step="0.01" 
            required 
            class="input-field"
            :class="{ 'input-error': newTrip.cost === 0 }"
            placeholder="0.00"
          />
          <span v-if="newTrip.cost === 0" class="error-tooltip">
            {{ $t('trips.errors') }}
          </span>
        </div>
      </div>

      <div class="form-group">
        <label>{{ $t('trips.category') }}</label>
        <select v-model="newTrip.category" class="input-field">
          <option value="personal">{{ $t('trips.cat.personal') }}</option>
          <option value="work">{{ $t('trips.cat.work') }}</option>
          <option value="other">{{ $t('trips.cat.other') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ $t('trips.destination') }}</label>
        <input 
          v-model="newTrip.destination" 
          type="text" 
          required 
          class="input-field"
          :placeholder="$t('trips.destPlaceholder')"
        />
      </div>

      <button type="submit" class="submit-btn">
        {{ $t('trips.add') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import { useTripStore } from '@/stores/tripStore';

const { t } = useI18n();

const store = useTripStore();

const newTrip = reactive({
  distance: 0,
  cost: 0,
  category: 'personal' as const,
  destination: '',
  date: new Date().toISOString()
});

const handleSubmit = () => {
  if (newTrip.distance > 0 && newTrip.cost > 0) {
    store.addTrip({ ...newTrip, date: new Date().toISOString() });
    // Reset form
    newTrip.distance = 0;
    newTrip.cost = 0;
    newTrip.destination = '';
  }
};
</script>

<style scoped lang="scss">
.trip-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #000;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    color: #000;
  }
}

.input-field {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgb(10 8 8 / 5%);
  border-radius: 8px;
  padding: 12px;
  color: #000;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00cc66;
  }

  &.input-error {
    border-color: #ff4d4f;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.error-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
  z-index: 10;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 10px;
    border: 5px solid transparent;
    border-bottom-color: #ff4d4f;
  }
}

select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.submit-btn {
  background: #00cc66;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 8px;

  &:active {
    opacity: 0.8;
  }
}
</style>