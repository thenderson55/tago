import React from 'react';
import MapScreen from '../screens/Map/MapScreen';
import PhotoScreen from '../screens/Photos/PhotoScreen';
import theme from '../theme';

function addGlobalRoutes(Stack: any) {
  return (
    <>
      <Stack.Screen
        name="Photo"
        options={({route}: {route: any}) => ({
          title: route.params.item.title || '(no title)',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        component={PhotoScreen}
      />
      <Stack.Screen
        name="Map"
        options={{
          header: () => null,
        }}
        component={MapScreen}
      />
    </>
  );
}

export default addGlobalRoutes;
