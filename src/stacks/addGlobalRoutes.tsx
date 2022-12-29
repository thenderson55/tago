import React from 'react';
import MapScreen from '../screens/Map/MapScreen';
import PhotoScreen from '../screens/Photos/PhotoScreen';

function addGlobalRoutes(Stack: any) {
  return (
    <>
      <Stack.Screen
        name="Photo"
        // options={{
        //   header: () => null,
        // }}
        component={PhotoScreen}
      />
      <Stack.Screen
        name="Map"
        // options={{
        //   header: () => null,
        // }}
        component={MapScreen}
      />
    </>
  );
}

export default addGlobalRoutes;
