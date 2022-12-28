import React from 'react';
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
    </>
  );
}

export default addGlobalRoutes;
