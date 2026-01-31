
export const LOGO_URL = 'https://iili.io/fLeiugR.png';
export const APP_NAME = 'Aplikasi Menulis Buku Non Fiksi';
export const DEVELOPER_INFO = 'Pengembang : Ahmad Bashir, S.Pd, M.Pd (Penulis Buku)';

export interface Credential {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export const VALID_CREDENTIALS: Credential[] = [
  { username: 'abi1981', password: '123456', role: 'admin' },
  { username: 'di@din', password: '123456', role: 'user' },
  { username: 'do2do', password: '123456', role: 'user' },
  { username: 'du1du', password: '123456', role: 'user' },
  { username: 'ru9tun', password: '123456', role: 'user' },
  { username: 're@ne', password: '123456', role: 'user' },
  { username: 'rom@ntis', password: '123456', role: 'user' }
];
