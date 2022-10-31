import React from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '969588173065-g4qjpcnmftjr01jlvsu9u0uicdiem8b8.apps.googleusercontent.com',
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

function Login() {
  const emailSignUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(
        'jane.doe@example.com',
        '12345qwerty',
      );
      console.log('User account created & signed in!');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(
          'There is no user record corresponding to this identifier. The user may have been deleted.',
        );
      }
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    }
  };

  const emailLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(
        'jane.doe@example.com',
        '12345qwerty',
      );
      console.log('User account signed in!');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(
          'There is no user record corresponding to this identifier. The user may have been deleted.',
        );
      }
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <SafeAreaView>
      <Button title="Email Sign-In" onPress={() => emailLogin()} />
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      <Button title="Sign Up with Email" onPress={() => emailSignUp()} />
    </SafeAreaView>
  );
}

export default Login;
