import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  VirtualizedList,
} from 'react-native';
import CardPhotoList from '../../components/Cards/CardPhotoList';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';

const getItem = (data: PhotoType[], index: number) => {
  // console.log('getItem data', data);
  return {
    id: Math.random().toString(12).substring(0),
    category: data[index].category,
    title: data[index].title,
    description: data[index].description,
    url: data[index].url,
    location: data[index].location,
    ref: data[index].ref,
    created: data[index].created,
  };
};

function PhotosListScreen() {
  const {photos} = usePhotosStore();
  const getItemCount = () => photos.length;

  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedList
        data={photos}
        initialNumToRender={4}
        renderItem={({item}) => <CardPhotoList item={item} />}
        keyExtractor={item => item.ref}
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
});

export default PhotosListScreen;
