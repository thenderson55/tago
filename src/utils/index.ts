import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// @ts-ignore
import Qs from 'qs';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    await Geolocation.requestAuthorization('whenInUse');
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
};

export const firebaseErrorMessage = (error: {code: string}) => {
  let errorMessage;
  if (error.code === 'auth/user-not-found') {
    (errorMessage =
      'There is no user record corresponding to this identifier. The user may have been deleted.'),
      console.log(errorMessage);
  }
  if (error.code === 'auth/email-already-in-use') {
    errorMessage = 'That email address is already in use!';
    console.log(errorMessage);
  }
  if (error.code === 'auth/invalid-email') {
    errorMessage = 'That email address is invalid!';
    console.log(errorMessage);
  }
  if (error.code === 'auth/requires-recent-login') {
    errorMessage =
      'This operation is sensitive and requires recent authentication. Log in again before retrying this request.';
    console.log(errorMessage);
  }
  if (error.code === 'auth/wrong-password') {
    errorMessage = 'That password is invalid!';
    console.log(errorMessage);
  }
  if (error.code === 'auth/too-many-requests') {
    errorMessage =
      'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
    console.log(errorMessage);
  }
  return errorMessage;
};

export const getGoogleMapsPlaceByAutocomplete = (
  place: string,
): Promise<{
  data?: {
    predictions: Array<{
      description: string;
      place_id: string;
      types: Array<string>;
    }>;
  };
  error?: string;
}> =>
  new Promise(res => {
    try {
      const request = new XMLHttpRequest();

      request.open(
        'GET',
        'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
          encodeURIComponent(place) +
          '&' +
          Qs.stringify({
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            types: 'geocode',
          }),
      );

      request.send();

      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status !== 200) {
          res({error: 'status: ' + request.status.toString()});
        }

        const responseJSON = JSON.parse(request.responseText);

        if (responseJSON.status === 'ZERO_RESULTS') {
          res({data: undefined});
        }
        if (responseJSON.status === 'OK') {
          // console.log('responseJSON', responseJSON);
          // To get the place details in component
          // const placeByAutocomplete = async (input: string) => {
          //   const res = await getGoogleMapsPlaceByAutocomplete(input);
          //   console.log('RES', res.data?.predictions);
          // };
          res({data: responseJSON});
        }

        res({error: responseJSON.status});
      };
    } catch (e) {
      console.warn('google places autocomplete catch: ' + e);
      res({error: String(e)});
    }
  });

export const handleSelectPicture = async (
  setImageResponse: (
    value: React.SetStateAction<ImagePickerResponse | undefined>,
  ) => void,
  infoModalOpen: () => void,
) => {
  console.log('handleSelectPicture');
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
    maxWidth: 500,
    maxHeight: 500,
    // allowsEditing: true,
    // noData: true,
  };
  await launchCamera(options, async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error Code: ', response.errorCode);
    } else if (response.errorMessage) {
      console.log('ImagePicker Error Message: ', response.errorMessage);
    } else {
      setImageResponse(response);
      infoModalOpen();
    }
  });
};
