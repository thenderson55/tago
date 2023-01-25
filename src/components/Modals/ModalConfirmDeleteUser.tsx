import React from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useUserStore from '../../store/useUserStore';
import theme from '../../theme';
import MainButton from '../Buttons/MainButton';
import ResponseError from '../Erorrs/ResponseError';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
}

function ModalConfirmDeleteUser(props: Props) {
  const {modalBool, modalClose} = props;
  const {deleteUser, loading, errorAccount} = useUserStore();
  return (
    <Modal visible={modalBool} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.modalView}>
          <Text style={styles.header}>Are you sure?</Text>
          <MainButton
            style={styles.button}
            onPress={() => {
              modalClose();
            }}
            text="Cancel"
            disabled={loading}
          />
          <MainButton
            style={styles.button}
            onPress={() => deleteUser(modalClose)}
            text="Delete"
            disabled={loading}
            spinner={loading}
          />
          <ResponseError message={errorAccount} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeView: {
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: theme.colors.black,
    // backgroundColor: 'white',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: theme.margins.screen,
    // width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

export default ModalConfirmDeleteUser;
