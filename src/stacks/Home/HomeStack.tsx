import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeParamList} from './HomeParamList';

import Home from '../../screens/Home';
import Graph from '../../screens/Home/Graph';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import SupportScreen from '../../screens/SupportScreen';

const Stack = createNativeStackNavigator<HomeParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header: () => null,
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
        name="Graph"
        options={{
          header: () => null,
        }}
        component={Graph}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyPolicyScreen}
        options={{title: 'Privacy Policy'}}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{title: 'Support'}}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
