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
import {ImagePickerResponse} from 'react-native-image-picker';
import ProgressBar from 'react-native-progress/Bar';
import usePhotosFacade from '../../facades/usePhotosFacade';
import useUserFacade from '../../facades/useUserFacade';
import {PhotoType} from '../../store/usePhotosStore';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
  imageResponse: ImagePickerResponse;
  location: number[];
}

function InfoModal(props: Props) {
  const {modalBool, modalClose, imageResponse, location} = props;
  const {addPhoto, transferProgress} = usePhotosFacade();
  const {user} = useUserFacade();
  console.log({transferProgress});
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
                const input: PhotoType = {
                  ref:
                    Platform.OS === 'ios'
                      ? imageResponse!.assets![0].fileName!
                      : imageResponse!.assets![0].fileName!.replace(
                          'rn_image_picker_lib_temp_',
                          '',
                        ),
                  title: values.title,
                  description: values.description,
                  category: values.category,
                  location,
                };
                console.log('INPUT:', input);
                // TODO: Close modal
                addPhoto(user, imageResponse, input, modalClose);
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
                    }}>
                    <Text style={styles.resetText}>Add Info</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Formik>
            <ProgressBar progress={transferProgress} width={200} />
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
