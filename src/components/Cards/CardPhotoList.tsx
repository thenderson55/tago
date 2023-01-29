import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import Moment from 'react-moment';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';
import ImageView from 'react-native-image-viewing';

function CardPhotoList({item}: {item: PhotoType}) {
  const navigation: NativeStackNavigationProp<PhotosParamList> =
    useNavigation();

  const [visible, setIsVisible] = useState(false);
  return (
    <>
      <ImageView
        images={[{uri: item.url}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      {item && (
        <View style={styles.item}>
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <FastImage
              style={styles.img}
              source={{
                uri: item.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => navigation.navigate('Photo', {item})}>
            <View>
              <Text style={styles.category}>{item.category}</Text>
              {item.title && (
                <Text numberOfLines={1} style={styles.title}>
                  {item.title}
                </Text>
              )}
              {item.description && (
                <Text numberOfLines={4} style={styles.description}>
                  {item.description}
                </Text>
              )}
              <Moment
                unix
                style={styles.date}
                element={Text}
                date={item.created}
                format="DD/MM/YYYY"
              />
            </View>
            <View style={styles.mapButton}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate('Map', {
                    photo: item,
                  })
                }>
                <Ionicons
                  name={'enter-outline'}
                  size={40}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: theme.colors.white,
    height: 150,
    flexDirection: 'row',
    marginVertical: 8,
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
    backgroundColor: theme.colors.background,
    padding: 10,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
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
  mapButton: {
    position: 'absolute',
    bottom: '7%',
    right: '7%',
  },
});

export default CardPhotoList;
