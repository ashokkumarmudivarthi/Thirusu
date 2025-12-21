import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thirusu.juiceshop',
  appName: 'ThiruSu Juice Shop',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP connections (for development with local backend)
    // For production, remove cleartext and use HTTPS backend only
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6B35',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#ffffff',
    },
  },
};

export default config;
