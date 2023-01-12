import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeParamList} from './HomeParamList';

import Home from '../../screens/Home';
import Graph from '../../screens/Home/Graph';
import Account from '../../screens/Home/Account';
import useUserStore from '../../store/useUserStore';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import SupportScreen from '../../screens/SupportScreen';

const Stack = createNativeStackNavigator<HomeParamList>();

function HomeStack() {
  const {user} = useUserStore();

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
        options={() => ({
          title: user.displayName || user.email || 'Account',
        })}
        name="Account"
        component={Account}
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
