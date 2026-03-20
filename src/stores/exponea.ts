import { defineStore } from 'pinia';
import type { ExponeaUserData, TaskInvite, tAchievementItem } from '@/types/general';

// const inv = [
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqo3wnwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqo7wnwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqo6wnwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqow5nwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apq3ownwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_ap2qownwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqow1nwd',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: true,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqownw1d',
//     first_name: 'Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: false,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqown2wd',
//     first_name: '12312 Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'done',
//     claimed: false,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_apqown4wd',
//     first_name: 'sad12312 Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'fail',
//     claimed: false,
//     debug: [false, null],
//   },
//   {
//     sort_index: 0,
//     hard_id: '299695203_ap435qownwd',
//     first_name: 's324s12312 Willldeo',
//     last_name: '',
//     install_date: 1749513600000,
//     state: 'awaiting',
//     claimed: false,
//     debug: [false, null],
//   },
// ];

export const useStoreExponea = defineStore('exponea', {
  state: () => ({
    weblayerId: '688391411ee9172053da4c6e' as string,
    userData: null as null | ExponeaUserData,
    intervalUpdate: null as null | ReturnType<typeof setInterval>,
    intervalCount: 0,
    loadInterval: null as null | ReturnType<typeof setInterval>,
  }),

  getters: {
    isUserDataLoaded(): boolean {
      return this.userData !== null;
    },
    isUserFirstVisit(): boolean {
      return Boolean(this.userData?.first_visit);
    },
    achivementsNew(): tAchievementItem[] {
      if (!this.userData?.achievements || this.userData?.achievements.length === 0) {
        return [];
      }
      return this.userData?.achievements.filter((ach) => ach.active && ach.state === 'waiting');
    },
    // userAchivements(): tAchievementItem[] {
    //   return this.userData?.achievements || [];
    // },
    userAchivements(): tAchievementItem[] {
      const sessionAchiveRaw = sessionStorage.getItem('userAchive');
      const sessionAchive = sessionAchiveRaw ? JSON.parse(sessionAchiveRaw) : {};
      const achievements = this.userData?.achievements || [];

      return achievements.map((ach) => {
        const sessionItem = sessionAchive[ach.type];
        return sessionItem ? sessionItem : ach;
      });
    },
    // claimedInvitesCount(): number {
    //   const invites = inv || [];
    //   return invites.filter((i) => i.claimed).length;
    // },
    userInvites(): TaskInvite[] {
      return this.userData?.user_referrers || [];
    },
    // pendingInvites(): TaskInvite[] {
    //   return this.userInvites.filter((invite) => invite.state === 'awaiting');
    // },
    // doneInvites(): TaskInvite[] {
    //   return this.userInvites.filter((invite) => invite.state === 'done');
    // },
  },

  actions: {
    removeInterval() {
      if (this.intervalUpdate) {
        clearInterval(this.intervalUpdate);
      }
      this.intervalUpdate = null;
      this.intervalCount = 0;
    },
    async triggerLoad() {
      if (this.intervalUpdate) {
        this.removeInterval();
      }

      return new Promise((resolve) => {
        this.intervalCount = 0;

        const checkAndResolve = () => {
          if (!this.intervalUpdate) {
            resolve(true);
          }
        };

        this.intervalUpdate = setInterval(async () => {
          if (!this.intervalUpdate) {
            return;
          }

          // await window.exponea.showWebLayer('67f7b0a41b96488f90a10434');
          await window.exponea.showWebLayer(this.weblayerId);
          this.intervalCount++;

          if (this.intervalCount >= 2) {
            this.removeInterval();
          }

          checkAndResolve();
        }, 1000);

        const observer = () => {
          if (!this.intervalUpdate) {
            resolve(true); // Завершаем промис, если интервал удалён извне
          } else {
            setTimeout(observer, 10); // Проверяем снова через 10 мс
          }
        };
        observer();
      });
      // window.exponea.showWebLayer('679a2c0a50196540305c1dab');
    },
    async triggerLoadOnce() {
      window.exponea.showWebLayer(this.weblayerId);
    },
    startLoadInterval() {
      if (this.loadInterval) {
        clearInterval(this.loadInterval);
      }
      this.loadInterval = setInterval(() => {
        this.triggerLoadOnce();
      }, 15000);
    },
    async sendAction(
      name: string,
      params: Record<string, string | number> = {},
      options: { loadOnce?: boolean; doNotLoad?: boolean } = {}
    ) {
  
      return new Promise((resolve) => {
        window.exponea.track(
          'user_profile',
          { action: name, ...params },
          async () => {
            if (options.doNotLoad) {
              resolve(true);
              return;
            }
            this.startLoadInterval();
            if (options.loadOnce) {
              this.triggerLoadOnce();
            } else {
              await this.triggerLoad();
            }
            resolve(true);
          }
        );
      });
    },
    setUserData(data: ExponeaUserData) {
      
      const firstVisitStorage = localStorage.getItem('firstVisit');

      const customData = {
        ...data,
        // stars: 350,
        // user: {
        //   ...data.user,
        //   level: 2,
        // },
        // coin: 245,
        // first_visit: firstVisitStorage ? false : true,
      };
      localStorage.setItem('firstVisit', String(true));
      if (!this.userData) {
        this.userData = customData;
        this.removeInterval();
        return;
      }
      if (JSON.stringify(customData) === JSON.stringify(this.userData)) {
        return;
      }
      this.removeInterval();
      this.userData = customData;
    },
  },
});
