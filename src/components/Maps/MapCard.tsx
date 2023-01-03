import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {CalloutSubview} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';
import {Svg, Image as ImageSvg} from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  item: PhotoType;
  onPress: () => void;
  traceRoute: (item: PhotoType) => void;
};

const MapCard = (props: Props) => {
  const {item, onPress, traceRoute} = props;
  console.log('Item: ', item);
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
          <View style={styles.directionWrapper}>
            <Text style={styles.cardCategory} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
          {Platform.OS === 'ios' && item.title && (
            <View style={styles.directionWrapper}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          )}
          {Platform.OS === 'ios' && item.description && (
            <View style={styles.directionWrapper}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          )}
          <CalloutSubview
            style={styles.directionIcon}
            onPress={() => {
              traceRoute(item);
            }}>
            <Ionicons name={'code-working'} size={25} />
          </CalloutSubview>
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
    width: Dimensions.get('window').width * 0.7,
  },
  svgWrapper: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImg: {
    height: Dimensions.get('window').height * 0.25,
    width: Dimensions.get('window').width * 0.7,
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
  directionWrapper: {
    // backgroundColor: 'pink',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: theme.colors.black,
    width: '85%',
  },
  directionIcon: {
    position: 'absolute',
    right: 10,
    bottom: 5,
  },
});

export default MapCard;
