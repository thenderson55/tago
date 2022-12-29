import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PhotosStack from './stacks/Photos/PhotosStack';
import HomeStack from './stacks/Home/HomeStack';
import addGlobalRoutes from './stacks/addGlobalRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from './theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Photos') {
            iconName = focused ? 'images' : 'images-outline';
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
