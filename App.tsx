/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {firebaseConfig} from './src/firebaseConfig';
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import {GOOGLE_SIGN_IN_WED_CLIENT_ID} from '@env';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/RouteNavigation';
import AuthStack from './src/stacks/Auth/AuthStack';
import useUserStore from './src/store/useUserStore';
import {NativeBaseProvider} from 'native-base';
import TabScreen from './src/TabScreen';
import {WithSplashScreen} from './src/screens/SplashScreen';
import {requestLocationPermission} from './src/utils';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

const app = initializeApp(firebaseConfig);
export const appStorage = getStorage(app);

GoogleSignin.configure({
  webClientId: GOOGLE_SIGN_IN_WED_CLIENT_ID,
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const {setUser, user, setUserLocation} = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  useEffect(() => {
    setIsAppReady(true);
    let watchID: number = 0;

    const getLocation = async () => {
      await requestLocationPermission();

      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          return [0, 0];
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
      try {
        watchID = Geolocation.watchPosition(
          (position: GeoPosition) => {
            console.log('Watch Location:', position);
            setUserLocation([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            return;
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setUserLocation([]);
            return;
          },
          {
            accuracy: {
              android: 'high',
              ios: 'best',
            },
            enableHighAccuracy: true,
            interval: 3000,
            fastestInterval: 3000,
            distanceFilter: 5,
          },
        );
        // console.log('WATCH ID', watchID);
      } catch (error) {
        console.log('Location Watch Error', error);
      }
    };
    getLocation();
    // console.log('WATCH ID', watchID);
    return () => {
      // FIXME: watchID not being returned in above function
      // stopObserving works somwtimes but throws yellow box error
      Geolocation.clearWatch(watchID);
      Geolocation.stopObserving();
    };
  }, [setUserLocation]);

  // Handle user state changes
  function onAuthStateChanged(currentUser: any) {
    setUser(currentUser);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <NavigationContainer ref={navigationRef}>
        <NativeBaseProvider>
          {!user ? <AuthStack /> : <TabScreen />}
        </NativeBaseProvider>
      </NavigationContainer>
    </WithSplashScreen>
  );
};

export default App;
