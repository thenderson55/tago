import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';

function Home() {
  const logOut = async () => {
    try {
      await auth().signOut();
      console.log('Signed out!');
    } catch (error) {
      console.log('Log Out Error', error);
    }
  };
  return (
    <SafeAreaView>
      <Button title="Log out" onPress={logOut} />
    </SafeAreaView>
  );
}

export default Home;
