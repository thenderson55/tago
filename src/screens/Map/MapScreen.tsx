import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Platform,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
//@ts-ignore
import {GOOGLE_MAPS_API_KEY} from '@env';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import theme from '../../theme';
import BackButton from '../../components/Buttons/BackButton';
import LoadingDots from '../../components/Animations/LoadingDots';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Avatar} from 'native-base';
import {
  getGoogleMapsPlaceByAutocomplete,
  handleSelectPicture,
  requestLocationPermission,
} from '../../utils';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import InputSearch from '../../components/Inputs/InputSearch';
import MapViewDirections from 'react-native-maps-directions';
import MapMain from '../../components/Maps/MapMain';
import MapMarker from '../../components/Maps/MapMarker';
import MapDirections from '../../components/Maps/MapDirections';
import {ImagePickerResponse} from 'react-native-image-picker';
import ModalInfo from '../../components/Modals/ModalInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
// https://www.youtube.com/watch?v=jvIQQ4ID2JY
// https://www.youtube.com/watch?v=4N-8RTeQ1fA&ab_channel=PradipDebnath
// https://www.codedaily.io/tutorials/Build-a-Map-with-Custom-Animated-Markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native

const MapScreen = () => {
  const route: RouteProp<HomeParamList, 'Map'> = useRoute();
  const mapRef = useRef<MapView>(null);
  // const {newPhoto} = route?.params;
  const [directions, setDirections] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  // const [newPhoto, setNewPhoto] = useState<PlaceType>();
  const {photos, currentLocation, getCurrentLocation} = usePhotosStore();
  const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
  const [infoModal, setInfoModal] = useState(false);
  const infoModalClose = () => {
    setInfoModal(false);
  };
  const infoModalOpen = () => {
    setInfoModal(true);
  };

  console.log('MAP PHOTOS', photos.length);
  console.log('LOCATION', currentLocation);
  // route?.params?.newPhoto && console.log('NEW PHOTO', route.params.newPhoto);

  // useEffect(() => {
  //   if (photos.length > 1) {
  //     console.log('MAP PHOTOS 1', photos[photos.length - 1]);
  //     setNewPhoto(photos[photos.length - 1]);
  //   }
  // }, [photos]);
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const setDistanceAndDuration = (args: any) => {
    console.log('DISTANCE AND DURATION', args);
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const mapPadding = 50;
  const traceRoute = () => {
    // setDirections(!directions);
    mapRef.current?.fitToCoordinates(
      [
        {latitude: currentLocation![0], longitude: currentLocation![1]},
        {latitude: 56.3766, longitude: -4.0},
      ],
      {
        edgePadding: {
          top: mapPadding,
          right: mapPadding,
          bottom: mapPadding,
          left: mapPadding,
        },
        animated: true,
      },
    );
  };

  const centerToPin = (item: PhotoType) => {
    console.log('CENTER TO PIN', item);
    mapRef.current?.animateToRegion({
      latitude: item.location[0],
      longitude: item.location[1],
      latitudeDelta: 0.0,
      longitudeDelta: 0.0,
    });
  };

  // useEffect(() => {
  //   let watchID: number = 0;
  //   const watchLocation = async () => {
  //     await requestLocationPermission();
  //     try {
  //       watchID = Geolocation.watchPosition(
  //         (position: GeoPosition) => {
  //           // console.log('Watch Location:', position);
  //           setLocation([position.coords.latitude, position.coords.longitude]);
  //           return;
  //         },
  //         error => {
  //           // See error code charts below.
  //           console.log(error.code, error.message);
  //           setLocation([]);
  //           return;
  //         },
  //         {
  //           enableHighAccuracy: true,
  //           interval: 100,
  //           fastestInterval: 100,
  //           distanceFilter: 0,
  //         },
  //       );
  //       console.log('WATCH ID', watchID);
  //     } catch (error) {
  //       console.log('Location Watch Error', error);
  //     }
  //   };
  //   // watchLocation();
  //   console.log('WATCH ID', watchID);
  //   return () => {
  //     // FIXME: watchID not being returned in above function
  //     // stopObserving works somwtimes but throws yellow box error
  //     Geolocation.clearWatch(watchID);
  //     Geolocation.stopObserving();
  //   };
  // }, []);

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

  // const defaultProvider =
  //   Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE;
  return (
    <SafeAreaView style={styles.safeView}>
      <ModalInfo
        modalBool={infoModal}
        modalClose={infoModalClose}
        imageResponse={imageResponse!}
        location={currentLocation}
      />
      {route?.params?.newPhoto?.location ? (
        <>
          <MapMain
            mapRef={mapRef}
            location={[
              route.params.newPhoto.location[0],
              route.params.newPhoto.location[1],
            ]}>
            <MapMarker
              item={route.params.newPhoto}
              index={-1}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  centerToPin(route!.params!.newPhoto!);
                  setDirections(true);
                }
              }}
            />
            {photos?.map((item, index) => {
              return (
                <MapMarker
                  index={index}
                  item={item}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      centerToPin(item);
                      setDirections(true);
                    }
                  }}
                />
              );
            })}
            {/* {directions && (
              <MapDirections
                item={route.params.newPhoto}
                mode="WALKING"
                setDistanceAndDuration={setDistanceAndDuration}
              />
            )} */}
          </MapMain>
          {/* <SearchInput /> */}
        </>
      ) : photos?.length > 0 && currentLocation?.length ? (
        <>
          <MapMain
            mapRef={mapRef}
            location={[currentLocation[0], currentLocation[1]]}>
            <Marker
              coordinate={{
                latitude: currentLocation[0],
                longitude: currentLocation[1],
              }}
            />
            {photos.map((item, index) => {
              return (
                <MapMarker
                  index={index}
                  item={item}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      centerToPin(item);
                      setDirections(true);
                    }
                  }}
                />
              );
            })}
            {/* {directions && (
              <MapViewDirections
                origin={{
                  latitude: currentLocation[0],
                  longitude: currentLocation[1],
                }}
                destination={{latitude: 56.3766, longitude: -4.0}}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeColor={theme.colors.magenta}
                strokeWidth={3}
                mode="WALKING"
                onReady={setDistanceAndDuration}
              />
            )} */}
          </MapMain>
          {/* <SearchInput /> */}
        </>
      ) : currentLocation?.length ? (
        <>
          <MapMain
            mapRef={mapRef}
            location={[currentLocation[0], currentLocation[1]]}>
            <Marker
              coordinate={{
                latitude: currentLocation[0],
                longitude: currentLocation[1],
              }}
              // pinColor={theme.colors.magenta}
            />
          </MapMain>
          {/* <SearchInput /> */}
        </>
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
      <View style={styles.cameraButton}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleSelectPicture(setImageResponse, infoModalOpen)}>
          <Ionicons name={'camera'} size={50} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' && directions && (
        <View style={styles.directionsButton}>
          <Button title="Directions" onPress={() => traceRoute()} />
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: theme.colors.white,
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
  cameraButton: {
    position: 'absolute',
    top: '3%',
    right: '7%',
    alignSelf: 'center',
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
});

export default MapScreen;