import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import useAuthStore from '../../store/useAuthStore';
import theme from '../../theme';
import ModalConfirm from '../../components/Modals/ModalConfirm';
import ModalEmail from '../../components/Modals/ModalEmail';
import ModalUsername from '../../components/Modals/ModalUsername';
import ModalPassword from '../../components/Modals/ModalPassword';

function Account() {
  const {loading, clearErrors, user} = useUserStore();
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
    clearErrors();
    setModalEmail(false);
  };
  const modalEmailOpen = () => {
    clearErrors();
    setModalEmail(true);
  };

  const [modalUsername, setModalUsername] = useState(false);
  const modalUsernameClose = () => {
    clearErrors();
    setModalUsername(false);
  };
  const modalUsernameOpen = () => {
    clearErrors();
    setModalUsername(true);
  };

  const [modalPassword, setModalPassword] = useState(false);
  const modalPasswordClose = () => {
    clearErrors();
    setModalPassword(false);
  };
  const modalPasswordOpen = () => {
    clearErrors();
    setModalPassword(true);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ModalConfirm modalBool={modalConfirm} modalClose={modalConfirmClose} />
      <ModalEmail modalBool={modalEmail} modalClose={modalEmailClose} />
      <ModalUsername
        modalBool={modalUsername}
        modalClose={modalUsernameClose}
      />
      <ModalPassword
        modalBool={modalPassword}
        modalClose={modalPasswordClose}
      />
      <Text style={styles.text}>Email: {user.email}</Text>
      <MainButton
        onPress={modalEmailOpen}
        text="Update Email"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={modalUsernameOpen}
        text="Update Username"
        disabled={loading}
        spinner={loading}
      />
      <MainButton
        onPress={modalPasswordOpen}
        text="Update Password"
        disabled={loading}
        spinner={loading}
      />
      <MainButton onPress={logOut} text="Log Out" />
      {/* <View style={{marginTop: 'auto'}}> */}
      <MainButton
        style={{marginTop: 50}}
        onPress={modalConfirmOpen}
        text="Delete User"
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
  text: {
    fontSize: theme.fontSizes.medium,
    marginVertical: 10,
  },
});

export default Account;
