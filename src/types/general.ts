export type tModalNames =
  | 'addPlaceModal'
  | 'addressRemovedModal'
  | 'aboutAchivementModal'
  | 'finishOnboardingModal'
  | 'addressAddModal'
  | 'modalOnboarding'
  | 'modalDiscount';

export type TaskState = 'waiting' | 'active' | 'done' | 'claimed';

export interface TaskInvite {
  ride_exists: string;
  name: string;
  hard_id: string;
  install_date: number;
}

type tUser = {
  first_name: string;
  last_name: string;
  rating: string;
  total_rides: string;
};

type tReferal = {
  pending: number;
  finished: number;
};

type tPreferences = {
  music: 'None' | 'Drivers Music' | 'Own Music' | 'Silence',
  communication: 'None' | 'Talkative' | 'Silence',
  contact: 'None' | 'Call Me' | 'No Calls' | 'Messages',
  driving: 'None' | 'Careful' | 'Fast',
}

type tAdresses = {
  home: string,
  work: string,
  additional: string
}

type tRides = {
  total_rides: number;
  unique_destinations: number;
  total_ride_time: number;
};

type tStatistics = {
  total_month_rides: number;
  rides_with_price: number;
  month_preffered_time: number;
};

export type tAchievementItem = {
  type: string;
  finished: boolean;
  popup_shown: boolean;
  temporar: boolean;
  progress?: [number, number];
};
export type tDiscount = {
  discount_datetime: number;
  has_discount: boolean;
  has_popup: boolean;
};

export type tUserReffers = {
  hard_id: string;
  name: string;
  install_date: number;
  ride_exists: "1" | "0";
};

export type ExponeaUserData = {
  user: tUser;
  referral: tReferal;
  preferences: tPreferences[];
  addresses: tAdresses[];
  statistics: tStatistics[];
  date: number;
  discount: tDiscount;
  lp: number;
  stars: number;
  first_visit: boolean;
  rides: tRides;
  achievements: tAchievementItem[];
  user_referrers: tUserReffers[];
};

export type tLangs = 'en' | 'es';

export type tPages = 'home' | 'invites' | 'trips';