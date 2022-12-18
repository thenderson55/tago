import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingsParamList} from './SettingsParamList';

import Home from '../../screens/Home';
import Graph from '../../screens/Home/Graph';
import Map from '../../screens/Home/Map';
import Settings from '../../screens/Settings';

const Stack = createNativeStackNavigator<SettingsParamList>();

function SettingsStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header:() => null
      // }}
      initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        options={{
          header: () => null,
        }}
        component={Settings}
      />
    </Stack.Navigator>
  );
}

export default SettingsStack;
