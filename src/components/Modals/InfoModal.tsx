import React, {useState} from 'react';
import {
  View,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import theme from '../../theme';
import FormInput from '../Inputs/FormInput';
import {ImagePickerResponse} from 'react-native-image-picker';
//@ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';
import MainButton from '../Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
  imageResponse: ImagePickerResponse;
  location: number[];
}
const categories = [
  {label: 'Want to go', value: 'Want to go'},
  {label: 'Favorites', value: 'Favorites'},
  // {name: 'Chicago', id: 3},
  // {name: 'Washington DC', id: 4},
  // {name: 'New York', id: 5},
  // {name: 'San Diego', id: 6},
  // {name: 'Fort Worth', id: 7},
  // {name: 'Houston', id: 8},
  // {name: 'Cleveland', id: 9},
  // {name: 'Pittsburg', id: 10},
  // {name: 'Detroit', id: 11},
  // {name: 'Jacksonville', id: 12},
  // {name: 'Denver', id: 13},
  // {name: 'Columbus', id: 14},
  // {name: 'El Paso', id: 15},
  // {name: 'New Orleans', id: 16},
  // {name: 'Cincinnati', id: 17},
  // {name: 'Nashville', id: 18},
  // {name: 'Miami', id: 19},
  // {name: 'Tampa', id: 20},
  // {name: 'Bakersfield', id: 22},
  // {name: 'Tuscon', id: 23},
  // {name: 'Baltimore', id: 25},
  // {name: 'St Louis', id: 26},
  // {name: 'Las Vegas', id: 27},
  // {name: 'Memphis', id: 28},
  // {name: 'Seatle', id: 29},
  // {name: 'San Fransisco', id: 30},
];

function InfoModal(props: Props) {
  const {modalBool, modalClose, imageResponse, location} = props;
  const {addPhoto, transferProgress} = usePhotosStore();
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const {user} = useUserStore();
  console.log({transferProgress});

  return (
    <>
      <Modal visible={modalBool} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.modalView}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                category: categoryValue || 'Want to go',
                title: '',
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
                  category: categoryValue || 'Want to go',
                  location,
                };
                console.log('INPUT:', input);
                // TODO: Close modal
                // addPhoto(user, imageResponse, input, modalClose);
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
                  <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange('category')}>
                    {categories.map(item => (
                      <Picker.Item
                        label={item.value.toString()}
                        value={item.value.toString()}
                        key={item.value.toString()}
                      />
                    ))}
                  </Picker>
                  <Text style={styles.label}>Category</Text>
                  <DropDownPicker
                    listMode="SCROLLVIEW"
                    open={open}
                    value={categoryValue}
                    items={categories}
                    setOpen={setOpen}
                    setValue={setCategoryValue}
                    // setItems={handleChange('category')}
                  />
                  <FormInput
                    label="Title"
                    value={values.title}
                    placeholder="Sushi"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                  />
                  <FormInput
                    label="Description"
                    value={values.description}
                    placeholder="Cheap Otoro"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                  />

                  <MainButton
                    style={{marginTop: 30}}
                    onPress={() => {
                      handleSubmit();
                    }}
                    text="Add info"
                  />
                  <MainButton
                    style={{marginTop: 10}}
                    onPress={() => {
                      handleReset();
                      modalClose();
                    }}
                    text="Cancel"
                  />
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
  label: {
    color: theme.colors.black,
    marginBottom: 9,
    fontSize: theme.fontSizes.small,
    marginTop: theme.margins.mediumTop,
  },
  modalView: {
    backgroundColor: 'pink',
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

export default InfoModal;
