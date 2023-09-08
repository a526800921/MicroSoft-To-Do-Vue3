/// <reference types="vite/client" />

import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 缓存
    storages?: Array<keyof StoreState<Store>>
  }
}