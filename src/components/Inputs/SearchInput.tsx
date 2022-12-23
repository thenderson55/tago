import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import theme from '../../theme';
//@ts-ignore
import {GOOGLE_MAPS_API_KEY} from '@env';
// import Geolocation from 'react-native-geolocation-service';
// import {getGoogleMapsPlaceByAutocomplete} from '../../utils';

// navigator.geolocation = require('react-native-geolocation-service');

function SearchInput() {
  // useEffect(() => {
  //   const placeByAutocomplete = async (input: string) => {
  //     const res = await getGoogleMapsPlaceByAutocomplete(input);
  //     console.log('RES', res.data?.predictions[0].description);
  //   };
  //   placeByAutocomplete('Comr');
  // }, []);

  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        styles={{textInput: styles.input}}
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: {GOOGLE_MAPS_API_KEY},
          language: 'en',
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    width: '90%',
    marginHorizontal: '5%',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    padding: 8,
    elevation: 4,
    zIndex: 4,
    borderRadius: 10,
    marginTop: getStatusBarHeight() + 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  input: {
    // backgroundColor: theme.colors.white,
    backgroundColor: 'pink',
    borderColor: theme.colors.black,
    borderWidth: 1,
  },
});

export default SearchInput;
