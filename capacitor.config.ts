import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.realestate',
  appName: 'Real Estate App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
