import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

function SignUp() {
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
  return (
    <SafeAreaView>
      <Button title="Sign Up with Email" onPress={() => emailSignUp()} />
    </SafeAreaView>
  );
}

export default SignUp;
