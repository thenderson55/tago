import create from 'zustand';
import auth from '@react-native-firebase/auth';

export interface UserType {
  id: number;
  name: string;
}
export interface UserState {
  user: UserType;
  loading: boolean;
  error: string;
  fetchUser: Function;
  emailLogin: Function;
}

const initialState = {
  user: {},
  loading: false,
  error: '',
};

const useUserStore = create(set => ({
  user: initialState.user,
  loading: initialState.loading,
  error: initialState.error,

  fetchUser: async () => {
    set((state: UserState) => ({...state, loading: true}));
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await res.json();
      set((state: UserState) => ({...state, error: '', users}));
    } catch (error: any) {
      set((state: UserState) => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set((state: UserState) => ({
        ...state,
        loading: false,
      }));
    }
  },

  // In our example we only need to fetch the users, but you'd probably want to define other methods here
  // login: async user => {},
  emailLogin: async (email: string, password: string) => {
    set((state: UserState) => ({...state, loading: true}));
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      console.log('Zustand user account signed in!', res);
    } catch (error: any) {
      let errorMessage = '';
      if (error.code === 'auth/user-not-found') {
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        console.log(errorMessage);
      }
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
        console.log(errorMessage);
      }
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
        console.log(errorMessage);
      }
      set((state: UserState) => ({
        ...state,
        error: errorMessage,
      }));
    } finally {
      set((state: UserState) => ({
        ...state,
        loading: false,
      }));
    }
  },
  addUser: async user => {},
  updateUser: async user => {},
  deleteUser: async id => {},
}));

export default useUserStore;
