import React from 'react';
import {StyleSheet, View} from 'react-native';
import DropDownPicker, {
  ItemType,
  ValueType,
} from 'react-native-dropdown-picker';
import usePhotosStore from '../../store/usePhotosStore';
import theme from '../../theme';
import {categoryValues} from '../../utils/settings';

interface Props {
  value: string;
  placeholder: string;
  items: {
    label: string;
    value: string;
  }[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSelect: boolean;
  setSelectedItem?: React.Dispatch<React.SetStateAction<ItemType<ValueType>>>;
  setEditCurrentCategory?: React.Dispatch<React.SetStateAction<boolean>>;
  setAddNewCategory?: React.Dispatch<React.SetStateAction<boolean>>;
}

function DropDown(props: Props) {
  const {
    value,
    placeholder,
    items,
    open,
    setOpen,
    setValue,
    onSelect,
    setSelectedItem,
    setEditCurrentCategory,
    setAddNewCategory,
  } = props;

  const {photos} = usePhotosStore();
  const filterByCategory = (category: string) => {
    return photos.filter(photo => photo.category === category);
  };

  return (
    <DropDownPicker
      textStyle={{
        fontSize: theme.fontSizes.medium,
      }}
      style={styles.dropDown}
      listMode="SCROLLVIEW"
      placeholder={placeholder}
      open={open}
      value={value}
      items={items!}
      setOpen={setOpen}
      setValue={setValue}
      onSelectItem={item => {
        if (onSelect) {
          if (item.value === '+ Add New Category') {
            setEditCurrentCategory && setEditCurrentCategory(false);
            setAddNewCategory && setAddNewCategory(true);
          } else if (item.value === categoryValues.default) {
            setEditCurrentCategory && setEditCurrentCategory(false);
            setAddNewCategory && setAddNewCategory(false);
            setSelectedItem && setSelectedItem(item);
          } else {
            setAddNewCategory && setAddNewCategory(false);
            setEditCurrentCategory && setEditCurrentCategory(true);
            setSelectedItem && setSelectedItem(item);
          }
        } else {
          return;
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: 'white',
    color: theme.colors.black,
    borderColor: theme.colors.black,
    borderWidth: 2,
    borderRadius: 15,
    height: theme.sizes.formHeight + 4,
    fontSize: theme.fontSizes.large,
  },
});
export default DropDown;
