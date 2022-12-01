import create from 'zustand';
import firestore from '@react-native-firebase/firestore';
import {timeStamp} from '../utils/settings';
import storage from '@react-native-firebase/storage';
import {ImagePickerResponse} from 'react-native-image-picker';
import {UserType} from './useUserStore';
import {Dispatch, SetStateAction} from 'react';

export type PhotoType = {
  ref: string;
  title: string;
  // TODO: Why below won't work?
  // location: [number, number];
  description: string;
  category: string;
  location?: number[];
  created?: Date;
};
export type CategoryType = {
  name: string;
};

export interface PhotoState {
  photos: PhotoType[];
  categories: string[];
  loading: boolean;
  upLoading: boolean;
  transferProgress: number;
  error: string;
  fetchPhotos: () => void;
  fetchPhoto: (id: number) => void;
  addPhoto: (
    user: UserType,
    response: ImagePickerResponse,
    input: PhotoType,
    modalClose: () => void,
    addCategory: (
      user: UserType,
      category: string,
      setCategoryAlreadyExists: Dispatch<SetStateAction<boolean>>,
    ) => void,
    setCategoryAlreadyExists: Dispatch<SetStateAction<boolean>>,
  ) => void;
  editPhoto: (input: PhotoType) => void;
  deletePhoto: (id: number) => void;
  fetchCategories: (user: UserType) => void;
  addCategory: (
    user: UserType,
    category: string,
    setCategoryAlreadyExists: Dispatch<SetStateAction<boolean>>,
  ) => void;
}

const initialState = {
  photos: [
    {
      ref: '',
      title: '',
      location: [1, 2],
      description: '',
      category: '',
      created: new Date(),
    },
  ],
  categories: [''],
  loading: false,
  upLoading: false,
  error: '',
  transferProgress: 0,
};

const usePhotosStore = create<PhotoState>(set => ({
  photos: initialState.photos,
  categories: initialState.categories,
  loading: initialState.loading,
  upLoading: initialState.upLoading,
  error: initialState.error,
  transferProgress: initialState.transferProgress,
  // transferFinished: initialState.transferFinished,

  fetchPhotos: async () => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      set(state => ({...state, photos: [...state.photos, res]}));
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

  fetchPhoto: async id => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${id}`);
      const users = await res.json();
      set((state: PhotoState) => ({...state, error: '', users}));
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

  fetchCategories: async (user: UserType) => {
    set(state => ({...state, loading: true}));
    try {
      const categoriesCollection = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Categories')
        .get();
      const categories = categoriesCollection.docs.map(item => item.id);
      set(state => ({...state, categories}));
    } catch (error) {
      console.log('Fetch cat error: ', error);
      set(state => ({...state, loading: false}));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  addCategory: async (
    user: UserType,
    category: string,
    setCategoryAlreadyExists: Dispatch<SetStateAction<boolean>>,
  ) => {
    set(state => ({...state, loading: true}));
    try {
      const categories = usePhotosStore.getState().categories;
      const categoresToLowercase = categories.map(item => {
        return item.toLowerCase();
      });
      if (!categoresToLowercase.includes(category.toLowerCase())) {
        firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(category)
          .set({[category]: category});

        const doc = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(category)
          .get();
        doc.id === category &&
          set(state => ({
            ...state,
            categories: [...categories, category],
          }));
        console.log('DOCID', doc.id);
      } else {
        setCategoryAlreadyExists(true);
        return;
      }
    } catch (error) {
      console.log('Add cat error: ', error);
      set(state => ({
        ...state,
        loading: false,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  addPhoto: async (
    user,
    response,
    input,
    modalClose,
    addCategory,
    setCategoryAlreadyExists,
  ) => {
    set(state => ({...state, loading: true}));

    try {
      // https://stackoverflow.com/questions/68643842/react-native-photo-wont-upload-to-firebase
      await addCategory(user, input.category, setCategoryAlreadyExists);
      const uri = response!.assets![0].uri!;
      let task;
      if (uri) {
        const uploadUri = uri;
        console.log({uploadUri});
        set(state => ({...state, upLoading: true}));

        task = storage().ref(input.ref).putFile(uploadUri);
        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
          set((state: PhotoState) => ({
            ...state,
            transferProgress:
              taskSnapshot.bytesTransferred / taskSnapshot.totalBytes - 0.05,
          }));

          // console.log(
          //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes) *
          //     10000,
          // );
        });
        task.then(async () => {
          console.log('Image uploaded to bucket');
          const url = await storage().ref(input.ref).getDownloadURL();
          console.log('Image download URL: ', url);
          modalClose();
          return url;
        });
      }

      await task;

      // const upload = async () => {
      //   // WEB VERSION BUT CRASHES FOR IOS BUT STILL UPLOADS
      //   // https://github.com/invertase/react-native-firebase/issues/4271
      //   const reference = await ref(appStorage, response.assets[0].fileName);
      //   const img = await fetch(response.assets[0].uri);
      //   const blob = await img.blob();
      //   await uploadBytes(reference, blob)
      //     .then(snapshot => {
      //       console.log('uploaded');
      //       getDownloadURL(snapshot.ref).then(url =>
      //         console.log('URL', url),
      //       );
      //     })
      //     .catch(error => console.log('ERRRRRR', error));
      // };

      const res = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Photos')
        .add({...input, ref: input.ref, created: timeStamp()});
      console.log('Add doc res ID: ', res);
      set((state: PhotoState) => ({
        ...state,
        transferProgress: 1,
      }));

      const doc = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Photos')
        .get();
      console.log('Fetch new doc: ', doc.docs);
    } catch (error) {
      console.log('Add error: ', error);
    } finally {
      set(state => ({
        ...state,
        loading: false,
        transferProgress: 0,
      }));
    }
  },

  editPhoto: async input => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${input}`);
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

  deletePhoto: async id => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${id}`);
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
}));

export default usePhotosStore;
