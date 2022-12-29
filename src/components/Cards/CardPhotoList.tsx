import React from 'react';
import Moment from 'react-moment';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

function CardPhotoList({item}: {item: PhotoType}) {
  console.log('CardPhotoList item', item);
  return (
    <View style={styles.item}>
      <FastImage
        style={styles.img}
        source={{
          uri: item.url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.category}</Text>
        <Moment
          unix
          style={styles.date}
          element={Text}
          date={item.created}
          format="DD/MM/YYYY"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: theme.colors.white,
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  img: {
    height: 150,
    width: 150,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  title: {
    fontSize: theme.fontSizes.large,
  },
  date: {
    fontSize: 11,
    marginRight: 5,
    color: theme.colors.darkGrey,
  },
});

export default CardPhotoList;
