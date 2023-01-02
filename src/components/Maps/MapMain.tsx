import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {initialMapValues} from '../../utils/settings';

type Props = {
  children: React.ReactNode;
  location: number[];
  mapRef: React.RefObject<MapView>;
  setCurrentRegion: (regon: Region) => void;
};

function Map(props: Props) {
  const {children, location, mapRef, setCurrentRegion} = props;
  return (
    <MapView
      ref={mapRef}
      onRegionChangeComplete={region => {
        console.log('region', region);
        setCurrentRegion(region);
      }}
      // mapPadding={{
      //   top: 50,
      //   right: 0,
      //   bottom: 0,
      //   left: 0,
      // }}
      provider={PROVIDER_GOOGLE}
      style={styles.mapView}
      initialRegion={{
        latitude: location[0],
        longitude: location[1],
        latitudeDelta: initialMapValues.latitudeDelta,
        longitudeDelta: initialMapValues.longitudeDelta,
      }}>
      {children}
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    // wdith: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
});

export default Map;
