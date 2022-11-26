import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

// https://www.youtube.com/watch?v=jvIQQ4ID2JY

const Map = () => {
  const [location, setLocation] = useState<number[]>();

  const getLocation = useCallback(async () => {
    try {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          console.log('Location:', position);
          setLocation([position.coords.latitude, position.coords.longitude]);
          return;
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          setLocation([]);
          return;
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.log('Location Error', error);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // const defaultProvider =
  //   Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE;
  return (
    <SafeAreaView style={styles.safeView}>
      {location?.length && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
