import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
// import {CalloutSubview} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

// import StarRating from './StarRating';

type Props = {
  item: PhotoType;
  onPress: () => void;
};

const MapCard = (props: Props) => {
  const {item, onPress} = props;
  console.log('MapCard item: ', item);
  return (
    <View>
      <View style={styles.bubble}>
        <FastImage
          style={styles.cardImg}
          source={{
            uri: item.url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    borderRadius: 6,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    marginBottom: 5,
    width: 250,
  },
  cardImg: {
    height: 200,
    width: 250,
    alignSelf: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardInfo: {
    backgroundColor: theme.colors.white,
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cardCategory: {
    fontWeight: 'bold',
  },
  cardTitle: {},
});

export default MapCard;
