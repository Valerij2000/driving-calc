<template>
  <div class="main-preferences-item">
    <div class="main-preferences-item-icon" @click="isOpen = !isOpen">
      <slot name="icon" />
    </div>
    <div class="main-preferences-item-content">
      <p class="main-preferences-item-heading" @click="isOpen = !isOpen">
        {{ title }}
      </p>
      <p v-if="!isOpen" class="main-preferences-item-value" @click="isOpen = !isOpen">
        {{ selectedOption?.title || $t('preferences.communicationList.1') }}
      </p>
      <ul v-if="isOpen" class="main-preferences-item-list-options">
        <li
          v-for="(opt, index) in options"
          :key="index"
          :class="{ active: opt.value === modelValue, last: opt.value === 'None' }"
          class="main-preferences-item-option"
          @click="handleOptionClick(opt)"
        >
          <span class="main-preferences-item-title">{{ opt.title }}</span>
          <div class="main-preferences-item-checkbox">
            <span />
          </div>
        </li>
      </ul>
    </div>
    <button class="btn-reset" :class="{ 'btn-toggle': isOpen }" @click="isOpen = !isOpen">
      <img src="/images/icons/ico_arrow_right.svg" width="24" height="24" alt="Toggle" />
    </button>
  </div>
</template>

<script lang="ts" setup>
// import { useStoreRoot } from '@/stores/root';
import { computed, onMounted, ref, watch } from 'vue';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreRoot } from '@/stores/root';
import { useStoreUser } from '@/stores/user';
// const storeRoot = useStoreRoot();
const storeUser = useStoreUser();
interface OptionItem {
  value: string;
  title: string;
}

interface mainPreferencesItemProps {
  title: string;
  itemId: string;
  modelValue: string;
  options: OptionItem[];
}

const storeExponea = useStoreExponea();
const storeRoot = useStoreRoot();

const props = defineProps<mainPreferencesItemProps>();

const selectedOption = computed(() => {
  // props.options.find(opt => opt.value === props.modelValue)
  // props.options[props.modelValue]
  // const storedValue = storeUser.getPreference(props.itemId);
  // emit('update:modelValue', storedValue)
  return props.options.find((opt) => opt.value === props.modelValue);
});
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

watch(
  () => storeRoot.startOnboarding,
  (val) => {
    if (val) {
      isOpen.value = false;
    }
  }
);
function handleOptionClick(opt) {
  storeExponea.sendAction(
    'update preferences',
    {
      [props.itemId]: opt?.value,
      preset: "None"
    },
    { doNotLoad: true }
  );
  emit('update:modelValue', opt?.value);
}
onMounted(() => {
  // set default setting radiobutton
  // const storedValue = storeRoot.preferences?.[props.itemId];
  //  console.log(props.modelValue);
  const storedValue = storeUser.getPreference(props.itemId);
  // console.log('TEST', props.modelValue);
  storedValue ? emit('update:modelValue', storedValue) : emit('update:modelValue', 'None');
});

const isOpen = ref(false);
</script>

<style lang="scss" scoped src="./mainPreferencesItem.scss"></style>
