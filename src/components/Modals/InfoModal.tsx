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
import * as Yup from 'yup';
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
import FormError from '../Erorrs/FormError';

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
    // Remove the default "Want To Go" since will add to the top
    const filterd = categories.filter(item => {
      return item !== categoryValues.default;
    });

    // Map to match package data structure
    const categoryMap = filterd.map(item => {
      return {label: item, value: item};
    });

    setCategoryList([
      {label: 'Want To Go', value: categoryValues.default},
      ...categoryMap,
      {label: '+ Add New Category', value: '+ Add New Category'},
    ]);
  }, [categories]);

  useEffect(() => {
    // Add the input fied for a new categiry if they select the addNew category
    categoryValue === categoryValues.addNew && setAddNewCategory(true);
  }, [categoryValue]);

  const addInfoValidationSchema = Yup.object().shape({
    title: Yup.string().max(30, 'Maximun 30 characters'),
    description: Yup.string().max(30, 'Maximun 250 characters'),
    newCategory: Yup.string().test({
      message: 'Category already exists',
      test: value => {
        // Check if new category input matches the two default ones
        // or any ones from the db
        const categoresToLowercase = categories.map(item => {
          return item.toLowerCase();
        });
        if (value) {
          if (
            value.toLowerCase() === categoryValues.addNew.toLowerCase() ||
            value.toLowerCase() === categoryValues.default.toLowerCase() ||
            categoresToLowercase.includes(value.toLowerCase())
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    }),
  });

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
              validationSchema={addInfoValidationSchema}
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

                addPhoto(
                  user,
                  imageResponse,
                  input,
                  modalClose,
                  addCategory,
                  setCategoryAlreadyExists,
                );
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
                  <FormError
                    touched={touched.newCategory}
                    message={errors.newCategory}
                    spaceFiller={false}
                  />

                  {/* From the double check in store */}
                  {categoryAlreadyExists && (
                    <View>
                      <Text style={styles.error}>Category already exists</Text>
                    </View>
                  )}

                  <FormInput
                    label="Title"
                    value={values.title}
                    placeholder="Sushi"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                  />
                  <FormError
                    touched={touched.title}
                    message={errors.title}
                    spaceFiller={false}
                  />

                  <FormInput
                    label="Description"
                    value={values.description}
                    placeholder="Cheap Otoro"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                  />
                  <FormError
                    touched={touched.description}
                    message={errors.description}
                    spaceFiller={false}
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
                      setCategoryAlreadyExists(false);
                      setAddNewCategory(false);
                      setCategoryValue(categoryValues.default);
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
