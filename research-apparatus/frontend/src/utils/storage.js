import { MMKV } from 'react-native-mmkv';


export const sessionStorage = new MMKV({
    id: 'user-storage'
});