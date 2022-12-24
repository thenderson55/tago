import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Avatar} from 'native-base';
import {Callout, Marker} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';
import MapCard from './MapCard';

type Props = {
  item: PhotoType;
  index: number;
  onPress: () => void;
};

function MapMarker(props: Props) {
  //FIXME: Key issue with markers, index is unique but throws error
  const {item, index, onPress} = props;
  return (
    <Marker
      key={index}
      // key={`key_${item.location[0]}_${item.location[2]}`}
      coordinate={{
        latitude: item.location[0],
        longitude: item.location[1],
      }}
      title={item.title}
      description={item.description}
      onPress={onPress}
      // tracksViewChanges={false}
      pinColor={theme.colors.magenta}>
      <View style={styles.pinWrapper}>
        <Avatar
          style={styles.avatar}
          size="md"
          source={{
            uri: item.url,
          }}
        />
        <View style={styles.triangle} />
      </View>
      <Callout tooltip={true}>
        <MapCard item={item} onPress={() => console.log('null')} />
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pinWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderColor: theme.colors.magenta,
    borderWidth: 3,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.magenta,
    transform: [{rotate: '180deg'}],
    marginTop: -5,
    zIndex: -1,
    elevation: -1,
  },
});

export default MapMarker;