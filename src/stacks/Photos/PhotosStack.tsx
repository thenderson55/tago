import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PhotosParamList} from './PhotosParamList';
import PhotoScreen from '../../screens/Photos/PhotoScreen';
import PhotosListScreen from '../../screens/Photos/PhotosListScreen';
import theme from '../../theme';

const Stack = createNativeStackNavigator<PhotosParamList>();

function PhotosStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header:() => null
      // }}
      initialRouteName="PhotosList">
      <Stack.Screen
        name="Photo"
        options={({route}) => ({
          title: route.params.item.title || '(no title)',
          // headerStyle: {
          //   backgroundColor: theme.colors.secondary,
          // },
          // headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        component={PhotoScreen}
      />
      <Stack.Screen
        name="PhotosList"
        // initialParams={{ itemId: 42 }}
        options={{
          header: () => null,
        }}
        component={PhotosListScreen}
      />
    </Stack.Navigator>
  );
}

export default PhotosStack;
