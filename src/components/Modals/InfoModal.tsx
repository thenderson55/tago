import React from 'react';
import {
  View,
  Modal,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Formik} from 'formik';
import theme from '../../theme';
import FormInput from '../Inputs/FormInput';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

function InfoModal(props: Props) {
  const {modalBool, modalClose, setTitle, setCategory, setDescription} = props;

  return (
    <>
      <Modal visible={modalBool} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.modalView}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                title: '',
                category: '',
                description: '',
              }}
              // validationSchema={validationSchema}
              onSubmit={values => {
                setTitle(values.title);
                setCategory(values.category);
                setDescription(values.description);
                modalClose();
              }}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              }) => (
                <ScrollView>
                  <FormInput
                    value={values.title}
                    placeholder="Title"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                  />
                  <FormInput
                    value={values.category}
                    placeholder="Category"
                    onChangeText={handleChange('category')}
                    onBlur={handleBlur('category')}
                  />
                  <FormInput
                    value={values.description}
                    placeholder="Description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                  />

                  <TouchableOpacity
                    style={styles.reset}
                    onPress={() => {
                      handleSubmit();
                      modalClose();
                    }}>
                    <Text style={styles.resetText}>Add Info</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

interface Styles {
  header: {};
  modalView: {};
  close: {};
  textContainer: {};
  text: {};
  safeView: {};
  reset: {};
  resetText: {};
  resetWrapper: {};
}

const styles: Styles = StyleSheet.create({
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
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
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

export default InfoModal;
