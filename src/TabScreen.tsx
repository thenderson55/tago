import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PhotosStack from './stacks/Photos/PhotosStack';
import HomeStack from './stacks/Home/HomeStack';
import addGlobalRoutes from './stacks/addGlobalRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from './theme';
import MapStack from './stacks/Map/MapStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'PhotosStack') {
            iconName = focused ? 'images' : 'images-outline';
            // iconName = focused ? 'ios-list' : 'ios-list-outline';
          } else if (route.name === 'MapStack') {
            iconName = focused ? 'map' : 'map-outline';
            // iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.grey,
      })}>
      <Tab.Screen
        options={() => ({
          headerShown: false,
          tabBarLabel: 'Home',
        })}
        name="HomeStack"
        component={HomeStack}
      />
      <Tab.Screen
        name="MapStack"
        component={MapStack}
        options={{
          headerShown: false,
          tabBarStyle: {display: 'none'},
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="PhotosStack"
        component={PhotosStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Photos',
        }}
      />
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
        name="BottomTabs"
        component={BottomTabs}
      />
      {addGlobalRoutes(Stack)}
    </Stack.Navigator>
  );
}

export default TabScreen;
