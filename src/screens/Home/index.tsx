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

function Home() {
  const [location, setLocation] = useState<string[]>();

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
        setLocation([position.latitude, position.longitude]);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        setLocation([]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    console.log({location});
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
    <SafeAreaView>
      <Button title="Log out" onPress={logOut} />
      <Button title="Take phot" onPress={() => handleSelectPicture()} />
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: </Text>
      <Text>Longitude: </Text>
    </SafeAreaView>
  );
}

export default Home;
