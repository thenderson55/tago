import React, {useState} from 'react';
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
import {updatePasswordValidationSchema} from '../../utils/validations';
import ResponseError from '../Erorrs/ResponseError';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
}

function ModalPassword(props: Props) {
  const {modalBool, modalClose} = props;
  const {updateEmail, loading, errorAccount} = useUserStore();
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [hidePasswordConfirm, setHidePasswordConfirm] = useState<boolean>(true);

  return (
    <>
      <Modal visible={modalBool} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.modalView}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={updatePasswordValidationSchema}
              onSubmit={values => {
                const newPassword = values.newPassword.trim();
                updateEmail(newPassword, modalClose);
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
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    password={true}
                    secureTextEntry={hidePassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    value={values.newPassword}
                    placeholder="abc123"
                    label="New Password"
                  />
                  <FormError
                    touched={touched.newPassword}
                    message={errors.newPassword}
                  />
                  <InputForm
                    hidePassword={hidePasswordConfirm}
                    setHidePassword={setHidePasswordConfirm}
                    password={true}
                    secureTextEntry={hidePasswordConfirm}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    placeholder="abc123"
                    label="Password Confirmation"
                  />
                  <FormError
                    touched={touched.confirmPassword}
                    message={errors.confirmPassword}
                  />
                  <MainButton
                    style={{marginTop: 25}}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                    spinner={loading}
                    text="Update Password">
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
    paddingVertical: theme.margins.largeTop,
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

export default ModalPassword;
