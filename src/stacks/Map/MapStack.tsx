import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MapParamList} from './MapParamList';
import MapScreen from '../../screens/Map/MapScreen';

const Stack = createNativeStackNavigator<MapParamList>();

function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => null,
      }}
      initialRouteName="Map">
      <Stack.Screen
        name="Map"
        options={{
          header: () => null,
        }}
        component={MapScreen}
      />
    </Stack.Navigator>
  );
}

export default MapStack;
