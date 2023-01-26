// write tests for MapScreen

import React from 'react';
import MapScreen from '../src/screens/Map/MapScreen';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<MapScreen />);
});
