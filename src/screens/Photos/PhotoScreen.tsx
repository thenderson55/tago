import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';
// import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

// type Props = {
//   item: PhotoType;
// };

function PhotoScreen() {
  const route: RouteProp<PhotosParamList, 'Photo'> = useRoute();
  const {item} = route.params;
  console.log('PhotoScreen item', item);

  return (
    <View style={styles.container}>
      {item && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View>
            <FastImage
              style={styles.image}
              source={{
                uri: item.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    backgroundColor: theme.colors.white,
    // paddingBottom: 50,
  },
  image: {
    width: '100%',
    height: (Dimensions.get('window').height / 10) * 4,
    overflow: 'hidden',
  },
});

export default PhotoScreen;
