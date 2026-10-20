import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chathub.crm',
  appName: 'Chat Hub CRM',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
