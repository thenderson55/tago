import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CalloutSubview} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';
import {Svg, Image as ImageSvg} from 'react-native-svg';

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
        {Platform.OS === 'ios' ? (
          <CalloutSubview onPress={() => onPress()}>
            <FastImage
              style={styles.cardImg}
              source={{
                uri: item.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </CalloutSubview>
        ) : (
          <View style={styles.svgWrapper}>
            <Svg width={250} height={200}>
              <ImageSvg
                width={'100%'}
                height={'100%'}
                preserveAspectRatio="xMidYMid slice"
                href={{uri: item.url}}
              />
            </Svg>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategory}>{item.category}</Text>
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
    // backgroundColor: theme.colors.magenta,
    borderRadius: 6,
    marginBottom: 5,
    width: 250,
  },
  svgWrapper: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
    // borderTopColor: 'transparent',
    // borderEndColor: theme.colors.lightGrey,
    // borderStartColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
    borderLeftColor: theme.colors.lightGrey,
    borderRightColor: theme.colors.lightGrey,
    // borderTopColor: theme.colors.white,
    borderTopWidth: 0,
  },
  cardCategory: {
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  cardTitle: {
    color: theme.colors.black,
  },
});

export default MapCard;
