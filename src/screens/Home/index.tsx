import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  ImagePickerResponse,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
// import Blob from './Blob';
import firestore from '@react-native-firebase/firestore';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import ModalInfo from '../../components/Modals/ModalInfo';
import MainButton from '../../components/Buttons/MainButton';
import theme from '../../theme';
import usePhotosStore from '../../store/usePhotosStore';
import useUserStore from '../../store/useUserStore';
import {handleSelectPicture, requestLocationPermission} from '../../utils';

function Home() {
  const navigation: NativeStackNavigationProp<HomeParamList> = useNavigation();
  const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
  const {fetchPhotos, fetchCategories, getCurrentLocation, currentLocation} =
    usePhotosStore();
  const {user} = useUserStore();

  const [infoModal, setInfoModal] = useState(false);
  const infoModalClose = () => {
    setInfoModal(false);
  };
  const infoModalOpen = () => {
    setInfoModal(true);
  };

  useEffect(() => {
    const getPermssionsAndLocation = async () => {
      await requestLocationPermission();
      getCurrentLocation();
    };
    getPermssionsAndLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (user?.uid?.length > 1) {
      fetchCategories(user.uid);
      fetchPhotos(user.uid);
    }
  }, [user?.uid, fetchCategories, fetchPhotos]);

  // const listFilesAndDirectories = (
  //   reference: FirebaseStorageTypes.Reference,
  //   pageToken: string,
  // ): any => {
  //   return reference.list({pageToken}).then(result => {
  //     // Loop over each item
  //     result.items.forEach(ref => {
  //       // console.log(ref.fullPath);
  //     });

  //     if (result.nextPageToken) {
  //       return listFilesAndDirectories(reference, result.nextPageToken);
  //     }

  //     return Promise.resolve();
  //   });
  // };

  // useEffect(() => {
  // RNFB VERSION
  // const reference = storage().ref();
  // listFilesAndDirectories(reference, '').then(() => {
  //   console.log('Finished listing');
  // });
  // reference.list().then(res => {
  //   console.log('LIST', res);
  // });
  // WEB VERSION
  // const imagesListRef = ref(appStorage);
  // const reference = ref(
  //   appStorage,
  //   '1E9B4F7C-6CF9-4A23-B6BF-66EAF7B4B415.jpg',
  // );
  // getDownloadURL(reference).then(url => {
  //   console.log('Fetch on URL using ref:', url);
  // });
  // listAll(imagesListRef).then(response => {
  //   response.items.forEach(item => {
  //     getDownloadURL(item).then(url => {
  //       setImageUrls(prev => [...prev, url]);
  //     });
  //   });
  // });
  // }, []);

  // const getData = async () => {
  // const reference = storage().ref();
  // console.log('REF', reference);
  // const url = await storage().ref('DuchessAgain.jpeg').getDownloadURL();
  // console.log('URL', url);
  // const url2 = await storage()
  //   .ref('thomas-henderson-resume-2022c.docx')
  //   .getDownloadURL();
  // console.log('URL CV', url2);
  // const list = async () => {
  //   const listRes = await reference.list();
  //   console.log('LIST', listRes.items);
  //   listRes.items.forEach(listRess => {
  //     // All the items under listRef.
  //     console.log('Item', listRess.fullPath);
  //   });
  // };
  // list();
  // const appstorage = getStorage();
  // Create a storage reference from our storage service
  // const storageRef = ref(appstorage);
  // const listRef = ref(storage, 'files/uid');
  // Find all the prefixes and items.
  // listAll(storageRef)
  //   .then(res => {
  //     console.log('RES: ', res);
  //     // res.prefixes.forEach((folderRef) => {
  //     //   // All the prefixes under listRef.
  //     //   // You may call listAll() recursively on them.
  //     // });
  //     // res.items.forEach((itemRef) => {
  //     //   // All the items under listRef.
  //     // });
  //   })
  //   .catch(error => {
  //     console.log('LIST ERROR: ', error);
  //     // Uh-oh, an error occurred!
  //   });
  // try {
  // const usersCollection = await firestore()
  //   .collection('Users')
  //   .doc('Xel0Qy1Y9aWn6o27xb0nbr9SdLF3')
  //   .collection('Photos')
  //   .get();
  // const usersCollectionCat = await firestore()
  //   .collection('Users')
  //   .doc('Xel0Qy1Y9aWn6o27xb0nbr9SdLF3')
  //   .collection('Categories')
  //   .get();
  // console.log('COLLECTION AUTH', usersCollection.docs);
  // console.log('COLLECTION CAT', usersCollectionCat.docs);
  // console.log('COLLECTION AUTH 2', usersCollection.docs[1].data());
  // addCategory(user, 'Minchester');
  //   } catch (err) {
  //     console.log('ERROR', err);
  //   }
  // };

  return (
    <SafeAreaView style={styles.safeView}>
      <ModalInfo
        modalBool={infoModal}
        modalClose={infoModalClose}
        imageResponse={imageResponse!}
        location={currentLocation}
      />
      <View>
        <MainButton
          style={{marginTop: 30}}
          text="Take photo"
          onPress={() => handleSelectPicture(setImageResponse, infoModalOpen)}
        />
        <MainButton
          text="Account"
          onPress={() => navigation.navigate('Account')}
        />
        {/* <Button title="Graph" onPress={() => navigation.navigate('Graph')} /> */}
        {/* <MainButton text="GET DATA" onPress={getData} /> */}
        {/*
        <FastImage
          style={{height: 300, marginTop: 50}}
          source={{
            // uri: 'https://firebasestorage.googleapis.com/v0/b/tago-d37a7.appspot.com/o/DuchessAgain.jpeg?alt=media&token=239ed376-3e18-4b0a-92ca-44c825f06b06',

            uri: 'https://firebasestorage.googleapis.com/v0/b/tago-d37a7.appspot.com/o/rn_image_picker_lib_temp_61f4d80f-4de6-4deb-88ff-9b0801eabaf7.jpg?alt=media&token=9d174cc4-2825-4496-8d78-ffbb281f8894',
            // headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        /> */}
      </View>
      {/* <Blob /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    margin: theme.margins.screen,
    backgroundColor: theme.colors.background,
  },
  loadingDots: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (Dimensions.get('window').height / 10) * 2,
  },
});

export default Home;
