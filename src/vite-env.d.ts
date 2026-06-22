/// <reference types="vite/client" />

declare module '*.jsx' {
  const component: any
  export default component
}

interface OneSignalSDK {
  init: (config: { appId: string; serviceWorkerPath?: string }) => Promise<void>
  Notifications: {
    requestPermission: () => Promise<boolean>
    optOut: () => Promise<void>
    addListenerForClick?: (handler: (event: any) => void) => void
  }
  User: {
    setExternalUserId: (userId: string) => Promise<void>
    removeExternalUserId: () => Promise<void>
    pushSubscription: {
      optOut: () => Promise<void>
      id?: string
    }
  }
}

interface Window {
  OneSignalDeferred: ((OneSignal: OneSignalSDK) => void)[]
}
