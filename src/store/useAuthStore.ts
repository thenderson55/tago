import create from 'zustand';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

// import {FIREBASE_AUTH_DOMAIN} from '@env';
// FIXME: Google sign in not working on iOS for now - need to investigate
GoogleSignin.configure({
  webClientId:
    '969588173065-g4qjpcnmftjr01jlvsu9u0uicdiem8b8.apps.googleusercontent.com',
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

export interface AuthState {
  loading: boolean;
  error: string;
  loginError: string;
  emailLogin: (email: string, password: string) => void;
  emailSignUp: (
    values: {username: string; email: string; password: string},
    addUser: Function,
  ) => void;
  onGoogleButtonPress: () => Promise<
    FirebaseAuthTypes.UserCredential | undefined
  >;
  onFacebookButtonPress: () => Promise<
    FirebaseAuthTypes.UserCredential | undefined
  >;
  logOut: () => void;
}

const initialState = {
  loading: false,
  error: '',
  loginError: '',
};

const useAuthStore = create<AuthState>(set => ({
  loading: initialState.loading,
  error: initialState.error,
  loginError: initialState.loginError,

  emailSignUp: async (values, addUser) => {
    set(state => ({...state, loading: true}));
    try {
      const res = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      console.log('User account created & signed in!');
      console.log('New ID: ', res.user.uid);
      // TODO: Add modal to await verification? Better to use the email link
      // console.log('FIREBASE_AUTH_DOMAIN: ', FIREBASE_AUTH_DOMAIN);
      //  await auth().currentUser!.sendEmailVerification({
      //   handleCodeInApp: true,
      //   url: `https://${FIREBASE_AUTH_DOMAIN}`,
      // });
      await res.user.updateProfile({
        displayName: values.username,
      });

      addUser(res.user.uid, values.username);
    } catch (error: any) {
      let errorMessage = '';

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
      set(state => ({
        ...state,
        error: errorMessage,
        loading: false,
      }));
      console.error(error);
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  emailLogin: async (email, password) => {
    set(state => ({...state, loading: true}));
    try {
      const res = await auth().signInWithEmailAndPassword(email, password);
      console.log('Zustand user account signed in!', res);
    } catch (error: any) {
      console.log('Zustand error: ', error);
      let errorMessage = '';
      if (error.code === 'auth/user-not-found') {
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
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
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'That password is invalid!';
        console.log(errorMessage);
      }
      if (error.code === 'auth/too-many-requests') {
        errorMessage =
          'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
        console.log(errorMessage);
      }
      set(state => ({
        ...state,
        loginError: errorMessage,
        loading: false,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  onFacebookButtonPress: async () => {
    // Attempt login with permissions
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      return auth().signInWithCredential(facebookCredential);
    } catch (error: any) {
      console.log('error: ', error);
    }
  },

  onGoogleButtonPress: async () => {
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
  },

  logOut: async () => {
    try {
      await auth().signOut();
      console.log('Signed out!');
      set(state => ({
        ...state,
        loginError: '',
        loading: false,
      }));
    } catch (error) {
      console.log('Log Out Error', error);
    }
  },
}));

export default useAuthStore;
