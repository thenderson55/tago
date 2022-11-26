import {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

export const useLocation = async (checkPersmissions = false) => {
  const [location, setLocation] = useState<number[]>([0, 0]);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [permissionsError, setPermissionsError] = useState<any>();

  async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
      await Geolocation.requestAuthorization('whenInUse');
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
        console.log('Permission error: ', err);
        setPermissionsError(err);
        return false;
      }
    }
  }
  const getLocation = useCallback(async () => {
    try {
      checkPersmissions && (await requestLocationPermission());
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          console.log('Location got:', position);
          setLocation([position.coords.latitude, position.coords.longitude]);
          return;
        },
        error => {
          // See error code charts below.
          console.log('Location Error', error.code, error.message);
          setErrorMessage(error);
          setLocation([]);
          return;
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.log('Location catch Error ', error);
      setErrorMessage(error);
    }
  }, [checkPersmissions]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {location, errorMessage, permissionsError};
};
