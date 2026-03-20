/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import en from './src/locales/en.json';

type MessageSchema = typeof en;

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}

declare global {
  // Because this is a `const/let`, typescript will complain if you access it via `globalThis.WAS_LOADED_VIA_INDEX_HTML`,
  // You instead need to remove the `globalThis.` prefix
  /** determine if this was loaded via index.html, or some other npm/script tag function */
  interface Window {
    exponeaLoded: boolean;
    goBackToMain: () => void;
    exponea: {
      showWebLayer: (
        id: string,
        params?: Record<string, any>,
        param3?: boolean,
        callback?: () => void
      ) => void;
      track: (id: string, params?: Record<string, any>, successCallback: () => void) => void;
    };
  }
}

export {};
