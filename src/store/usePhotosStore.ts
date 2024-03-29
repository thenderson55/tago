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
import {MapType} from 'react-native-maps';

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
  categories: string[];
  loading: boolean;
  upLoading: boolean;
  randomImage: boolean;
  transferProgress: number;
  error: string;
  geoError: GeoError;
  mapType: MapType;
  fetchPhotos: (userId: string) => void;
  fetchPhoto: (id: number) => void;
  setRandomImage: () => void;
  setMapType: (mapType: MapType) => void;
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
    modalClose?: () => void,
    modalConfirmClose?: () => void,
    navigation?: NativeStackNavigationProp<PhotosParamList>,
  ) => void;
  fetchCategories: (userId: string) => void;
  addCategory: (user: User, category: string) => void;
  editCategory: (
    user: User,
    category: string,
    updatedCategory: string,
    setEditCurrentCategory: Dispatch<SetStateAction<boolean>>,
  ) => void;
  deleteCategory: (
    user: User,
    category: string,
    deletePhoto: (input: {id: string; category: string; ref: string}) => void,
    modalConfirmClose: () => void,
    setEditCurrentCategory: Dispatch<SetStateAction<boolean>>,
  ) => void;
}

const initialState = {
  photos: [],
  categories: [],
  loading: false,
  upLoading: false,
  randomImage: false,
  error: '',
  geoError: {} as GeoError,
  mapType: 'standard' as MapType,
  transferProgress: 0,
};

const usePhotosStore = create<PhotoState>(set => ({
  photos: initialState.photos,
  categories: initialState.categories,
  loading: initialState.loading,
  upLoading: initialState.upLoading,
  randomImage: initialState.randomImage,
  error: initialState.error,
  geoError: initialState.geoError,
  mapType: initialState.mapType,
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

  setMapType: mapType => {
    try {
      set(state => ({...state, mapType}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error,
      }));
    }
  },

  setRandomImage: () => {
    const randomBool = usePhotosStore.getState().randomImage;
    try {
      set(state => ({...state, randomImage: !randomBool}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error,
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

  editCategory: async (
    user: User,
    oldCategory: string,
    updatedCategory: string,
    setEditCurrentCategory,
  ) => {
    set(state => ({...state, loading: true}));
    try {
      const categories = usePhotosStore.getState().categories;
      const photos = usePhotosStore.getState().photos;
      const filtered = categories.filter(item => {
        return item !== categoryValues.default;
      });
      const categoresToLowercase = filtered.map(item => {
        return item.toLowerCase();
      });
      if (categoresToLowercase.includes(oldCategory.toLowerCase())) {
        // Delete old document, create new one, fetch new one
        await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(oldCategory)
          .delete();

        await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(updatedCategory)
          .set({name: updatedCategory});

        const doc = await firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(updatedCategory)
          .get();

        // Update photos category
        const photosToUpdate = photos.filter(item => {
          return item.category === oldCategory;
        });
        // Update each photo
        await Promise.all(
          photosToUpdate.map(item => {
            return firestore()
              .collection('Users')
              .doc(user.uid)
              .collection('Photos')
              .doc(item.id)
              .update({category: updatedCategory});
          }),
        );

        // If db update is successful, update photos and categories in state
        const updatedPhotos = photos.map(item => {
          if (item.category === oldCategory) {
            return {...item, category: updatedCategory};
          } else {
            return item;
          }
        });
        const updatedCategories = categories.map(item => {
          if (item === oldCategory) {
            return updatedCategory;
          } else {
            return item;
          }
        });
        doc.id === updatedCategory &&
          set(state => ({
            ...state,
            categories: updatedCategories,
            photos: updatedPhotos,
            loading: false,
          }));
        setEditCurrentCategory(false);
      } else {
        return;
      }
    } catch (error) {
      console.log('Edit cat error: ', error);
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  deleteCategory: async (
    user,
    category,
    deletePhoto,
    modalConfirmClose,
    setEditCurrentCategory,
  ) => {
    set(state => ({...state, loading: true}));
    try {
      const photos = usePhotosStore.getState().photos;
      const categories = usePhotosStore.getState().categories;
      const filtered = categories.filter(item => {
        return item !== categoryValues.default;
      });
      const categoresToLowercase = filtered.map(item => {
        return item.toLowerCase();
      });
      console.log({categoresToLowercase});
      if (categoresToLowercase.includes(category.toLowerCase())) {
        firestore()
          .collection('Users')
          .doc(user.uid)
          .collection('Categories')
          .doc(category)
          .delete();

        // Delete all photos with that category
        const photosToDelete = photos.filter(item => {
          return item.category === category;
        });
        await Promise.all(
          photosToDelete.map(item => {
            return deletePhoto(item);
          }),
        );

        // Remove category from category array and photo from photos and update state
        const updatedCategories = categories.filter(item => {
          return item !== category;
        });
        const updatedPhotos = photos.filter(item => {
          return item.category !== category;
        });
        set(state => ({
          ...state,
          categories: updatedCategories,
          photos: updatedPhotos,
          loading: false,
        }));
        setEditCurrentCategory(false);
        modalConfirmClose();
      } else {
        return;
      }
    } catch (error) {
      console.log('Add cat error: ', error);
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
          const newPhoto = {...(doc.data() as PhotoType), id: doc.id};
          set((state: PhotoState) => ({
            ...state,
            transferProgress: 1,
            photos: [newPhoto, ...(state.photos as PhotoType[])],
          }));

          set(state => ({
            ...state,
            loading: false,
            upLoading: false,
            transferProgress: 0,
          }));

          modalClose();
          navigation.navigate('Map', {
            // newPhoto: doc.data() as PhotoType,
            newPhoto: true,
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
      modalClose && modalClose();
      modalConfirmClose && modalConfirmClose();
      navigation && navigation.goBack();
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
