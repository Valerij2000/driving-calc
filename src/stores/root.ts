import { defineStore } from 'pinia';
// import { useI18n } from 'vue-i18n';
// import { useStoreExponea } from './exponea';
import type { tLangs, tPages } from '@/types/general';
import { randomInRange } from '@/utils/confetti';

// interface PreferencesState {
//   [key: string]: number;
// }

export const useStoreRoot = defineStore('root', {
  state: () => ({
    confettiInstance: null,
    stopScrolling: false,
    // odometrInstance: null,
    refLink: null,
    // refLink: 'https://indrive27383hji.com',
    initLinkRequest: false,
    // locale: 'en' as tLangs,
    currentPage: 'home' as tPages,
    backToPage: '' as tPages | '',
    startOnboarding: false,
    isAchievementsImagesLoaded: false,
    // preferences: {
    //   music: 0,
    //   communication: 0,
    //   contact: 0,
    //   drive: 0,
    // } as PreferencesState,
    closeOnboardingModal: false
  }),
  getters: {
    // activeLocale(): tLangs {
    //   return this.locale;
    // },
    //  getPreference: (state) => (key: string) => {
    //   return state.preferences[key] ?? null;
    // },
  },
  actions: {
    async initConfetti(canvas: HTMLCanvasElement) {
      if (!this.confettiInstance && canvas) {
        this.confettiInstance = await (window as any).confetti.create(canvas, { resize: true });
      }
    },
    launchConfetti(callback: () => void) {
      if (this.confettiInstance) {
        const duration = 1.5 * 1000,
          animationEnd = Date.now() + duration,
          defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            callback();
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          // since particles fall down, start a bit higher than random
           this.confettiInstance(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              })
            );
            this.confettiInstance(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              })
            );
          
        }, 250);
      }
    },
    toggleScrolling(value: boolean) {
      this.stopScrolling = value;
    },
    // initOdometr(el: HTMLElement, value: number) {
    //   this.odometrInstance = new window.Odometer({
    //     el,
    //     value,
    //     format: '',
    //     theme: 'minimal',
    //   });
    // },
    // updateOdometr(value: number, options: { instant?: boolean } = {}) {
    //   if (options.instant) {
    //     this.odometrInstance.value = value;
    //     return;
    //   }
    //   this.odometrInstance?.update(value);
    // },
    // setLocale(value: tLangs) {
    //   this.locale = value;
    // },
    setRefLink(value: string) {
      localStorage.setItem('refLink', value);
      this.refLink = value;
    },
    setLinkRequestStatus(value: boolean) {
      this.initLinkRequest = value;
    },
    setCurrentPage(value: tPages, backTo?: tPages) {
      this.currentPage = value;
      this.backToPage = backTo || '';
    },
    setStartOnboarding(value: boolean) {
      this.startOnboarding = value;
    },
    setAchievementsImagesLoaded(val: boolean) {
      this.isAchievementsImagesLoaded = val
    },
    setCloseOnboardingModal(val: boolean){
      this.closeOnboardingModal = val
    }
  },
});
