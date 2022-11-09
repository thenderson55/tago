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
  fetchUser: () => void;
  emailLogin: (email: string, password: string) => void;
}

const initialState = {
  user: {id: 0, name: ''},
  loading: false,
  error: '',
};

const useUserStore = create<UserState>(set => ({
  user: initialState.user,
  loading: initialState.loading,
  error: initialState.error,

  fetchUser: async () => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await res.json();
      set(state => ({...state, error: '', users}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  emailLogin: async (email, password) => {
    set(state => ({...state, loading: true}));
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
      set(state => ({
        ...state,
        error: errorMessage,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  // In our example we only need to fetch the users, but you'd probably want to define other methods here
  // login: async user => {},
  // addUser: async user => {},
  // updateUser: async user => {},
  // deleteUser: async id => {},
}));

export default useUserStore;
