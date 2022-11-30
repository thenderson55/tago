import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, MapMarker} from 'react-native-maps';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import theme from '../../theme';
import BackButton from '../../components/Buttons/BackButton';
import LoadingDots from '../../components/Animations/LoadingDots';

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
      {location?.length ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            key={1}
            coordinate={{
              latitude: location[0],
              longitude: location[1],
            }}
            title={'YO'}
            description={'Tasty looking Sushi'}
            pinColor={theme.colors.magenta}
          />
        </MapView>
      ) : (
        <View style={styles.loadingDots}>
          <LoadingDots
            numberOfDots={3}
            animationDelay={200}
            style={{
              color: theme.colors.primary,
            }}
          />
        </View>
      )}
      <View style={styles.backButton}>
        <BackButton map={true} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  mapView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    // top: '5%',
    // left: '5%',
    // alignSelf: 'flex-start',
    bottom: '5%',
    right: '7%',
    alignSelf: 'flex-end',
  },
  loadingDots: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (Dimensions.get('window').height / 10) * 2,
  },
});

export default Map;
