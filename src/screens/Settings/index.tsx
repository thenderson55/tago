import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import theme from '../../theme';

function Settings() {
  const {
    user,
    deleteUser,
    loading,
    updateEmail,
    updatePassword,
    updateUsername,
  } = useUserStore();
  const {logOut} = useAuthStore();

  return (
    <SafeAreaView style={styles.safeView}>
      <MainButton onPress={logOut} text="Log out" />
      <MainButton
        onPress={() => deleteUser(user)}
        text="Delete user"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={() => updateEmail('hi@hi.com')}
        text="Update email"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={() => updateUsername('Fuck')}
        text="Update username"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={() => updatePassword('12345asdfg')}
        text="Update password"
        disabled={loading}
        spinner={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    margin: theme.margins.screen,
  },
});

export default Settings;
