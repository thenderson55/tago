import React, {useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  ImagePickerResponse,
  CameraOptions,
  launchCamera,
  // launchImageLibrary,
} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
import Blob from './Blob';
import firestore from '@react-native-firebase/firestore';

function Home() {
  const navigation: NativeStackNavigationProp<HomeParamList, 'Graph'> =
    useNavigation();
  const [location, setLocation] = useState<string[]>();
  // const usersCollection2 = firestore()
  //   .collection('photos')
  //   .doc('VpQxGZqBvdupc7vkhRzg');
  // console.log('LOGIN COLLECTION', usersCollection.doc('VpQxGZqBvdupc7vkhRzg'));
  // console.log('AUTH COLLECTION', usersCollection2);
  const addDoc = async () => {
    try {
      const res = await firestore().collection('Users').add({
        name: 'Ada Trump',
        age: 30,
      });
      console.log('Add doc res ID: ', res.id);
      const doc = await firestore().collection('Users').doc(res.id).get();
      console.log('Fetch new doc: ', doc.data());
    } catch (error) {
      console.log('Add error: ', error);
    }
  };

  // const Create = () => {
  //   // MARK: Creating New Doc in Firebase
  //   // Before that enable Firebase in Firebase Console
  //   const myDoc = doc(db, 'MyCollection', 'MyDocument');

  //   // Your Document Goes Here
  //   const docData = {
  //     name: 'iJustine',
  //     bio: 'YouTuber',
  //   };

  //   setDoc(myDoc, docData)
  //     // Handling Promises
  //     .then(() => {
  //       // MARK: Success
  //       alert('Document Created!');
  //     })
  //     .catch(error => {
  //       // MARK: Failure
  //       alert(error.message);
  //     });
  // };

  const getData = async () => {
    try {
      const usersCollection = await firestore().collection('photos').get();
      console.log('COLLECTION AUTH', usersCollection.docs[0].data());
      console.log('COLLECTION AUTH 2', usersCollection.docs[1].data());
    } catch (err) {
      console.log('ERROR', err);
    }
  };
  getData();

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
    await requestLocationPermission();
    Geolocation.getCurrentPosition(
      (position: any) => {
        console.log({position});
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        setLocation([]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSelectPicture = async () => {
    // dispatch(setPickerOpen(true));
    const options: CameraOptions = {
      // includeExtra: true,
      mediaType: 'photo',
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
    await launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        // dispatch(setPickerOpen(false));
      } else if (response.errorCode) {
        console.log('ImagePicker Error Code: ', response.errorCode);
        // dispatch(setPickerOpen(false));
      } else if (response.errorMessage) {
        console.log('ImagePicker Error Message: ', response.errorMessage);
        // dispatch(setPickerOpen(false));
      } else {
        console.log('Response:', response);

        console.log('Response Assets:', response.assets);
        getLocation();
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
        <Button title="Graph" onPress={() => navigation.navigate('Graph')} />
        <Button title="Add" onPress={addDoc} />
      </View>
      <Blob />
    </SafeAreaView>
  );
}

export default Home;
