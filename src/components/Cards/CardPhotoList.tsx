import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import Moment from 'react-moment';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

function CardPhotoList({item}: {item: PhotoType}) {
  const navigation: NativeStackNavigationProp<PhotosParamList, 'Photo'> =
    useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Photo', {item})}>
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
          <Text style={styles.category}>{item.category}</Text>
          {item.title && <Text style={styles.title}>{item.title}</Text>}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
          <Moment
            unix
            style={styles.date}
            element={Text}
            date={item.created}
            format="DD/MM/YYYY"
          />
        </View>
      </View>
    </TouchableOpacity>
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
    borderRadius: 8,
  },
  img: {
    height: 150,
    width: 150,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  category: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  title: {
    color: theme.colors.black,
  },
  description: {
    color: theme.colors.black,
  },
  date: {
    fontSize: 11,
    marginRight: 5,
    marginTop: 5,
    color: theme.colors.darkGrey,
  },
});

export default CardPhotoList;
