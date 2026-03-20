<template>
  <div class="main-preferences">
    <div id="onboarding-step1" class="main-preferences-holder">
      <div class="main-preferences-header">
        <p class="main-preferences-title">{{ $t('preferences.title') }}</p>
        <!-- <button class="btn-reset btn-info">
          <img src="/images/icons/ico_info.svg" alt="i" />
        </button> -->
        <p class="info-text">{{ $t('preferences.tooltip') }}</p>
      </div>
      <div class="banner-discount-wrapper" v-if="showDiscountBanner">
        <div class="banner-discount" v-if="showDiscountBannerMain">
          <p class="banner-discount-text">
            {{ $t('preferences.discountTextStart') }}
          </p>
        </div>
        <div class="banner-discount banner-discount-recieved" v-else>
          <p class="banner-discount-text">
            {{ $t('preferences.discountTextRecieved') }}
          </p>
        </div>
      </div>
      <div class="preferences-preset" id="onboarding-step2">
        <p class="preferences-preset-header">
          {{ $t('preferences.presetsTitle') }}
        </p>
        <div class="preset-container">
            <button
              v-for="preset in presets"
              :key="preset.value"
              class="preset-btn"
              :class="{ 'active-preset': selectedPreset === preset.value }"
              :value="preset.value"
              @click="choosePreset(getPresetByValue(presets, preset.value))"
            >
              {{ preset.label }}
            </button>
        </div>
      </div>
      <div  class="main-preferences-list">
        <MainPreferencesItem
          v-model="musicPreference"
          :title="$t('preferences.musicTitle')"
          :options="selectOptions.music"
          item-id="music"
        >
          <template #icon>
            <img src="/images/preferences/ico_music.svg" alt="" />
          </template>
        </MainPreferencesItem>
        <MainPreferencesItem
          v-model="communicationPreference"
          :title="$t('preferences.communicationTitle')"
          item-id="communication"
          :options="selectOptions.communication"
        >
          <template #icon>
            <img src="/images/preferences/ico_chat.svg" alt="" />
          </template>
        </MainPreferencesItem>
        <!-- <MainPreferencesItem
          v-model="contactPreference"
          :title="$t('preferences.contactTitle')"
          item-id="contact"
          :options="selectOptions.contact"
        >
          <template #icon>
            <img src="/images/preferences/ico_contact.svg" width="24" height="24" alt="" />
          </template>
        </MainPreferencesItem> -->
        <MainPreferencesItem
          v-model="drivePreference"
          :title="$t('preferences.drivingTitle')"
          item-id="driving"
           :options="selectOptions.driving"
        >
          <template #icon>
            <img src="/images/preferences/ico_drive.svg" alt="" />
          </template>
        </MainPreferencesItem>
      </div>

      <div class="main-preferences-attention-block">
        <img src="/images/icons/ico_attention.svg" width="24" height="24" alt="!" />
        <p>{{ $t('preferences.disclamer') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import MainPreferencesItem from './mainPreferencesItem/mainPreferencesItem.vue';
// import { useStoreRoot } from '@/stores/root';
import { useI18n } from 'vue-i18n';
import { useStoreUser } from '@/stores/user';
import { useStoreExponea } from '@/stores/exponea';
import { useStoreModals } from '@/stores/modals';

const storeModals = useStoreModals();
const storeExponea = useStoreExponea();
const storeUser = useStoreUser();
const { t } = useI18n();
const musicPreference = usePreference('music');



const communicationPreference = usePreference('communication');
const contactPreference = usePreference('contact');
const drivePreference = usePreference('driving');

const presets =  computed(() => [
  {
    value: 'Introvert',
    label: t('preferences.presetsIntrovert'),
    config: { music: "Silence", communication: "Silence", driving: "Careful", preset: "Introvert" }
  },
  {
    value: 'Extrovert',
    label: t('preferences.presetsExtrovert'),
    config: { music: "Drivers Music", communication: "Talkative", driving: "Fast",  preset: "Extrovert" }
  },
  {
    value: 'Music lover',
    label: t('preferences.presetsMusicLover'),
    config: { music: "Drivers Music", communication: "Silence", driving: "Careful", preset: "Music lover" }
  }
]);
const showDiscountBannerTrigger = ref(false); 

const showDiscountBanner = computed(() => {
  const hasDiscount = storeExponea?.userData?.discount?.has_discount;
  const discountDatetime = storeExponea?.userData?.discount?.discount_datetime;
  
  if (hasDiscount) {
    return true;
  }
  
  if (discountDatetime) {
    const discountDate = new Date(discountDatetime);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - discountDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24); // разница в днях
    
    return daysDiff <= 3; 
  }
  
  return false;
});

const showDiscountBannerMain = computed(() => {
  // return !storeExponea?.userData?.discount?.has_popup || !sessionStorage.getItem('modalDiscountSubmitted');
  return !storeExponea?.userData?.discount?.has_popup && !showDiscountBannerTrigger.value;
});


const selectOptions = computed(() => ({
  music: [
    {
      value: 'Drivers Music',
      title: t('preferences.musicList.2'),
    },
    // {
      //   value: 'Own Music',
      //   title: t('preferences.musicList.3'),
      // },
      {
        value: 'Silence',
        title: t('preferences.musicList.3'),
      },
      {
        value: 'None',
        title: t('preferences.musicList.1'),
      },
  ],
  communication: [
    {
     value: 'Talkative',
      title: t('preferences.communicationList.2'),
    },
    {
     value: 'Silence',
      title: t('preferences.communicationList.3'),
    },
    {
      value: 'None',
      title: t('preferences.communicationList.1'),
    },
  ],
  contact: [
    {
     value: 'Call Me',
      title: t('preferences.contactList.2'),
    },
    {
     value: 'No Calls',
      title: t('preferences.contactList.3'),
    },
    {
     value: 'Messages',
      title: t('preferences.contactList.4'),
    },
     {
      value: 'None',
      title: t('preferences.contactList.1'),
    },
  ],
  driving: [
    {
     value: 'Careful',
      title: t('preferences.drivingList.2'),
    },
    {
     value: 'Fast',
      title: t('preferences.drivingList.3'),
    },
    {
      value: 'None',
      title: t('preferences.drivingList.1'),
    },
  ]
}))

const selectedPreset = ref();
function getPresetByValue(presets, value) {
  return presets.find(preset => preset.value === value);
}
const sendTimeout = ref(null);
const updatingFromPreset = ref(false); 


async function choosePreset(value){
  showDiscountBannerTrigger.value = true;
  if(!storeExponea?.userData?.discount.has_popup && !sessionStorage.getItem('modalDiscountSubmitted') && storeExponea?.userData?.discount.has_discount){
    sessionStorage.setItem('modalDiscountSubmitted', JSON.stringify(true));
      storeModals.openModal({ name: 'modalDiscount', params: {confetti: true, notransition: true} });
  }

    let preset = value;
    selectedPreset.value = preset.value;
    updatingFromPreset.value = true;

    musicPreference.value = preset.config.music;
    communicationPreference.value = preset.config.communication;
    drivePreference.value = preset.config.driving;
    storeUser.setAllPreferences(preset.config);
    await nextTick();
  
  // Разблокируем watch
  updatingFromPreset.value = false;
    if (sendTimeout.value) {
      clearTimeout(sendTimeout.value);
    }

    // Устанавливаем новый таймаут
    sendTimeout.value = setTimeout(() => {
      storeExponea.sendAction('update preferences', preset.config, { doNotLoad: true });
      // storeExponea.sendAction('update preferences', preset.config, { doNotLoad: true });
      sendTimeout.value = null;
    }, 2000);
}
interface mainPreferencesProps {}
defineProps<mainPreferencesProps>();


const allPreferencesFilled = computed(() => {
  const preferences = storeExponea.userData?.preferences || {};
  const fieldsToCheck = ['music', 'communication', 'driving'];
  return fieldsToCheck.every(field => 
    preferences[field] && preferences[field] !== 'None'
  );
});

function usePreference(key: string) {
 const val = ref(storeUser.getPreference(key));

  watch(val, async (newVal) => {
     if (!updatingFromPreset.value) {
      storeUser.setPreference(key, newVal);
      
      // Ждем обновления реактивной системы
      await nextTick();
      if(allPreferencesFilled.value){
        console.log('Current state:', allPreferencesFilled.value);
        if(!storeExponea?.userData?.discount.has_popup && !sessionStorage.getItem('modalDiscountSubmitted') && storeExponea?.userData?.discount.has_discount){
          showDiscountBannerTrigger.value = true;
          sessionStorage.setItem('modalDiscountSubmitted', JSON.stringify(true));
            storeModals.openModal({ name: 'modalDiscount', params: {confetti: true, notransition: true} });
        }
      }
    }
  });
  // if (val == null){

  // }
  return val || "None";
}

watch(
  () => storeExponea.userData?.preferences?.preset,
  (newPreset) => {
    if (newPreset) {
      selectedPreset.value = newPreset;
    }
  }
);

//  function useI18nOptions(i18nKey: string) {
//   const { tm } = useI18n();
//   return computed(() => {
//     const list = tm(i18nKey) as Record<string, string>;

//     return Object.keys(list)
//       .map(key => ({
//         title: list[key]
//       }));
//   });
// }

// const musicOptions = useI18nOptions('preferences.musicList');
// const communicationOptions = useI18nOptions('preferences.communicationList');
// const contactOptions = useI18nOptions('preferences.contactList');
// const drivingOptions = useI18nOptions('preferences.drivingList');




onMounted(() => {
  selectedPreset.value = storeExponea.userData?.preferences.preset
})
</script>

<style lang="scss" scoped src="./mainPreferences.scss"></style>
