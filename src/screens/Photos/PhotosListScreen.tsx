import React from 'react';
import {
  FlatList,
  // RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import CardPhotoList from '../../components/Cards/CardPhotoList';
import usePhotosStore from '../../store/usePhotosStore';

function PhotosListScreen() {
  const {photos} = usePhotosStore();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        // style={styles.list}
        // contentContainerStyle={styles.listContent}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        data={photos}
        renderItem={({item}) => <CardPhotoList item={item} />}
        keyExtractor={item => item.ref}
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
