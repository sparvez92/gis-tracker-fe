'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { BaseMapKey, TOKEN_COOKIE } from '@/constants';

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  init: () => void;
  baseMap: BaseMapKey;
  setBaseMap: (baseMap: BaseMapKey) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  baseMap: 'osm',
  login: (token) => {
    Cookies.set(TOKEN_COOKIE, token, { expires: 30 }); // 7 days
    set({ token });
  },

  logout: () => {
    Cookies.remove(TOKEN_COOKIE);
    set({ token: null });
  },

  init: () => {
    const token = Cookies.get(TOKEN_COOKIE) || null;
    set({ token });
  },
  setBaseMap: (baseMap) => set({ baseMap }),
}));
