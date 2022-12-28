import {Text} from 'native-base';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';

const getItem = (data: PhotoType[], index: number) => {
  // console.log('getItem data', data);
  console.log('getItem index', index);
  return {
    id: Math.random().toString(12).substring(0),
    category: data[index].category,
    // created: data[index].created,
  };
};

const Item = ({item}: {item: PhotoType}) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.category}</Text>
    </View>
  );
};

function PhotosListScreen() {
  const {photos} = usePhotosStore();
  const getItemCount = () => photos.length;

  console.log('PhotosListScreen photos', photos);
  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedList
        data={photos}
        initialNumToRender={4}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
});

export default PhotosListScreen;
