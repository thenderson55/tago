import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeParamList} from './HomeParamList';

import Home from '../../screens/Home';
import Graph from '../../screens/Home/Graph';
import Map from '../../screens/Home/Map';

const Stack = createNativeStackNavigator<HomeParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header:() => null
      // }}
      initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{
          header: () => null,
        }}
        component={Home}
      />
      <Stack.Screen
        name="Map"
        options={{
          header: () => null,
        }}
        component={Map}
      />
      <Stack.Screen
        name="Graph"
        options={{
          header: () => null,
        }}
        component={Graph}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
