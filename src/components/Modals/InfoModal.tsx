import React, {useEffect, useState} from 'react';
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
// import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {categoryValues} from '../../utils/settings';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
  imageResponse: ImagePickerResponse;
  location: number[];
}

function InfoModal(props: Props) {
  const {modalBool, modalClose, imageResponse, location} = props;
  const {addCategory, addPhoto, transferProgress, categories} =
    usePhotosStore();
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [open, setOpen] = useState(false);
  const [categoryAlreadyExists, setCategoryAlreadyExists] =
    useState<boolean>(false);
  const [categoryValue, setCategoryValue] = useState(categoryValues.default);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [categoryList, setCategoryList] =
    useState<{label: string; value: string}[]>();
  const {user} = useUserStore();

  useEffect(() => {
    const categoryMap = categories.map(item => {
      return {label: item, value: item};
    });
    console.log('CM', categoryMap);
    setCategoryList([
      {label: 'Want To Go', value: 'Want To Go'},
      ...categoryMap,
      {label: '+ Add New Category', value: '+ Add New Category'},
    ]);
  }, [categories]);

  useEffect(() => {
    categoryValue === categoryValues.addNew && setAddNewCategory(true);
  }, [categoryValue]);

  return (
    <>
      <Modal visible={modalBool} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.modalView}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                title: '',
                description: '',
                newCategory: '',
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
                  category: values.newCategory,
                  location,
                };
                console.log('INPUT:', input);
                if (
                  values.newCategory === categoryValues.addNew ||
                  values.newCategory === categoryValues.default ||
                  categories.includes(values.newCategory)
                ) {
                  setCategoryAlreadyExists(true);
                  console.log('Already exists!');
                  return;
                } else {
                  addPhoto(
                    user,
                    imageResponse,
                    input,
                    modalClose,
                    addCategory,
                    setCategoryAlreadyExists,
                  );
                }
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
                  {/* <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange('category')}>
                    {categories.map(item => (
                      <Picker.Item
                        label={item.value.toString()}
                        value={item.value.toString()}
                        key={item.value.toString()}
                      />
                    ))}
                  </Picker> */}
                  <Text style={styles.label}>Category</Text>
                  <DropDownPicker
                    style={styles.dropDown}
                    listMode="SCROLLVIEW"
                    placeholder="Select a Category"
                    open={open}
                    value={categoryValue || categoryValues.default}
                    items={categoryList!}
                    setOpen={setOpen}
                    setValue={setCategoryValue}
                    // setItems={handleChange('category')}
                  />
                  {addNewCategory && (
                    <FormInput
                      label="New Category"
                      value={values.newCategory}
                      placeholder="Bangkok"
                      onChangeText={handleChange('newCategory')}
                      onBlur={handleBlur('newCategory')}
                    />
                  )}
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
  dropDown: {
    backgroundColor: 'white',
    color: theme.colors.black,
    borderColor: theme.colors.black,
    borderWidth: 2,
    borderRadius: 15,
    height: theme.sizes.formHeight + 4,
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
