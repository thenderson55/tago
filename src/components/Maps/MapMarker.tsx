import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Avatar} from 'native-base';
import {Callout, Marker} from 'react-native-maps';
import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';
import MapCard from './MapCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';

type Props = {
  item: PhotoType;
  index: number;
  onPress: () => void;
  traceRoute: (item: PhotoType) => void;
};

function MapMarker(props: Props) {
  const navigation: NativeStackNavigationProp<PhotosParamList, 'Photo'> =
    useNavigation();
  //FIXME: Key issue with markers, index is unique but throws error
  const {item, index, onPress, traceRoute} = props;
  return (
    <Marker
      key={index}
      // key={`key_${item.location[0]}_${item.location[2]}`}
      coordinate={{
        latitude: item.location[0],
        longitude: item.location[1],
      }}
      // onSelect={
      //   event => console.log('onSelect', event)
      //   // map.animateCamera()
      //   // this.map.animateCamera({center: coordinate}, {duration: 2000})
      // }
      // onDeselect={
      //   event => console.log('onDeselect', event)
      //   // map.animateCamera()
      //   // this.map.animateCamera({center: coordinate}, {duration: 2000})
      // }
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
      <Callout
        style={{paddingTop: 50}}
        tooltip={true}
        onPress={() =>
          Platform.OS === 'android' && navigation.navigate('Photo', {item})
        }>
        <MapCard
          traceRoute={traceRoute}
          item={item}
          onPress={() => navigation.navigate('Photo', {item})}
        />
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
