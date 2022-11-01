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
// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/RouteNavigation';
import AuthStack from './src/stacks/Auth/AuthStack';
// import {Text, SafeAreaView} from 'react-native';
import HomeStack from './src/stacks/Home/HomeStack';

GoogleSignin.configure({
  webClientId:
    '969588173065-g4qjpcnmftjr01jlvsu9u0uicdiem8b8.apps.googleusercontent.com',
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  console.log('USER', user);
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

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
    <NavigationContainer ref={navigationRef}>
      {/* <SafeAreaView style={backgroundStyle}> */}
      {!user ? <AuthStack /> : <HomeStack />}
      {/* </SafeAreaView> */}
    </NavigationContainer>
  );
};

export default App;
