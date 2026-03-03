import { Platform } from 'react-native';

const DEV_LOCAL_IP = '10.145.31.131';
// const DEV_LOCAL_IP = 'localhost';

export const API_URL = Platform.select({
  ios: `http://localhost:5000`,
  android: `http://${DEV_LOCAL_IP}:5000`,
  web: `http://${DEV_LOCAL_IP}:5000`,
  default: `http://${DEV_LOCAL_IP}:5000`
});