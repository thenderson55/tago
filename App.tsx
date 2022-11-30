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
import HomeStack from './src/stacks/Home/HomeStack';
import useUserStore from './src/store/useUserStore';
import usePhotosStore from './src/store/usePhotosStore';

const app = initializeApp(firebaseConfig);
export const appStorage = getStorage(app);

GoogleSignin.configure({
  webClientId: GOOGLE_SIGN_IN_WED_CLIENT_ID,
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const {setUser, user} = useUserStore();
  const {fetchCategories} = usePhotosStore();
  const [initializing, setInitializing] = useState(true);
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // Handle user state changes
  function onAuthStateChanged(currentUser: any) {
    setUser(currentUser);
    console.log('UserId: ', currentUser.uid);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    user.uid && fetchCategories(user);
  }, [user, fetchCategories]);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* <SafeAreaView> */}
      {/* <SafeAreaView style={backgroundStyle}> */}
      {!user ? <AuthStack /> : <HomeStack />}
      {/* </SafeAreaView> */}
    </NavigationContainer>
  );
};

export default App;
