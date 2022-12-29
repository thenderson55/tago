import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_API_KEY} from '@env';
import {PlaceType} from '../../store/usePhotosStore';
import theme from '../../theme';

type Props = {
  item: PlaceType;
  mode: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT';
  setDistanceAndDuration: (result: any) => void;
};

function MapDirections(props: Props) {
  const {item, mode, setDistanceAndDuration} = props;
  return (
    <MapViewDirections
      origin={{
        latitude: item.location[0],
        longitude: item.location[1],
      }}
      destination={{latitude: 56.3766, longitude: -4.0}}
      apikey={GOOGLE_MAPS_API_KEY}
      strokeColor={theme.colors.magenta}
      strokeWidth={3}
      mode={mode}
      onReady={setDistanceAndDuration}
    />
  );
}

export default MapDirections;
