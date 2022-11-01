import React, {useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Button, SafeAreaView, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import * as Yup from 'yup';
import {Formik} from 'formik';
import FormInput from '../../../components/AuthInputs/FormInput';
import FormError from '../../../components/Erorrs/FormError';

GoogleSignin.configure({
  webClientId:
    '969588173065-g4qjpcnmftjr01jlvsu9u0uicdiem8b8.apps.googleusercontent.com',
  // iosClientId:
  //   '969588173065-69otq7c42vr68uor6eqfjaj607nke2i6.apps.googleusercontent.com',
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter email')
    .required('Valid email address is required'),
  password: Yup.string()
    .min(6, 'Minimum 6')
    .max(30, 'Maximun 30')
    .required('Password is required'),
});

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

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

  const emailLogin = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('User account signed in!');
      setIsLoading(false);
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
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          const trimmedValues = {
            email: values.email.trim(),
            password: values.password.trim(),
          };
          setIsLoading(true);
          emailLogin(trimmedValues.email, trimmedValues.password);
        }}>
        {({
          values,
          errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <View>
            <FormInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="例：tago@tago.com"
              label="Email"
            />
            <FormError message={errors.email} />
            <FormInput
              hidePassword={hidePassword}
              setHidePassword={setHidePassword}
              password={true}
              secureTextEntry={hidePassword}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="例：1245678"
              label="Password"
            />
            <FormError message={errors.password} />
            <Button
              onPress={() => handleSubmit()}
              disabled={isLoading}
              // spinner={isLoading}
              title="Login"
            />
            {/* {isLoading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
          </View>
        )}
      </Formik>

      {/* <Button title="Email Sign-In" onPress={() => emailLogin()} /> */}
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
