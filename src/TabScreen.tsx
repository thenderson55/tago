import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PhotosStack from './stacks/Photos/PhotosStack';
import HomeStack from './stacks/Home/HomeStack';
import addGlobalRoutes from './stacks/addGlobalRoutes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        options={() => ({
          headerShown: false,
        })}
        name="Home"
        component={HomeStack}
      />
      <Tab.Screen name="Photos" component={PhotosStack} />
    </Tab.Navigator>
  );
}

function TabScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={() => ({
          headerShown: false,
        })}
        name="Home"
        component={BottomTabs}
      />
      {addGlobalRoutes(Stack)}
    </Stack.Navigator>
  );
}

export default TabScreen;
