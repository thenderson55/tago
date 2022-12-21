import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Linking,
  Platform,
  Button,
  Text,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import theme from '../../theme';
import BackButton from '../../components/Buttons/BackButton';
import LoadingDots from '../../components/Animations/LoadingDots';
import usePhotosStore from '../../store/usePhotosStore';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Avatar} from 'native-base';
import {requestLocationPermission} from '../../utils';
// https://www.youtube.com/watch?v=jvIQQ4ID2JY

// https://www.codedaily.io/tutorials/Build-a-Map-with-Custom-Animated-Markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native

const Map = () => {
  const route: RouteProp<HomeParamList, 'Map'> = useRoute();
  // const {newPhoto} = route?.params;
  const [location, setLocation] = useState<number[]>();
  // const [newPhoto, setNewPhoto] = useState<PhotoType>();
  const {photos} = usePhotosStore();
  console.log('MAP PHOTOS', photos.length);
  console.log('LOCATION', location);
  route?.params?.newPhoto && console.log('NEW PHOTO', route.params.newPhoto);

  // useEffect(() => {
  //   if (photos.length > 1) {
  //     console.log('MAP PHOTOS 1', photos[photos.length - 1]);
  //     setNewPhoto(photos[photos.length - 1]);
  //   }
  // }, [photos]);

  const getLocation = useCallback(async () => {
    await requestLocationPermission();
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
    let watchID: number = 0;
    const watchLocation = async () => {
      await requestLocationPermission();
      try {
        watchID = Geolocation.watchPosition(
          (position: GeoPosition) => {
            console.log('Watch Location:', position);
            setLocation([position.coords.latitude, position.coords.longitude]);
            return;
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation([]);
            return;
          },
          {
            enableHighAccuracy: true,
            interval: 100,
            fastestInterval: 100,
            distanceFilter: 0,
          },
        );
        console.log('WATCH ID', watchID);
      } catch (error) {
        console.log('Location Watch Error', error);
      }
    };
    watchLocation();
    console.log('WATCH ID', watchID);
    return () => {
      // FIXME: watchID not being returned in above function
      // stopObserving works somwtimes but throws yellow box error
      Geolocation.clearWatch(watchID);
      Geolocation.stopObserving();
    };
  }, []);

  // const directionsButton = () => {
  //   const lat = location[0];
  //   const lng = location[1];
  //   // const lat = 46.37231;
  //   // const lng = -10.01132;
  //   console.log('LAT', lat, 'LNG', lng);
  //   const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  //   const latLng = `${lat},${lng}`;
  //   const label = 'Custom Label';
  //   const url = Platform.select({
  //     // ios: `${scheme}${label}@${latLng}`,
  //     ios: `https://www.google.com/maps/@${latLng},6z`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });
  //   console.log('url', url);
  //   Linking.openURL(url!);
  // };

  // FIXME: need to use a stored version first to prevent loading each time
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // const defaultProvider =
  //   Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE;
  return (
    <SafeAreaView style={styles.safeView}>
      {route?.params?.newPhoto?.location ? (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          initialRegion={{
            latitude: route.params.newPhoto.location[0],
            longitude: route.params.newPhoto.location[1],
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            key={1}
            coordinate={{
              latitude: route.params.newPhoto.location[0],
              longitude: route.params.newPhoto.location[1],
            }}
            title={route.params.newPhoto.title}
            description={route.params.newPhoto.description}
            pinColor={theme.colors.magenta}>
            <View style={styles.pinWrapper}>
              <Avatar
                style={styles.avatar}
                size="md"
                source={{
                  uri: route.params.newPhoto.url,
                }}
              />
              <View style={styles.triangle} />
            </View>
          </Marker>
        </MapView>
      ) : photos?.length > 0 && location?.length ? (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          initialRegion={{
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              latitude: location[0],
              longitude: location[1],
            }}
          />
          {photos.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  // @ts-ignore
                  latitude: item.location[0],
                  // @ts-ignore
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
          })}
        </MapView>
      ) : location?.length ? (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.mapView}
          initialRegion={{
            latitude: location[0],
            longitude: location[1],
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              latitude: location[0],
              longitude: location[1],
            }}
            // pinColor={theme.colors.magenta}
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
      {/* {Platform.OS === 'ios' && (
        <View style={styles.directionsButton}>
          <Button title="Directions" onPress={() => directionsButton()} />
        </View>
      )} */}
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
    bottom: '7%',
    left: '7%',
    alignSelf: 'flex-start',
    // bottom: '7%',
    // right: '7%',
    // alignSelf: 'flex-end',
  },
  directionsButton: {
    position: 'absolute',
    bottom: '7%',
    right: '7%',
    alignSelf: 'flex-end',
  },
  loadingDots: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (Dimensions.get('window').height / 10) * 2,
  },
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

export default Map;
