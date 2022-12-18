import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import theme from '../../theme';
import ConfirmModal from '../../components/Modals/ConfirmModal';

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

  const [confirmModal, setConfirmModal] = useState(false);
  const confirmModalClose = () => {
    setConfirmModal(false);
  };
  const confirmModalOpen = () => {
    setConfirmModal(true);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ConfirmModal modalBool={confirmModal} modalClose={confirmModalClose} />
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
      <MainButton onPress={logOut} text="Log out" />
      {/* <View style={{marginTop: 'auto'}}> */}
      <MainButton
        style={{marginTop: 50}}
        onPress={confirmModalOpen}
        text="Delete user"
        disabled={loading}
      />
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    margin: theme.margins.screen,
  },
});

export default Settings;
