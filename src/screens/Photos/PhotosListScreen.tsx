import {Text} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import usePhotosStore from '../../store/usePhotosStore';

function PhotosListScreen() {
  const {photos} = usePhotosStore();
  console.log('PhotosListScreen photos', photos);
  return (
    <View>
      <Text>PhotosListScreen</Text>
    </View>
  );
}

export default PhotosListScreen;
