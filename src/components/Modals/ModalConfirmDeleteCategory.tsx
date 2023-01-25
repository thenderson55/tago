import React, {Dispatch, SetStateAction} from 'react';
import {User} from 'firebase/auth';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import usePhotosStore from '../../store/usePhotosStore';
import theme from '../../theme';
import MainButton from '../Buttons/MainButton';

interface Props {
  modalBool: boolean;
  modalConfirmClose: () => void;
  user: User;
  category: string;
  setEditCurrentCategory: Dispatch<SetStateAction<boolean>>;
}

function ModalConfirmDeleteCategory(props: Props) {
  const {modalBool, user, category, modalConfirmClose, setEditCurrentCategory} =
    props;
  const {loading, deleteCategory, deletePhoto} = usePhotosStore();
  return (
    <Modal visible={modalBool} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.safeView}>
        <View style={styles.modalView}>
          <View style={styles.textWrapper}>
            <Text style={styles.header}>
              Are you sure you want to delete this category?
            </Text>
            <Text style={styles.subHeader}>
              All photos using this category will be deleted as well.
            </Text>
          </View>
          <MainButton
            style={styles.button}
            onPress={() => {
              modalConfirmClose();
            }}
            text="Cancel"
            disabled={loading}
          />
          <MainButton
            style={styles.button}
            onPress={() =>
              user &&
              category &&
              deleteCategory(
                user,
                category,
                deletePhoto,
                modalConfirmClose,
                setEditCurrentCategory,
              )
            }
            text="Delete"
            disabled={loading}
            spinner={loading}
          />
          {/* <ResponseError message={errorAccount} /> */}
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
  textWrapper: {
    width: '90%',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: theme.colors.black,
    // backgroundColor: 'white',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: theme.colors.black,
    // backgroundColor: 'white',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: theme.margins.screen,
    // width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

export default ModalConfirmDeleteCategory;
