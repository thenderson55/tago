import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PhotosStack from './stacks/Photos/PhotosStack';
import HomeStack from './stacks/Home/HomeStack';
import addGlobalRoutes from './stacks/addGlobalRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from './theme';
import MapStack from './stacks/Map/MapStack';
import useUserStore from './store/useUserStore';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import SettingsStack from './stacks/Settings/SettingsStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const {setTabStatus} = useUserStore();
  const navigation = useNavigation();

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
          } else if (route.name === 'SettingsStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            // iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          return (
            <TouchableOpacity
              style={styles.tab}
              onPress={() =>
                route.name === 'MapStack'
                  ? navigation.navigate('MapStack')
                  : route.name === 'PhotosStack'
                  ? (setTabStatus('PhotosStack'),
                    navigation.navigate('PhotosStack'))
                  : route.name === 'HomeStack'
                  ? (setTabStatus('HomeStack'),
                    navigation.navigate('HomeStack'))
                  : (setTabStatus('SettingsStack'),
                    navigation.navigate('SettingsStack'))
              }>
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                onPress={() =>
                  route.name === 'MapStack'
                    ? navigation.navigate('MapStack')
                    : route.name === 'PhotosStack'
                    ? (setTabStatus('PhotosStack'),
                      navigation.navigate('PhotosStack'))
                    : route.name === 'HomeStack'
                    ? (setTabStatus('HomeStack'),
                      navigation.navigate('HomeStack'))
                    : (setTabStatus('SettingsStack'),
                      navigation.navigate('SettingsStack'))
                }
              />
            </TouchableOpacity>
          );
        },
        tabBarLabelStyle: {
          marginBottom: 2,
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
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Settijngs',
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

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 10,
  },
});

export default TabScreen;
