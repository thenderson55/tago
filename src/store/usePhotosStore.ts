import create from 'zustand';
import firestore from '@react-native-firebase/firestore';
import {categoryValues, timeStamp} from '../utils/settings';
import storage from '@react-native-firebase/storage';
import {ImagePickerResponse} from 'react-native-image-picker';
import {Dispatch, SetStateAction} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../stacks/Home/HomeParamList';
import {User} from 'firebase/auth';
import Geolocation, {
  GeoError,
  GeoPosition,
} from 'react-native-geolocation-service';
import {PhotosParamList} from '../stacks/Photos/PhotosParamList';
import auth from '@react-native-firebase/auth';

export type PhotoType = {
  id: string;
  ref: string;
  title: string;
  // TODO: Why below won't work?
  // location: [number, number];
  description: string;
  category: string;
  url: string;
  location: number[];
  created: Date;
};
export type CategoryType = {
  name: string;
};

export interface PhotoState {
  photos: PhotoType[];
  currentLocation: number[];
  categories: string[];
  loading: boolean;
  upLoading: boolean;
  transferProgress: number;
  error: string;
  geoError: GeoError;
  fetchPhotos: (userId: string) => void;
  fetchPhoto: (id: number) => void;
  getCurrentLocation: () => void;
  addPhoto: (
    user: User,
    response: ImagePickerResponse,
    input: PhotoType,
    modalClose: () => void,
    addCategory: (user: User, category: string) => void,
    navigation: NativeStackNavigationProp<HomeParamList>,
  ) => void;
  editPhoto: (
    user: User,
    input: {
      id: string;
      category: string;
      title?: string;
      description?: string;
    },
    modalClose: () => void,
    addCategory: (user: User, category: string) => void,
    setCurrentPhoto: Dispatch<SetStateAction<PhotoType>>,
  ) => void;
  deletePhoto: (
    input: {
      id: string;
      category: string;
      ref: string;
      title?: string;
      description?: string;
    },
    modalClose: () => void,
    modalConfirmClose: () => void,
    navigation: NativeStackNavigationProp<PhotosParamList>,
  ) => void;
  fetchCategories: (userId: string) => void;
  addCategory: (user: User, category: string) => void;
}

const initialState = {
  photos: [],
  currentLocation: [],
  categories: [],
  loading: false,
  upLoading: false,
  error: '',
  geoError: {} as GeoError,
  transferProgress: 0,
};

const usePhotosStore = create<PhotoState>(set => ({
  photos: initialState.photos,
  currentLocation: initialState.currentLocation,
  categories: initialState.categories,
  loading: initialState.loading,
  upLoading: initialState.upLoading,
  error: initialState.error,
  geoError: initialState.geoError,
  transferProgress: initialState.transferProgress,
  // transferFinished: initialState.transferFinished,

  fetchPhotos: async userId => {
    try {
      const res = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('Photos')
        .get();
      const photosMap = res.docs.map(item => {
        return {...(item.data() as PhotoType), id: item.id};
      });
      // Make sure that the photo has location
      const filtered = photosMap.filter(item =>
        item.hasOwnProperty('location'),
      );
      set(state => ({...state, photos: filtered}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error,
      }));
    }
  },

  getCurrentLocation: async () => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        // setLocation([position.coords.latitude, position.coords.longitude]);
        set(state => ({
          ...state,
          currentLocation: [
            position.coords.latitude,
            position.coords.longitude,
          ],
        }));
        return;
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        set(state => ({
          ...state,
          geoError: error,
        }));
        return;
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
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
        error: error,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  fetchCategories: async userId => {
    try {
      const categoriesCollection = await firestore()
        .collection('Users')
        .doc(userId)
        .collection('Categories')
        .get();
      const categories = categoriesCollection.docs.map(item => item.id);
      set(state => ({...state, categories}));
    } catch (error: any) {
      console.log('Fetch cat error: ', error);
      set(state => ({...state, error: error}));
    }
  },

  addCategory: async (user: User, category: string) => {
    set(state => ({...state, loading: true}));
    try {
      const categories = usePhotosStore.getState().categories;
      const filtered = categories.filter(item => {
        return item !== categoryValues.default;
      });
      const categoresToLowercase = filtered.map(item => {
        return item.toLowerCase();
      });
      console.log({categoresToLowercase});
      if (!categoresToLowercase.includes(category.toLowerCase())) {
        firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(category)
          .set({name: category});

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
      } else {
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
    navigation,
  ) => {
    set(state => ({...state, loading: true, upLoading: true}));

    try {
      // https://stackoverflow.com/questions/68643842/react-native-photo-wont-upload-to-firebase
      await addCategory(user, input.category);
      const uri = response!.assets![0].uri!;
      let task;
      let inputUpdate = input;
      if (uri) {
        const uploadUri = uri;
        console.log({uploadUri});

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
          inputUpdate = {...input, url};
          const res = await firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('Photos')
            .add({...inputUpdate, ref: input.ref, created: timeStamp()});

          const doc = await firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('Photos')
            .doc(res.id)
            .get();
          set((state: PhotoState) => ({
            ...state,
            transferProgress: 1,
            photos: [...(state.photos as PhotoType[]), doc.data() as PhotoType],
          }));

          set(state => ({
            ...state,
            loading: false,
            upLoading: false,
            transferProgress: 0,
          }));

          modalClose();
          navigation.navigate('Map', {
            newPhoto: doc.data() as PhotoType,
          });
        });
      }

      // FIXME: Why was this here (it delays the finally):
      // await task;

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
    } catch (error) {
      console.log('Add error: ', error);
      set(state => ({
        ...state,
        loading: false,
        upLoading: false,
        transferProgress: 0,
      }));
    }
  },

  editPhoto: async (user, input, modalClose, addCategory, setCurrentPhoto) => {
    set(state => ({...state, upLoading: true}));
    try {
      await addCategory(user, input.category);
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Photos')
        .doc(input.id)
        .update({...input});
      const doc = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('Photos')
        .doc(input.id)
        .get();
      const replaceOldPhoto = (state: PhotoState) => {
        const photos = state.photos as PhotoType[];
        const index = photos.findIndex(photo => photo.id === input.id);
        photos[index] = doc.data() as PhotoType;
        return photos;
      };
      setCurrentPhoto(doc.data() as PhotoType);
      set((state: PhotoState) => ({
        ...state,
        photos: [...replaceOldPhoto(state)],
        upLoading: false,
      }));
      modalClose();
    } catch (error) {
      console.log('Add error: ', error);
      set(state => ({
        ...state,
        upLoading: false,
      }));
    }
  },

  deletePhoto: async (input, modalClose, modalConfirmClose, navigation) => {
    const user = await auth().currentUser;
    set(state => ({...state, upLoading: true}));
    try {
      const deleted = await storage().ref(input.ref).delete();
      console.log('Image deleted from bucket: ', deleted);
      await firestore()
        .collection('Users')
        .doc(user!.uid)
        .collection('Photos')
        .doc(input.id)
        .delete();

      const removeOldPhoto = (state: PhotoState) => {
        const photos = state.photos as PhotoType[];
        const index = photos.findIndex(photo => photo.id === input.id);
        photos.splice(index, 1);
        return photos;
      };
      set((state: PhotoState) => ({
        ...state,
        photos: [...removeOldPhoto(state)],
        upLoading: false,
      }));
      modalClose();
      modalConfirmClose();
      navigation.navigate('PhotosList');
    } catch (error) {
      console.log('Delete error: ', error);
      set(state => ({
        ...state,
        upLoading: false,
      }));
    }
  },
}));

export default usePhotosStore;
