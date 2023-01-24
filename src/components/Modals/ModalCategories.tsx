import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
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
import InputForm from '../Inputs/InputForm';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';
import MainButton from '../Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import DropDownPicker, {
  ItemType,
  ValueType,
} from 'react-native-dropdown-picker';
import {categoryValues} from '../../utils/settings';
import FormError from '../Erorrs/FormError';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';
import {useNavigation} from '@react-navigation/native';
import ModalConfirmDeletePhoto from './ModalConfirmDeletePhoto';
import InputTextArea from '../Inputs/InputTextArea';

interface Props {
  modalBool: boolean;
  modalClose: () => void;
}

function ModalCategories(props: Props) {
  const navigation: NativeStackNavigationProp<PhotosParamList> =
    useNavigation();
  const {modalBool, modalClose} = props;
  const {categories, upLoading, editPhoto, addCategory} = usePhotosStore();
  const [categoryValue, setCategoryValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<ItemType<ValueType>>();
  const [editOpen, setEditOpen] = useState<boolean>(false);
  console.log('Selected', selectedItem);
  // const [selectedLanguage, setSelectedLanguage] = useState();
  const [open, setOpen] = useState(false);
  const [categoryAlreadyExists, setCategoryAlreadyExists] =
    useState<boolean>(false);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [categoryList, setCategoryList] =
    useState<{label: string; value: string}[]>();
  console.log('CATEGORIES', categoryList);

  const {user} = useUserStore();

  const [modalConfirm, setModalConfirm] = useState(false);
  const modalConfirmClose = () => {
    setModalConfirm(false);
  };
  const modalConfirmOpen = () => {
    setModalConfirm(true);
  };

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

  const editInfoValidationSchema = Yup.object().shape({
    title: Yup.string().max(30, 'Maximun 30 characters'),
    description: Yup.string().max(250, 'Maximun 250 characters'),
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
      {categoryList && (
        <Modal visible={modalBool} animationType="fade" transparent={true}>
          <SafeAreaView style={styles.safeView}>
            <View style={styles.modalView}>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  categories: categories,
                  category: '',
                  newCategory: '',
                }}
                validationSchema={editInfoValidationSchema}
                onSubmit={values => {
                  const input = {
                    categories: values.categories,
                  };
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
                    <Text style={styles.label}>Categories</Text>
                    <DropDownPicker
                      textStyle={{
                        fontSize: theme.fontSizes.medium,
                      }}
                      style={styles.dropDown}
                      listMode="SCROLLVIEW"
                      placeholder="Select a Category"
                      open={open}
                      value={categoryList[0] || categoryValues.default}
                      items={categoryList!}
                      setOpen={setOpen}
                      setValue={setCategoryValue}
                      onSelectItem={item => {
                        console.log(item);

                        setSelectedItem(item);
                        setEditOpen(true);
                      }}
                      // setItems={handleChange('category')}
                    />
                    {editOpen && (
                      <>
                        <InputForm
                          label="New Category"
                          value={(selectedItem?.value as string) || ''}
                          placeholder={
                            (selectedItem?.label as string) ||
                            categoryList[0].value
                          }
                          onChangeText={e =>
                            setSelectedItem({
                              label: selectedItem?.label,
                              value: e,
                            })
                          }
                          onBlur={handleBlur('newCategory')}
                          cancel={true}
                          cancelClose={setEditOpen}
                          setSelectedItem={setSelectedItem}
                          handleReset={handleReset}
                        />
                        <FormError
                          touched={touched.newCategory}
                          message={errors.newCategory}
                          spaceFiller={false}
                        />
                      </>
                    )}
                    {addNewCategory && (
                      <>
                        <InputForm
                          label="New Category"
                          value={values.newCategory}
                          placeholder="Bangkok"
                          onChangeText={handleChange('newCategory')}
                          onBlur={handleBlur('newCategory')}
                          cancel={true}
                          cancelClose={setAddNewCategory}
                          // setCategoryValue={setCategoryValue}
                          handleReset={handleReset}
                        />
                        <FormError
                          touched={touched.newCategory}
                          message={errors.newCategory}
                          spaceFiller={false}
                        />
                      </>
                    )}

                    {/* From the double check in store */}
                    {categoryAlreadyExists && (
                      <View>
                        <Text style={styles.error}>
                          Category already exists
                        </Text>
                      </View>
                    )}

                    {/* <InputTextArea
                      label="Description (optional)"
                      value={values.description}
                      placeholder="Cheap Otoro"
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                    />
                    <FormError
                      touched={touched.description}
                      message={errors.description}
                      spaceFiller={false}
                    /> */}

                    <MainButton
                      style={{marginTop: 30}}
                      onPress={() => {
                        handleSubmit();
                      }}
                      text="Edit info"
                      disabled={upLoading}
                      spinner={upLoading}
                    />
                    <MainButton
                      style={{marginTop: 10}}
                      onPress={() => {
                        handleReset();
                        setCategoryAlreadyExists(false);
                        setAddNewCategory(false);
                        // setCategoryValue(categoryValues.default);
                        modalClose();
                      }}
                      text="Cancel"
                      disabled={upLoading}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 25,
    marginBottom: 20,
    backgroundColor: 'white',
    height: 100,
    width: 100,
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
    fontSize: theme.fontSizes.large,
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

export default ModalCategories;
