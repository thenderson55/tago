import create from 'zustand';
import {timeStamp} from '../utils/settings';
import firestore from '@react-native-firebase/firestore';
import {User} from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import {errorResponseMessage} from '../utils';

export interface UserState {
  user: User;
  loading: boolean;
  error: string;
  errorEmail: string;
  errorPassword: string;
  errorUsername: string;
  clearErrors: () => void;
  setUser: (user: User) => void;
  addUser: (id: string, username: string) => void;
  fetchUser: () => void;
  deleteUser: (modalClose: () => void) => void;
  updatePassword: (newPassword: string, modalClose: () => void) => void;
  updateEmail: (newEmail: string, modalClose: () => void) => void;
  updateUsername: (newUsername: string, modalClose: () => void) => void;
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
  errorEmail: '',
  errorPassword: '',
  errorUsername: '',
};

const useUserStore = create<UserState>(set => ({
  user: initialState.user,
  loading: initialState.loading,
  error: initialState.error,
  errorEmail: initialState.errorEmail,
  errorPassword: initialState.errorPassword,
  errorUsername: initialState.errorUsername,

  clearErrors: async () => {
    console.log('Clearing errors');
    set(state => ({
      ...state,
      error: '',
      errorEmail: '',
      errorPassword: '',
      errorUsername: '',
    }));
  },

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

  updatePassword: async (newPassword, modalClose) => {
    try {
      await auth().currentUser?.updatePassword(newPassword);
      modalClose();
    } catch (e) {
      console.log('Update password error: ', e);
      modalClose();
    }
  },

  updateEmail: async (newEmail, modalClose) => {
    try {
      await auth().currentUser?.updateEmail(newEmail);
      modalClose();
    } catch (error: any) {
      console.log('Update email error: ', error);
      const errorMessage = errorResponseMessage(error);
      set(state => ({
        ...state,
        errorEmail: errorMessage || '',
      }));
    }
  },

  updateUsername: async (newUsername, modalClose) => {
    try {
      const user = await auth().currentUser;
      await firestore().collection('Users').doc(user?.uid).update({
        username: newUsername,
      });
      await auth().currentUser?.updateProfile({
        displayName: newUsername,
      });
      if (user?.displayName) {
        await firestore()
          .collection('Usernames')
          .doc(user.displayName)
          .delete();
      }
      await firestore().collection('Usernames').doc(newUsername).set({
        newUsername,
      });
      modalClose();
    } catch (e) {
      console.log('Update username error: ', e);
      modalClose();
    }
  },

  deleteUser: async modalClose => {
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
        modalClose();
      } catch (error) {
        console.log('Delete user error: ', error);
        set(state => ({...state, loading: false}));
      }
    }
  },
}));

export default useUserStore;
