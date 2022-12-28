import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PhotosParamList} from './PhotosParamList';
import PhotoScreen from '../../screens/Photos/PhotoScreen';
import {PhotoType} from '../../store/usePhotosStore';
import PhotosListScreen from '../../screens/Photos/PhotosListScreen';

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
        // initialParams={{item: {} as PhotoType}}
        options={{
          header: () => null,
        }}
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
