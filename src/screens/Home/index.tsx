import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ImagePickerResponse} from 'react-native-image-picker';
// import Blob from './Blob';
import ModalInfo from '../../components/Modals/ModalInfo';
import theme from '../../theme';
import usePhotosStore from '../../store/usePhotosStore';
import useUserStore from '../../store/useUserStore';
import {handleSelectPicture, requestLocationPermission} from '../../utils';

function Home() {
  const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
  const [imageLocation, setImageLocation] = useState<number[]>();
  const {fetchPhotos, fetchCategories, getCurrentLocation} = usePhotosStore();
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
    <View style={styles.safeView}>
      <ModalInfo
        modalBool={infoModal}
        modalClose={infoModalClose}
        imageResponse={imageResponse!}
        location={imageLocation}
      />
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            handleSelectPicture(
              setImageResponse,
              setImageLocation,
              infoModalOpen,
            )
          }>
          <Text style={styles.text}>TAKE PHOTO</Text>
        </TouchableOpacity>
      </View>
      {/* <Blob /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
  },
  button: {
    height: 250,
    width: 250,
    borderRadius: 125,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.3,
  },
  text: {
    fontSize: 24,
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
});

export default Home;
