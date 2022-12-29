import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MapParamList} from './MapParamList';
import Map from '../../screens/Home/Map';

const Stack = createNativeStackNavigator<MapParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header:() => null
      // }}
      initialRouteName="Map">
      <Stack.Screen
        name="Map"
        options={{
          header: () => null,
        }}
        component={Map}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
