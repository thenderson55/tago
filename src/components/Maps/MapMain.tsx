import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

type Props = {
  children: React.ReactNode;
  location: number[];
  mapRef: React.RefObject<MapView>;
};

function Map(props: Props) {
  const {children, location, mapRef} = props;
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={styles.mapView}
      initialRegion={{
        latitude: location[0],
        longitude: location[1],
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
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
