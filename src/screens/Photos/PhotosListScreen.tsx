import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {ItemType, ValueType} from 'react-native-dropdown-picker';
import CardPhotoList from '../../components/Cards/CardPhotoList';
import DropDown from '../../components/Selects/DropDown';
import usePhotosStore from '../../store/usePhotosStore';
import theme from '../../theme';
import {categoryValues} from '../../utils/settings';

function PhotosListScreen() {
  const {photos, categories} = usePhotosStore();
  const [categoryValue, setCategoryValue] = useState('All Categories');
  const [selectedItem, setSelectedItem] = useState<ItemType<ValueType>>({
    label: 'All Categories',
    value: 'All Categories',
  });
  const [open, setOpen] = useState(false);
  const [photoList, setPhotoList] = useState(photos);
  const [categoryList, setCategoryList] =
    useState<{label: string; value: string}[]>();

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
      {label: 'All Categories', value: 'All Categories'},
      {label: 'Want To Go', value: categoryValues.default},
      ...categoryMap,
    ]);
  }, [categories]);

  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.value === 'All Categories') {
        setPhotoList(photos);
      } else {
        const filterdByCategory = photos.filter(
          photo => photo.category === selectedItem.value,
        );
        setPhotoList(filterdByCategory);
      }
    }
  }, [selectedItem, photos]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dropDownWrapper}>
        <DropDown
          placeholder="Filter by Category"
          open={open}
          value={categoryValue}
          items={categoryList!}
          setOpen={setOpen}
          setValue={setCategoryValue}
          onSelect={true}
          setSelectedItem={setSelectedItem}
        />
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        data={photoList}
        renderItem={({item}) => <CardPhotoList item={item} />}
        keyExtractor={item => item.ref}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
  },
  dropDownWrapper: {
    marginTop: 30,
    paddingBottom: 15,
    zIndex: 10,
    elevation: 10,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  list: {
    borderRadius: 8,
    marginHorizontal: 15,
    // marginBottom: 50,
  },
  listContent: {
    marginBottom: 50,
    borderRadius: 8,
  },
});

export default PhotosListScreen;
