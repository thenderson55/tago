import create from 'zustand';
import {timeStamp} from '../utils/settings';
import firestore from '@react-native-firebase/firestore';
import {User} from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import {firebaseErrorMessage} from '../utils';
import {PhotoType} from './usePhotosStore';
import storage from '@react-native-firebase/storage';

export interface UserState {
  user: User;
  userLocation: number[];
  loading: boolean;
  error: string;
  errorAccount: string;
  tabStatus: string;
  clearErrors: () => void;
  setTabStatus: (tabStatus: string) => void;
  setUser: (user: User) => void;
  setUserLocation: (location: number[]) => void;
  addUser: (id: string, username: string) => void;
  deleteUser: (modalClose: () => void) => void;
  updatePassword: (newPassword: string, modalClose: () => void) => void;
  updateEmail: (newEmail: string, modalClose: () => void) => void;
  updateUsername: (newUsername: string, modalClose: () => void) => void;
}

const initialState = {
  user: {} as User,
  userLocation: [],
  loading: false,
  error: '',
  errorAccount: '',
  tabStatus: 'HomeStack',
};

const useUserStore = create<UserState>(set => ({
  user: initialState.user,
  userLocation: initialState.userLocation,
  loading: initialState.loading,
  error: initialState.error,
  errorAccount: initialState.errorAccount,
  tabStatus: initialState.tabStatus,

  clearErrors: () => {
    console.log('Clearing errors');
    set(state => ({
      ...state,
      error: '',
      errorAccount: '',
    }));
  },

  setUser: (user: User) => {
    set(state => ({...state, user}));
  },

  setUserLocation: location => {
    console.log('setUserLocation', location);
    set(state => ({
      ...state,
      userLocation: location,
    }));
  },

  setTabStatus: (tabStatus: string) => {
    set(state => ({...state, tabStatus}));
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
    set(state => ({...state, loading: true}));
    try {
      await auth().currentUser?.updatePassword(newPassword);
      set(state => ({
        ...state,
        loading: false,
      }));
      modalClose();
    } catch (error: any) {
      console.log('Update password error: ', error);
      const errorMessage = await firebaseErrorMessage(error);
      set(state => ({
        ...state,
        loading: false,
        errorAccount: errorMessage || `Update password error:  ${error}`,
      }));
    }
  },

  updateEmail: async (newEmail, modalClose) => {
    set(state => ({...state, loading: true}));
    try {
      await auth().currentUser?.updateEmail(newEmail);
      set(state => ({
        ...state,
        loading: false,
      }));
      modalClose();
    } catch (error: any) {
      console.log('Update email error: ', error);
      const errorMessage = await firebaseErrorMessage(error);
      set(state => ({
        ...state,
        loading: false,
        errorAccount: errorMessage || `Update email error:  ${error}`,
      }));
    }
  },

  updateUsername: async (newUsername, modalClose) => {
    set(state => ({...state, loading: true}));
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
      set(state => ({
        ...state,
        loading: false,
      }));
      modalClose();
    } catch (error: any) {
      console.log('Update username error: ', error);
      const errorMessage = await firebaseErrorMessage(error);
      set(state => ({
        ...state,
        loading: false,
        errorAccount: errorMessage || `Update username error:  ${error}`,
      }));
    }
  },

  deleteUser: async modalClose => {
    set(state => ({...state, loading: true}));
    const user = await auth().currentUser;
    if (user) {
      try {
        const res = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Photos')
          .get();
        const photosMap = res.docs.map(item => {
          return {...(item.data() as PhotoType), id: item.id};
        });
        photosMap.forEach(async photo => {
          const deleted = await storage().ref(photo.ref).delete();
          console.log('Image deleted from bucket: ', deleted);
        });

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
      } catch (error: any) {
        console.log('Delete user error: ', error);
        const errorMessage = await firebaseErrorMessage(error);
        set(state => ({
          ...state,
          loading: false,
          errorAccount: errorMessage || `Delete user error:  ${error}`,
        }));
      }
    }
  },
}));

export default useUserStore;
