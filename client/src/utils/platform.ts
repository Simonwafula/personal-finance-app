/**
 * Platform Detection Utility
 *
 * Provides cross-platform detection for web and mobile (Capacitor) environments.
 * Gracefully handles cases where Capacitor is not installed (web-only builds).
 *
 * Usage:
 * ```typescript
 * import Platform from '@/utils/platform';
 *
 * if (Platform.isMobile()) {
 *   // Mobile-specific code
 * }
 *
 * if (Platform.canReadSms()) {
 *   // SMS detection feature
 * }
 * ```
 */

// Safely import Capacitor (may not be installed in web-only builds)
let Capacitor: any;
try {
  // Dynamic import to prevent build errors when @capacitor/core is not installed
  const capacitorModule = require('@capacitor/core');
  Capacitor = capacitorModule.Capacitor;
} catch (error) {
  // Capacitor not installed - create mock for web environment
  Capacitor = {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
    isPluginAvailable: () => false,
  };
}

/**
 * Platform detection singleton
 */
export const Platform = {
  /**
   * Check if running on a native mobile platform (iOS or Android)
   * @returns true if running in Capacitor native app, false if web
   */
  isMobile: (): boolean => {
    try {
      return Capacitor.isNativePlatform();
    } catch {
      return false;
    }
  },

  /**
   * Check if running in a web browser
   * @returns true if running in browser, false if native app
   */
  isWeb: (): boolean => {
    try {
      return !Capacitor.isNativePlatform();
    } catch {
      return true; // Fallback to web if Capacitor errors
    }
  },

  /**
   * Check if running on Android platform
   * @returns true if Android native app
   */
  isAndroid: (): boolean => {
    try {
      return Capacitor.getPlatform() === 'android';
    } catch {
      return false;
    }
  },

  /**
   * Check if running on iOS platform
   * @returns true if iOS native app
   */
  isIOS: (): boolean => {
    try {
      return Capacitor.getPlatform() === 'ios';
    } catch {
      return false;
    }
  },

  /**
   * Get the current platform name
   * @returns 'web', 'android', or 'ios'
   */
  getPlatform: (): 'web' | 'android' | 'ios' => {
    try {
      const platform = Capacitor.getPlatform();
      if (platform === 'android' || platform === 'ios') {
        return platform;
      }
      return 'web';
    } catch {
      return 'web';
    }
  },

  /**
   * Check if SMS reading capability is available
   * SMS reading is only available on Android native platform
   * @returns true if SMS can be read (Android only)
   */
  canReadSms: (): boolean => {
    return Platform.isAndroid();
  },

  /**
   * Check if push notifications are available
   * @returns true if on mobile platform
   */
  canUsePushNotifications: (): boolean => {
    return Platform.isMobile();
  },

  /**
   * Check if biometric authentication is available
   * @returns true if on mobile platform
   */
  canUseBiometrics: (): boolean => {
    return Platform.isMobile();
  },

  /**
   * Check if native share API is available
   * @returns true if Web Share API or native share is available
   */
  canShare: (): boolean => {
    if (Platform.isMobile()) {
      return true; // Native apps can always share
    }
    // Web: Check if Web Share API is supported
    return typeof navigator !== 'undefined' && 'share' in navigator;
  },

  /**
   * Check if camera access is available
   * @returns true if camera can be accessed
   */
  canUseCamera: (): boolean => {
    if (Platform.isMobile()) {
      return true; // Native apps can access camera
    }
    // Web: Check if MediaDevices API is available
    return typeof navigator !== 'undefined' && 'mediaDevices' in navigator;
  },

  /**
   * Check if a specific Capacitor plugin is available
   * @param pluginName Name of the plugin to check
   * @returns true if plugin is available
   */
  isPluginAvailable: (pluginName: string): boolean => {
    try {
      return Capacitor.isPluginAvailable(pluginName);
    } catch {
      return false;
    }
  },

  /**
   * Get app identifier
   * Useful for analytics and tracking
   * @returns Platform identifier string
   */
  getAppId: (): string => {
    return Platform.getPlatform();
  },

  /**
   * Check if running in development mode
   * @returns true if in development
   */
  isDevelopment: (): boolean => {
    return import.meta.env.DEV;
  },

  /**
   * Check if running in production mode
   * @returns true if in production
   */
  isProduction: (): boolean => {
    return import.meta.env.PROD;
  },

  /**
   * Get environment platform setting
   * Reads from VITE_PLATFORM environment variable
   * @returns 'web' or 'mobile'
   */
  getEnvironmentPlatform: (): 'web' | 'mobile' => {
    const envPlatform = import.meta.env.VITE_PLATFORM;
    return envPlatform === 'mobile' ? 'mobile' : 'web';
  },
};

// Default export
export default Platform;

/**
 * Type guard for mobile-specific code
 * @example
 * ```typescript
 * if (isMobilePlatform()) {
 *   // TypeScript knows we're on mobile here
 *   const smsData = await readSms();
 * }
 * ```
 */
export const isMobilePlatform = (): boolean => Platform.isMobile();

/**
 * Type guard for web-specific code
 */
export const isWebPlatform = (): boolean => Platform.isWeb();

/**
 * Platform-specific feature flags
 * Automatically enabled/disabled based on platform capabilities
 */
export const PLATFORM_FEATURES = {
  SMS_DETECTION: Platform.canReadSms(),
  PUSH_NOTIFICATIONS: Platform.canUsePushNotifications(),
  BIOMETRIC_AUTH: Platform.canUseBiometrics(),
  NATIVE_SHARE: Platform.canShare(),
  CAMERA_ACCESS: Platform.canUseCamera(),
  OFFLINE_STORAGE: true, // Available on all platforms (localStorage/IndexedDB)
  CSV_EXPORT: true, // Available on all platforms
  PDF_REPORTS: true, // Available on all platforms
  GOOGLE_OAUTH: true, // Available on all platforms
} as const;

/**
 * Helper to conditionally execute platform-specific code
 * @example
 * ```typescript
 * runOnMobile(() => {
 *   console.log('This runs only on mobile');
 * });
 * ```
 */
export const runOnMobile = (callback: () => void): void => {
  if (Platform.isMobile()) {
    callback();
  }
};

/**
 * Helper to conditionally execute web-specific code
 */
export const runOnWeb = (callback: () => void): void => {
  if (Platform.isWeb()) {
    callback();
  }
};

/**
 * Get platform-specific API base URL
 * Mobile apps use production URL, web uses environment variable
 */
export const getApiBaseUrl = (): string => {
  // Check environment variable first
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // Fallback: Mobile uses production, web uses relative
  if (Platform.isMobile()) {
    return 'https://finance.mstatilitechnologies.com';
  }

  return ''; // Web: Use relative URLs (proxied by Vite dev server)
};

/**
 * Platform information object
 * Useful for debugging and analytics
 */
export const getPlatformInfo = () => ({
  platform: Platform.getPlatform(),
  isMobile: Platform.isMobile(),
  isWeb: Platform.isWeb(),
  isAndroid: Platform.isAndroid(),
  isIOS: Platform.isIOS(),
  canReadSms: Platform.canReadSms(),
  isDevelopment: Platform.isDevelopment(),
  isProduction: Platform.isProduction(),
  features: PLATFORM_FEATURES,
  apiBaseUrl: getApiBaseUrl(),
});
