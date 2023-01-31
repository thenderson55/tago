import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, {MapType, Marker, Region} from 'react-native-maps';
//@ts-ignore
import {GOOGLE_MAPS_API_KEY} from '@env';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import theme from '../../theme';
import BackButton from '../../components/Buttons/BackButton';
import LoadingDots from '../../components/Animations/LoadingDots';
import usePhotosStore, {PhotoType} from '../../store/usePhotosStore';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
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
import {initialMapValues} from '../../utils/settings';
// https://www.youtube.com/watch?v=jvIQQ4ID2JY
// https://www.youtube.com/watch?v=4N-8RTeQ1fA&ab_channel=PradipDebnath
// https://www.codedaily.io/tutorials/Build-a-Map-with-Custom-Animated-Markers-and-Region-Focus-when-Content-is-Scrolled-in-React-Native

const MapScreen = () => {
  const route: RouteProp<HomeParamList, 'Map'> = useRoute();
  const mapRef = useRef<MapView>(null);
  // const {newPhoto} = route?.params;
  const [directions, setDirections] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  const [location, setLocation] = useState<number[]>();
  const [mapType, setMapType] = useState<MapType>('standard');
  const [imageLocation, setImageLocation] = useState<number[]>();
  const [duration, setDuration] = useState<number>(0);
  const [currentRegion, setCurrentRegion] = useState<Region>({} as Region);
  const [currentPhoto, setCurrentPhoto] = useState<PhotoType>({} as PhotoType);
  const [coordinates, setCoordinates] = useState([
    {latitude: 0, longitude: 0},
    {latitude: 0, longitude: 0},
  ]);
  // const [newPhoto, setNewPhoto] = useState<PlaceType>();
  // const {photos, currentLocation, getCurrentLocation} = usePhotosStore();
  const {photos} = usePhotosStore();
  const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
  const [infoModal, setInfoModal] = useState(false);
  // FIXME: Flickering imagaes/avation on map
  const infoModalClose = () => {
    setInfoModal(false);
  };
  const infoModalOpen = () => {
    setInfoModal(true);
  };

  // useEffect(() => {
  //   setCurrentPhoto(route.params?.photo!);
  // }, [route.params?.photo]);

  useFocusEffect(
    useCallback(() => {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          return [0, 0];
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
      let watchID: number = 0;
      const watchLocation = async () => {
        await requestLocationPermission();
        try {
          watchID = Geolocation.watchPosition(
            (position: GeoPosition) => {
              console.log('Watch Location:', position);
              setLocation([
                position.coords.latitude,
                position.coords.longitude,
              ]);
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
              interval: 5000,
              fastestInterval: 5000,
              distanceFilter: 10,
            },
          );
          // console.log('WATCH ID', watchID);
        } catch (error) {
          console.log('Location Watch Error', error);
        }
      };
      watchLocation();
      // console.log('WATCH ID', watchID);
      return () => {
        // FIXME: watchID not being returned in above function
        // stopObserving works somwtimes but throws yellow box error
        Geolocation.clearWatch(watchID);
        Geolocation.stopObserving();
      };
    }, []),
  );

  const setDistanceAndDuration = (args: any) => {
    // console.log('DISTANCE AND DURATION', args);
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };
  const mapPadding = 50;
  const traceRoute = (item: PhotoType, currentLocation: number[]) => {
    console.log('"currentLocation"', currentLocation);
    console.log('"item"', item);
    setDirections(!directions);
    setCurrentPhoto(item);
    const coords = [
      {latitude: currentLocation[0], longitude: currentLocation[1]},
      {
        latitude: item.location[0],
        longitude: item.location[1],
      },
    ];
    setCoordinates(coords);
    console.log('COORDS', coords);
    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: {
        top: mapPadding,
        right: mapPadding,
        bottom: mapPadding,
        left: mapPadding,
      },
      animated: true,
    });
  };
  // useEffect(() => {
  //   const mapPadding = 50;
  //   const traceRoute = (item: PhotoType, currentLocation: number[]) => {
  //     console.log('"currentLocation"', currentLocation);
  //     console.log('"item"', item);
  //     setDirections(!directions);
  //     setCurrentPhoto(item);
  //     const coords = [
  //       {latitude: currentLocation[0], longitude: currentLocation[1]},
  //       {
  //         latitude: item.location[0],
  //         longitude: item.location[1],
  //       },
  //     ];
  //     setCoordinates(coords);
  //     console.log('COORDS', coords);
  //     mapRef.current?.fitToCoordinates(coords, {
  //       edgePadding: {
  //         top: mapPadding,
  //         right: mapPadding,
  //         bottom: mapPadding,
  //         left: mapPadding,
  //       },
  //       animated: true,
  //     });
  //   };
  //   traceRoute(currentPhoto, location!);
  // }, [directions, currentPhoto, location]);

  const centerToLocation = async () => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        mapRef.current?.animateToRegion(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: initialMapValues.latitudeDelta,
            longitudeDelta: initialMapValues.longitudeDelta,
          },
          200,
        );
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        return [0, 0];
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const centerToPin = (item: PhotoType, region: Region) => {
    mapRef.current?.animateToRegion(
      {
        latitude: item.location[0],
        longitude: item.location[1],
        latitudeDelta: region.latitudeDelta || initialMapValues.latitudeDelta,
        longitudeDelta:
          region.longitudeDelta || initialMapValues.longitudeDelta,
      },
      200,
    );
  };

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
      {location?.length && (
        <ModalInfo
          modalBool={infoModal}
          modalClose={infoModalClose}
          imageResponse={imageResponse!}
          location={imageLocation!}
        />
      )}
      {(route?.params?.newPhoto || route?.params?.photo) &&
      photos?.length > 0 &&
      location?.length ? (
        <>
          <MapMain
            mapRef={mapRef}
            setCurrentRegion={setCurrentRegion}
            mapType={mapType}
            location={[
              route.params.photo?.location[0] || photos[0].location[0],
              route.params.photo?.location[1] || photos[0].location[1],
            ]}>
            <Marker
              coordinate={{
                latitude: location[0],
                longitude: location[1],
              }}
            />
            {!route.params.photo && (
              <MapMarker
                item={photos[0]}
                traceRoute={() => traceRoute(photos[0], location)}
                index={-1}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    centerToPin(photos[0], currentRegion);
                  }
                }}
              />
            )}
            {route.params.photo && (
              <MapMarker
                item={route.params.photo}
                traceRoute={() => traceRoute(route.params?.photo!, location)}
                index={-1}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    centerToPin(route.params?.photo!, currentRegion);
                  }
                }}
              />
            )}
            {photos?.slice(1).map((item, index) => {
              return (
                <MapMarker
                  index={index}
                  item={item}
                  traceRoute={() => traceRoute(item, location)}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      centerToPin(item, currentRegion!);
                    }
                  }}
                />
              );
            })}
            {directions && (
              <MapViewDirections
                origin={{
                  latitude: coordinates[0].latitude,
                  longitude: coordinates[0].longitude,
                }}
                destination={{
                  latitude: coordinates[1].latitude,
                  longitude: coordinates[1].longitude,
                }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeColor={theme.colors.magenta}
                strokeWidth={3}
                mode="WALKING"
                onReady={setDistanceAndDuration}
              />
            )}
          </MapMain>
          {/* <SearchInput /> */}
        </>
      ) : photos?.length > 0 && location?.length ? (
        <>
          <MapMain
            mapRef={mapRef}
            mapType={mapType}
            setCurrentRegion={setCurrentRegion}
            location={[location[0], location[1]]}>
            <Marker
              coordinate={{
                latitude: location[0],
                longitude: location[1],
              }}
            />
            {photos.map((item, index) => {
              return (
                <MapMarker
                  index={index}
                  item={item}
                  traceRoute={() => traceRoute(item, location)}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      centerToPin(item, currentRegion);
                    }
                  }}
                />
              );
            })}
            {directions && currentPhoto && location?.length && (
              <MapViewDirections
                origin={{
                  latitude: location[0],
                  longitude: location[1],
                }}
                destination={{
                  latitude: currentPhoto.location[0],
                  longitude: currentPhoto.location[1],
                }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeColor={theme.colors.magenta}
                strokeWidth={3}
                mode="WALKING"
                onReady={setDistanceAndDuration}
              />
            )}
          </MapMain>
          {/* <SearchInput /> */}
        </>
      ) : location?.length ? (
        <>
          <MapMain
            mapRef={mapRef}
            mapType={mapType}
            setCurrentRegion={setCurrentRegion}
            location={[location[0], location[1]]}>
            <Marker
              coordinate={{
                latitude: location[0],
                longitude: location[1],
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
      <View style={styles.mapTypeButton}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            mapType === 'standard'
              ? setMapType('satellite')
              : setMapType('standard');
          }}>
          <Ionicons
            name={mapType === 'satellite' ? 'earth' : 'trail-sign-outline'}
            size={50}
            color={
              mapType === 'satellite'
                ? theme.colors.secondary
                : theme.colors.black
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.centerButton}>
        <TouchableOpacity activeOpacity={1} onPress={() => centerToLocation()}>
          <Ionicons
            name={'locate-outline'}
            size={50}
            color={
              mapType === 'satellite'
                ? theme.colors.secondary
                : theme.colors.black
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraButton}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            handleSelectPicture(
              setImageResponse,
              setImageLocation,
              infoModalOpen,
            )
          }>
          <Ionicons
            name={'camera-outline'}
            size={50}
            color={
              mapType === 'satellite'
                ? theme.colors.secondary
                : theme.colors.black
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.backButton}>
        <BackButton map={true} mapType={mapType} />
      </View>
      {Platform.OS === 'ios' && directions && (
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => setDirections(false)}>
          <View>
            <Text
              style={{
                color:
                  mapType === 'satellite'
                    ? theme.colors.white
                    : theme.colors.black,
              }}>
              Distance: {distance.toFixed(2)}
            </Text>
            <Text
              style={{
                color:
                  mapType === 'satellite'
                    ? theme.colors.white
                    : theme.colors.black,
              }}>
              Duration: {Math.ceil(duration)} min
            </Text>
          </View>
          {/* <Ionicons
            name={'close-circle-outline'}
            size={25}
            color={
              mapType === 'satellite' ? theme.colors.white : theme.colors.black
            }
          /> */}
        </TouchableOpacity>
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
  mapTypeButton: {
    position: 'absolute',
    bottom: '27%',
    left: '7%',
    alignSelf: 'flex-start',
    // bottom: '7%',
    // right: '7%',
    // alignSelf: 'flex-end',
  },
  centerButton: {
    position: 'absolute',
    bottom: '17%',
    left: '7%',
    alignSelf: 'flex-start',
    // bottom: '7%',
    // right: '7%',
    // alignSelf: 'flex-end',
  },
  cameraButton: {
    position: 'absolute',
    bottom: '7%',
    // left: '7%',
    alignSelf: 'center',
    // bottom: '7%',
    // right: '7%',
    // alignSelf: 'flex-end',
  },
  directionsButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: '8.2%',
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
