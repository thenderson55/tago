import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  ImagePickerResponse,
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
// import Blob from './Blob';
import firestore from '@react-native-firebase/firestore';
import usePhotosFacade from '../../facades/usePhotosFacade';
import {PhotoType} from '../../store/usePhotosStore';
import {utils} from '@react-native-firebase/app';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
// } from 'firebase/storage';
import {appStorage} from '../../../App';
import FastImage from 'react-native-fast-image';

function Home() {
  // const navigation: NativeStackNavigationProp<HomeParamList, 'Graph'> =
  //   useNavigation();
  // const {uid} = firebase.auth().currentUser;
  // const {addPhoto} = usePhotosFacade();

  const [location, setLocation] = useState<number[]>([0, 0]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const [imageUrls, setImageUrls] = useState([]);
  // console.log({imageUrls});
  // const uploadFile = () => {
  //   if (imageUpload == null) {
  //     return;
  //   }
  //   const imageRef = ref(appStorage, `images/${imageUpload.name + v4()}`);
  //   uploadBytes(imageRef, imageUpload).then(snapshot => {
  //     getDownloadURL(snapshot.ref).then(url => {
  //       setImageUrls(prev => [...prev, url]);
  //     });
  //   });
  // };
  const listFilesAndDirectories = (
    reference: FirebaseStorageTypes.Reference,
    pageToken: string,
  ): any => {
    return reference.list({pageToken}).then(result => {
      // Loop over each item
      result.items.forEach(ref => {
        console.log(ref.fullPath);
      });

      if (result.nextPageToken) {
        return listFilesAndDirectories(reference, result.nextPageToken);
      }

      return Promise.resolve();
    });
  };

  useEffect(() => {
    // RNFB VERSION
    const reference = storage().ref();
    listFilesAndDirectories(reference, '').then(() => {
      console.log('Finished listing');
    });
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
  }, []);

  const getData = async () => {
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
    //   const usersCollection = await firestore().collection('photos').get();
    //   console.log('COLLECTION AUTH', usersCollection.docs[0].data());
    //   console.log('COLLECTION AUTH 2', usersCollection.docs[1].data());
    // } catch (err) {
    //   console.log('ERROR', err);
    // }
  };

  async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
      const res = await Geolocation.requestAuthorization('whenInUse');
      console.log('Res', res);
      // Geolocation.requestAuthorization();
      // IOS permission request does not offer a callback :/
      return null;
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
          console.log('You can use Geolocation');
          return true;
        } else {
          console.log('You cannot use Geolocation');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  }

  const getLocation = async () => {
    // appStorage();

    await requestLocationPermission();
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        console.log({position});
        setLocation([position.coords.latitude, position.coords.longitude]);
        return [position.coords.latitude, position.coords.longitude];
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        setLocation([]);
        return;
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSelectPicture = async () => {
    // dispatch(setPickerOpen(true));
    const options: CameraOptions = {
      // includeExtra: true,
      mediaType: 'photo',
      // saveToPhotos: true,
      // title: '',
      // takePhotoButtonTitle: '写真を撮る',
      // chooseFromLibraryButtonTitle: 'ギャラリーから写真を選択する',
      // cancelButtonTitle: 'キャンセル',
      // storageOptions: {
      //   cameraRoll: true,
      //   waitUntilSaved: true,
      // },
      // maxWidth: 256,
      // maxHeight: 256,
      // allowsEditing: true,
      // noData: true,
    };
    await launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error Code: ', response.errorCode);
      } else if (response.errorMessage) {
        console.log('ImagePicker Error Message: ', response.errorMessage);
      } else {
        //stackoverflow.com/questions/68854533/image-wont-upload-to-firebase-storage-bucket-in-react-native
        // storage().ref(response.assets[0].fileName);
        // const list = async () => {
        //   const listRes = await reference.list();
        //   console.log('LIST', listRes);
        // };
        // list();

        const uploadImage = async () => {
          const uri = response.assets[0].uri;
          let task;

          if (uri) {
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const uploadUri = uri;
            setUploading(true);
            // setTransferred(0);
            task = storage().ref(filename).putFile(uploadUri);
            // set progress state
            task.on('state_changed', taskSnapshot => {
              console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
              );

              // console.log(
              //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes) *
              //     10000,
              // );
            });
            task.then(async () => {
              console.log('Image uploaded to bucket');
              const url = await storage().ref(filename).getDownloadURL();
              console.log('Image download URL: ', url);
              setImageUrl(url);
            });
          }
          try {
            await task;
          } catch (error) {
            console.error('Upload Error:', error);
          }
          setUploading(false);
          // Alert.alert(
          //   'Photo uploaded!',
          //   'Your photo has been uploaded to Firebase Cloud Storage!',
          // );
          // setImage('');
        };
        uploadImage();

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
        //         console.log('DLDLDLDL', url),
        //       );
        //     })
        //     .catch(error => console.log('ERRRRRR', error));
        // };

        // getLocation();
        // console.log('Location: ', location);
        const input: PhotoType = {
          title: 'My first photo',
          description: 'Tasty ramen shop',
          category: 'Bangkok',
          location,
        };
        // addPhoto(uid, input);
        // setImageResponse(response);
        // setModal(true);
      }
    });
  };

  const logOut = async () => {
    try {
      await auth().signOut();
      console.log('Signed out!');
    } catch (error) {
      console.log('Log Out Error', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Button title="Log out" onPress={logOut} />
        <Button title="Take phot" onPress={() => handleSelectPicture()} />
        <View
          style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
          <Button title="Get Location" onPress={getLocation} />
        </View>
        {location && (
          <>
            <Text>Latitude: {location[0]} </Text>
            <Text>Longitude: {location[1]} </Text>
          </>
        )}
        {/* <Button title="Graph" onPress={() => navigation.navigate('Graph')} /> */}
        <Button title="GET DATA" onPress={getData} />
        <FastImage
          style={{width: 200, height: 200}}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/tago-d37a7.appspot.com/o/DuchessAgain.jpeg?alt=media&token=239ed376-3e18-4b0a-92ca-44c825f06b06',
            // headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <FastImage
          style={{width: 200, height: 200}}
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/tago-d37a7.appspot.com/o/rn_image_picker_lib_temp_61f4d80f-4de6-4deb-88ff-9b0801eabaf7.jpg?alt=media&token=9d174cc4-2825-4496-8d78-ffbb281f8894',
            // headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        {/* <FastImage
            style={listCardStyles.image}
            source={{
              uri: transformFunc(item.otherPerson.profilePic!, policy, signature),
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          /> */}
      </View>
      {/* <Blob /> */}
    </SafeAreaView>
  );
}

export default Home;
