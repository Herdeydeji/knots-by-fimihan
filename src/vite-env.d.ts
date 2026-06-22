/// <reference types="vite/client" />

declare module '*.jsx' {
  const component: any
  export default component
}

interface OneSignalSDK {
  init: (config: { appId: string; serviceWorkerPath?: string }) => Promise<void>
  login: (userId: string) => void
  logout: () => void
  Notifications: {
    requestPermission: () => Promise<boolean>
    optOut: () => Promise<void>
    addEventListener: (event: string, handler: (event: any) => void) => void
    removeEventListener: (event: string, handler: (event: any) => void) => void
  }
  User: {
    PushSubscription: {
      id?: string
    }
  }
}

interface Window {
  OneSignalDeferred: ((OneSignal: OneSignalSDK) => void)[]
}
