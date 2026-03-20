import { defineStore } from 'pinia';
import { useStoreRoot } from './root';
import type { tModalNames } from '@/types/general';
import { useStoreExponea } from './exponea';

interface iModalItem {
  name: tModalNames;
  params?: Record<string, any>;
}

export const useStoreModals = defineStore('modals', {
  state: () => ({
    activeModal: null as null | iModalItem,
    queue: [] as iModalItem[],
  }),

  getters: { },

  actions: {
    openModal(data: iModalItem) {
      // if (this.activeModal?.name === data.name) {
      //   return;
      // }
      if (this.activeModal) {
        this.queue.push(data);
        return;
      }
      const storeRoot = useStoreRoot();
      this.activeModal = {
        name: data.name,
        params: data.params ? data.params : {},
      };
      //if parametr reachedAchive show confetti
      if(data.params?.confetti){
        storeRoot.launchConfetti(() => {});
      }
      storeRoot.toggleScrolling(true);
    },
    // addQueue(data: iModalItem) {
    //   if (this.activeModal?.name === data.name) {
    //     return;
    //   }
    //   this.queue.push(data);
    // },
    closeModals() {
      const storeExponea = useStoreExponea();
      if(this.activeModal?.params?.sendExponiaTrack){
       storeExponea.sendAction('show congratulation', {achievement: this.activeModal?.params?.achivement?.type }, { doNotLoad: true });
      }
      const storeRoot = useStoreRoot();
      this.activeModal = null;
      storeRoot.toggleScrolling(false);
      if (this.queue.length) {
        this.openModal(this.queue.shift());
      }
    },
    executeQueue() {
      if (this.queue.length && this.activeModal === null) {
        this.openModal(this.queue.shift());
      }
    },
  },

});
