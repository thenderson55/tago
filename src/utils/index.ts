import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

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

export const errorResponseMessage = (error: {code: string}) => {
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
