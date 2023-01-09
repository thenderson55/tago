import React from 'react';
import {
  View,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import theme from '../../theme';
import InputForm from '../Inputs/InputForm';
import MainButton from '../Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import FormError from '../Erorrs/FormError';
import {updateUsernameValidationSchema} from '../../utils/validations';
import ResponseError from '../Erorrs/ResponseError';
import {validatePluginLoadResult} from 'snowpack/lib/cjs/config';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
}

function ModalUsername(props: Props) {
  const {modalBool, modalClose} = props;
  const {updateUsername, loading, errorAccount, user} = useUserStore();

  return (
    <>
      {user && (
        <Modal visible={modalBool} animationType="fade" transparent={true}>
          <SafeAreaView style={styles.safeView}>
            <View style={styles.modalView}>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  userName: user.displayName,
                  newUsername: '',
                }}
                validationSchema={updateUsernameValidationSchema}
                onSubmit={values => {
                  const newUsername = values.newUsername.trim();
                  updateUsername(newUsername, modalClose);
                }}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  // handleReset,
                }) => (
                  <ScrollView>
                    <InputForm
                      onChangeText={handleChange('newUsername')}
                      onBlur={handleBlur('newUsername')}
                      value={values.newUsername}
                      placeholder={values.userName!}
                      label="New Username"
                    />
                    <FormError
                      touched={touched.newUsername}
                      message={errors.newUsername}
                    />
                    <MainButton
                      style={{marginTop: 25}}
                      onPress={() => handleSubmit()}
                      disabled={loading}
                      spinner={loading}
                      text="Update Username">
                      <ResponseError message={errorAccount} />
                    </MainButton>
                    <MainButton
                      style={styles.button}
                      onPress={() => {
                        modalClose();
                      }}
                      text="Cancel"
                      disabled={loading}
                    />
                  </ScrollView>
                )}
              </Formik>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: theme.margins.screen,
    paddingTop: theme.margins.largeTop,
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    fontSize: 12,
    height: 20,
    marginTop: 5,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

export default ModalUsername;
