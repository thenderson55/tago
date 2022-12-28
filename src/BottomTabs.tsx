import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PhotosStack from './stacks/Photos/PhotosStack';
import HomeStack from './stacks/Home/HomeStack';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Photos" component={PhotosStack} />
    </Tab.Navigator>
  );
}

export default BottomTabs;
