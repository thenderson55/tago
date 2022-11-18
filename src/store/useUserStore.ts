import create from 'zustand';
import {timeStamp} from '../utils/settings';
import firestore from '@react-native-firebase/firestore';

export type UserType = {
  uid: string;
  name: string;
};
export interface UserState {
  user: UserType;
  loading: boolean;
  error: string;
  setUser: (user: UserType) => void;
  addUser: (id: string) => void;
  fetchUser: () => void;
}

const initialState = {
  user: {uid: 0, name: ''},
  loading: false,
  error: '',
};

const useUserStore = create<UserState>(set => ({
  user: initialState.user,
  loading: initialState.loading,
  error: initialState.error,

  setUser: async (user: UserType) => {
    set(state => ({...state, user}));
  },

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

  // In our example we only need to fetch the users, but you'd probably want to define other methods here
  // login: async user => {},
  addUser: async id => {
    try {
      const res = await firestore().collection('Users').doc(id).set({
        created: timeStamp(),
      });
      console.log('Add doc res ID: ', res);
      const doc = await firestore().collection('Users').doc(id).get();
      console.log('Fetch new doc: ', doc.data());
    } catch (error) {
      console.log('Add error: ', error);
    }
  },
  // updateUser: async user => {},
  // deleteUser: async id => {},
}));

export default useUserStore;
