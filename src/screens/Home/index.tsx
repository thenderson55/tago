import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  ImagePickerResponse,
  CameraOptions,
  launchCamera,
  // launchImageLibrary,
} from 'react-native-image-picker';

function Home() {
  const handleSelectPicture = async () => {
    // dispatch(setPickerOpen(true));
    const options: CameraOptions = {
      includeExtra: true,
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
      <Button title="Take photo" onPress={() => handleSelectPicture()} />
    </SafeAreaView>
  );
}

export default Home;
