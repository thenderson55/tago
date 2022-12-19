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
import FormInput from '../Inputs/FormInput';
import {ImagePickerResponse} from 'react-native-image-picker';
import MainButton from '../Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import FormError from '../Erorrs/FormError';
import {updateEmailValidationSchema} from '../../utils/validations';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
}

function ModalEmail(props: Props) {
  const {modalBool, modalClose} = props;
  const {updateEmail, loading} = useUserStore();

  return (
    <>
      <Modal visible={modalBool} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.modalView}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                newEmail: '',
              }}
              validationSchema={updateEmailValidationSchema}
              onSubmit={values => {
                const newEmail = values.newEmail.trim();
                updateEmail(newEmail, modalClose);
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
                  <FormInput
                    onChangeText={handleChange('newEmail')}
                    onBlur={handleBlur('newEmail')}
                    value={values.newEmail}
                    placeholder="e.g tago@tago.com"
                    label="Email"
                  />
                  <FormError
                    touched={touched.newEmail}
                    message={errors.newEmail}
                  />
                  <MainButton
                    style={{marginTop: 25}}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                    spinner={loading}
                    text="Update Email"
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 25,
    marginBottom: 20,
    backgroundColor: 'white',
    height: 100,
    width: 100,
    // marginVertical: 20,
    // alignSelf: "center",
    // fontFamily: Rounded mc+1
  },
  label: {
    color: theme.colors.black,
    marginBottom: 9,
    fontSize: theme.fontSizes.small,
    marginTop: theme.margins.mediumTop,
  },
  error: {
    color: 'red',
    fontSize: 12,
    height: 20,
    marginTop: 5,
  },
  dropDown: {
    backgroundColor: 'white',
    color: theme.colors.black,
    borderColor: theme.colors.black,
    borderWidth: 2,
    borderRadius: 15,
    height: theme.sizes.formHeight + 4,
  },
  modalView: {
    backgroundColor: 'white',
    // alignItems: 'center',
    paddingHorizontal: theme.margins.screen,
    width: '100%',
    height: '100%',
    // padding: theme.screenPadding,
  },
  close: {
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    justifyContent: 'center',
  },
  resetWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  reset: {
    marginTop: 16,
    // borderBottomColor: theme.black,
    borderBottomWidth: 1,
    marginBottom: 50,
    paddingBottom: 4,
  },
  resetText: {
    fontSize: 14,
    // color: theme.black,
    textAlign: 'center',
  },
});

export default ModalEmail;
