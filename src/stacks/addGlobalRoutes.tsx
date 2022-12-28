import React from 'react';
import PhotoScreen from '../screens/Photos/PhotoScreen';

function addGlobalRoutes(Stack: any) {
  return (
    <>
      <Stack.Screen
        // options={({ route, navigation }) => ({
        //   headerTitle: route.params.name,
        // })}
        name="Photo"
        component={PhotoScreen}
      />
    </>
  );
}

export default addGlobalRoutes;
