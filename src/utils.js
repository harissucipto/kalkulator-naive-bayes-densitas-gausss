import { reactLocalStorage } from 'reactjs-localstorage';

export const simpanData = value =>
  reactLocalStorage.setObject('rumiData', value);

export const ambilData = () => reactLocalStorage.getObject('rumiData');
