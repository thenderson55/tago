import React, {useEffect, useState} from 'react';
import {View, ScrollView, SafeAreaView, StyleSheet, Text} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import theme from '../../theme';
import InputForm from '../../components/Inputs/InputForm';
import usePhotosStore from '../../store/usePhotosStore';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import {ItemType, ValueType} from 'react-native-dropdown-picker';
import {categoryValues} from '../../utils/settings';
import FormError from '..//../components/Erorrs/FormError';
import {useNavigation} from '@react-navigation/native';
import ModalConfirmDeleteCategory from '../../components/Modals/ModalConfirmDeleteCategory';
import DropDown from '../../components/Selects/DropDown';

function EditCategoriesScreen() {
  useNavigation();
  const {categories, editCategory, loading, addCategory} = usePhotosStore();
  const [categoryValue, setCategoryValue] = useState(categoryValues.default);
  const [selectedItem, setSelectedItem] = useState<ItemType<ValueType>>({
    label: 'Want To Go',
    value: categoryValues.default,
  });
  const [editCurrentCategory, setEditCurrentCategory] =
    useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [categoryAlreadyExists, setCategoryAlreadyExists] =
    useState<boolean>(false);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [categoryList, setCategoryList] =
    useState<{label: string; value: string}[]>();

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
                editCurrentCategory
                  ? editCategory(
                      user,
                      selectedItem?.label as string,
                      selectedItem?.value as string,
                      setEditCurrentCategory,
                    )
                  : addNewCategory
                  ? addCategory(user, values.newCategory)
                  : null;
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
                  <View style={styles.dropDownWrapper}>
                    <DropDown
                      placeholder="Select a Category"
                      open={open}
                      value={categoryValue}
                      items={categoryList!}
                      setOpen={setOpen}
                      setValue={setCategoryValue}
                      onSelect={true}
                      setEditCurrentCategory={setEditCurrentCategory}
                      setAddNewCategory={setAddNewCategory}
                      setSelectedItem={setSelectedItem}
                    />
                  </View>
                  {editCurrentCategory && (
                    <>
                      <InputForm
                        label="Edit Category"
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
                        // onBlur={handleBlur('newCategory')}
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
                        label="Add New Category"
                        value={values.newCategory}
                        placeholder="Bangkok"
                        onChangeText={handleChange('newCategory')}
                        onBlur={handleBlur('newCategory')}
                        cancel={true}
                        cancelClose={setAddNewCategory}
                        setCategoryValue={setCategoryValue}
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
                      <Text style={styles.error}>Category already exists</Text>
                    </View>
                  )}
                  {(addNewCategory || editCurrentCategory) && (
                    <>
                      <MainButton
                        style={{marginTop: 30}}
                        onPress={() => {
                          handleSubmit();
                        }}
                        text={addNewCategory ? 'Add Category' : 'Edit Category'}
                        disabled={loading}
                        spinner={loading}
                      />
                      {editCurrentCategory && (
                        <MainButton
                          style={{marginTop: 10}}
                          onPress={() => {
                            modalConfirmOpen();
                          }}
                          text="Delete Category"
                          disabled={loading}
                          spinner={loading}
                        />
                      )}
                      <ModalConfirmDeleteCategory
                        modalBool={modalConfirm}
                        modalConfirmClose={modalConfirmClose}
                        user={user}
                        category={selectedItem!.value as string}
                        setEditCurrentCategory={setEditCurrentCategory}
                      />
                    </>
                  )}
                  {(addNewCategory || editCurrentCategory) && (
                    <MainButton
                      style={{marginTop: 10}}
                      onPress={() => {
                        handleReset();
                        setCategoryAlreadyExists(false);
                        setAddNewCategory(false);
                        setEditCurrentCategory(false);
                        setSelectedItem({});
                        setCategoryValue(categoryValues.default);
                      }}
                      text="Cancel"
                      disabled={loading}
                    />
                  )}
                </ScrollView>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
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
    fontSize: theme.fontSizes.label,
    marginTop: theme.margins.mediumTop,
  },
  error: {
    color: 'red',
    fontSize: 12,
    height: 20,
    marginTop: 5,
  },
  dropDownWrapper: {
    marginTop: 30,
    zIndex: 10,
    elevation: 10,
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

export default EditCategoriesScreen;
