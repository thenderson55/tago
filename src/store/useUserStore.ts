import create from 'zustand';
import {timeStamp} from '../utils/settings';
import firestore from '@react-native-firebase/firestore';
import {User} from 'firebase/auth';
import auth from '@react-native-firebase/auth';

export interface UserState {
  user: User;
  loading: boolean;
  error: string;
  setUser: (user: User) => void;
  addUser: (id: string, username: string) => void;
  fetchUser: () => void;
  deleteUser: (user: User) => void;
}

const initialState = {
  user: {
    uid: '',
    name: '',
    emailVerified: false,
    email: '',
    phoneNumber: '',
    photoURL: '',
    providerId: '',
    tenantId: '',
    displayName: '',
    refreshToken: '',
    metadata: {
      creationTime: '',
      lastSignInTime: '',
    },
  },
  loading: false,
  error: '',
};

const useUserStore = create<UserState>(set => ({
  user: initialState.user,
  loading: initialState.loading,
  error: initialState.error,

  setUser: async (user: User) => {
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
  addUser: async (id, username) => {
    try {
      const res = await firestore().collection('Users').doc(id).set({
        created: timeStamp(),
        username,
      });
      const res2 = await firestore().collection('Usernames').doc(username).set({
        username,
      });
      console.log('Add doc res ID: ', res);
      console.log('Add username: ', res2);
      const doc = await firestore().collection('Users').doc(id).get();
      console.log('Fetch new doc: ', doc.data());
      // set(state => ({...state, user: true}));
    } catch (error) {
      console.log('Add error: ', error);
    }
  },
  // updateUser: async user => {},
  deleteUser: async () => {
    set(state => ({...state, loading: true}));
    const user = await auth().currentUser;
    if (user) {
      try {
        await firestore().collection('Users').doc(user.uid).delete();
        if (user.displayName) {
          await firestore()
            .collection('Usernames')
            .doc(user.displayName)
            .delete();
        }
        await auth().currentUser?.delete();
        set(state => ({...state, loading: false}));
      } catch (error) {
        console.log('Delete user error: ', error);
        set(state => ({...state, loading: false}));
      }
    }
  },
}));

export default useUserStore;
