import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar} from 'native-base';
import {Marker} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

type Props = {
  item: PhotoType;
  index: number;
};

function MapMarker(props: Props) {
  //FIXME: Key issue with markers, index is unique but throws error
  const {item, index} = props;
  return (
    <Marker
      key={index}
      coordinate={{
        latitude: item.location[0],
        longitude: item.location[1],
      }}
      title={item.title}
      description={item.description}
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
