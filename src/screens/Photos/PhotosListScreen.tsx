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
import theme from '../../theme';

function PhotosListScreen() {
  const {photos} = usePhotosStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* <View>

      </View> */}
      <FlatList
        // style={styles.list}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: theme.colors.secondary,
  },
  listContent: {
    paddingTop: 15,
    paddingBottom: 50,
  },
});

export default PhotosListScreen;
