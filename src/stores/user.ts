import { defineStore } from 'pinia';
import { useStoreExponea } from './exponea';
import { computed } from 'vue';

export const useStoreUser = defineStore('user', {
  state: () => {
    let sessionAddresses = { home: null, work: null, additional: null };
  try {
    const saved = sessionStorage.getItem('userAdresses');
    if (saved) sessionAddresses = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse userAdresses from sessionStorage:', e);
  }

  return {
    onboardingCounter: 0,
    onboardingFinished: false,
    exponeaStore: useStoreExponea(),
    localAddresses: sessionAddresses // 👈 новое реактивное поле
  };
  },
  getters: {
    userName(state) {
      return  state.exponeaStore.userData?.user.name.trim() || 'Guest';
    },
    userRating(state){
      return state.exponeaStore.userData?.user?.rating || '-'
    },
    userTotalRides(state){
      return state.exponeaStore.userData?.user?.total_rides || '-'
    },
    userReferralPending(state){
      // return state.exponeaStore.userData?.referral?.pending || '-'
        const referrers = state.exponeaStore.userData?.user_referrers || [];
        return referrers.filter(ref => +ref.ride_exists === 0).length;
    },
    userReferralFinished(state){
      // return state.exponeaStore.userData?.referral?.finished || '-'
      const referrers = state.exponeaStore.userData?.user_referrers || [];
        return referrers.filter(ref => +ref.ride_exists === 1).length;
    },
    getRidesMonth(state) {
      return state.exponeaStore.userData?.statistics?.total_month_rides || 0;
    },
     getRidesYourPrise(state) {
      return state.exponeaStore.userData?.statistics?.rides_with_price || 0;
    },
     getPreferedTime(state) {
      return state.exponeaStore.userData?.statistics?.month_preffered_time || null;
    },
    getPreferences(state) {
      return state.exponeaStore.userData?.preferences;
    },
    getPreference: (state) => (key: string) => {
      try {
        let sessionPrefs;
      if(sessionStorage.getItem('userPreferences')){
        sessionPrefs = JSON.parse(sessionStorage.getItem('userPreferences'))
      }else{
        sessionPrefs = state.exponeaStore.userData?.preferences
      }
    
      if (key in sessionPrefs) {
        return sessionPrefs[key];
      }
      } catch (e) {
        console.error('Error parsing session preferences:', e);
      }
      
      return state.exponeaStore.userData?.preferences?.[key] ?? null;
    },
    getAdresses: (state) => (key: string) => {
      return state.localAddresses[key] ?? state.exponeaStore.userData?.addresses?.[key] ?? null;
    },
    getAchivementByType: (state) => (type: string) => {
      const sessionAchiveRaw = sessionStorage.getItem('userAchive');
      const sessionAchive = sessionAchiveRaw ? JSON.parse(sessionAchiveRaw) : {};

      const sessionAch = sessionAchive[type];
      const originalAch = state.exponeaStore.userData?.achievements?.find((ach) => ach.type === type);

      if (sessionAch && originalAch) {
        return { ...originalAch, ...sessionAch };
      }

      if (sessionAch) return sessionAch;

      return originalAch ?? null;
    }
  },
  actions: {
    onboardingCounterIncrement() {
      this.onboardingCounter++;
    },
    setOnboardingFinished(){
      this.onboardingFinished = true;
    },
    setPreference(key: string, value: string) {
      
      if (this.exponeaStore.userData?.preferences) {
          this.exponeaStore.userData.preferences[key] = value;
      } else {
        this.exponeaStore.userData.preferences = { [key]: value };
      }

      // console.log(this.exponeaStore.userData.preferences )
       this.exponeaStore.userData.preferences.preset = 'None';
      const sessionPrefs = JSON.parse(sessionStorage.getItem('userPreferences') || '{}');
      sessionPrefs[key] = value;
      sessionPrefs.preset = 'None';
      sessionStorage.setItem('userPreferences', JSON.stringify(sessionPrefs));
      // return value;
    },
    setAllPreferences(settings: object){
      // if (this.exponeaStore.userData?.preferences) {
      //     this.exponeaStore.userData.preferences = {
      //         ...this.exponeaStore.userData.preferences,
      //         ...settings
      //       };
      //     } else {
      //     }
          this.exponeaStore.userData.preferences = { ...settings };
            //  const sessionPrefs = JSON.parse(sessionStorage.getItem('userPreferences') || '{}');
            // const updatedPrefs = { ...sessionPrefs, ...settings };
            sessionStorage.setItem('userPreferences', JSON.stringify(settings));
    },
    setUserAddress(key: 'home' | 'work' | 'additional', address: string) {
      if (!this.exponeaStore?.userData?.addresses) {
        this.exponeaStore.userData.addresses = { home: 'None', work: 'None', additional: 'None' };
      }
      this.exponeaStore.userData.addresses[key] = address;

      this.localAddresses[key] = address;

      const sessionAdress = JSON.parse(sessionStorage.getItem('userAdresses') || '{}');
      sessionAdress[key] = address;
      sessionStorage.setItem('userAdresses', JSON.stringify(sessionAdress));
    },
    setAchiveToSession(key: string){
       const sessionAchive = JSON.parse(sessionStorage.getItem('userAchive') || '{}');
       sessionAchive[key] = this.exponeaStore?.userData?.achievements?.find((ach) => ach.type === key) || null;
       if(sessionAchive[key]){
        sessionAchive[key].finished = true;
        sessionAchive[key].popup_shown = true;
       }
        sessionStorage.setItem('userAchive', JSON.stringify(sessionAchive));
      }
    },
  persist: {
    pick: ['onboardingCounter', 'onboardingFinished'],
  },
});
