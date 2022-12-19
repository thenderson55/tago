import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import theme from '../../theme';
import ModalConfirm from '../../components/Modals/ModalConfirm';
import ModalEmail from '../../components/Modals/ModalEmail';
import ModalUsername from '../../components/Modals/ModalUsername';

function Settings() {
  const {loading, updatePassword} = useUserStore();
  const {logOut} = useAuthStore();

  const [modalConfirm, setModalConfirm] = useState(false);
  const modalConfirmClose = () => {
    setModalConfirm(false);
  };
  const modalConfirmOpen = () => {
    setModalConfirm(true);
  };

  const [modalEmail, setModalEmail] = useState(false);
  const modalEmailClose = () => {
    setModalEmail(false);
  };
  const modalEmailOpen = () => {
    setModalEmail(true);
  };
  const [modalUsername, setModalUsername] = useState(false);
  const modalUsernameClose = () => {
    setModalUsername(false);
  };
  const modalUsernameOpen = () => {
    setModalUsername(true);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ModalConfirm modalBool={modalConfirm} modalClose={modalConfirmClose} />
      <ModalEmail modalBool={modalEmail} modalClose={modalEmailClose} />
      <ModalUsername
        modalBool={modalUsername}
        modalClose={modalUsernameClose}
      />
      <MainButton
        onPress={modalEmailOpen}
        text="Update email"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={modalUsernameOpen}
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
        onPress={modalConfirmOpen}
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
