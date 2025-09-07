import { create } from 'zustand';

export type AuthStore = {
  token?: string;
  initialized: boolean;
  isLoggedIn: boolean;
  isLoggedOut: boolean;
  initialize: (state: boolean) => void;
  setCredentials: (token: string | undefined) => void;
  clearCredentials: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  token: undefined,
  initialized: false,
  isLoggedIn: false,
  isLoggedOut: true,
  initialize: (state: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const hasValidCredentials = !!token;

      set({
        initialized: state,
        token: token || undefined,
        isLoggedIn: hasValidCredentials,
        isLoggedOut: !hasValidCredentials,
      });
    } catch (error) {
      console.error('Error initializing auth store:', error);
      set({
        initialized: state,
        token: undefined,
        isLoggedIn: false,
        isLoggedOut: true,
      });
    }
  },
  setCredentials: (token: string | undefined) => {
    const hasCredentials = !!token;

    set({
      token,
      isLoggedIn: hasCredentials,
      isLoggedOut: !hasCredentials,
    });

    if (hasCredentials) {
      try {
        localStorage.setItem('token', token!);
      } catch (error) {
        console.error('Error setting credentials:', error);
      }
    }
  },
  clearCredentials: () => {
    set({
      token: undefined,
      isLoggedIn: false,
      isLoggedOut: true,
    });

    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  },
}));

export default useAuthStore;
