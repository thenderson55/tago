import {
  Canvas,
  Path,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import theme from '../../theme';
import {spline} from '../../utils/spline';

function createPoints() {
  const points = [];
  // how many points do we need
  const numPoints = 6;
  // used to equally space each point around the circle
  const angleStep = (Math.PI * 2) / numPoints;
  // the radius of the circle
  const rad = 110;

  for (let i = 1; i <= numPoints; i++) {
    // x & y coordinates of the current point
    const theta = i * angleStep;

    const x = 130 + Math.cos(theta) * rad;
    const y = 130 + Math.sin(theta) * rad;

    // store the point
    points.push({
      x: x,
      y: y,
      /* we need to keep a reference to the point's original {x, y} coordinates
       for when we modulate the values later */
      originX: x,
      originY: y,
      // more on this in a moment!
      noiseOffsetX: Math.random() * 1000,
      noiseOffsetY: Math.random() * 1000,
    });
  }

  return points;
}

function Blob() {
  const points = useValue(createPoints());

  const path = useComputedValue(() => {
    return spline(points.current, 1, true);
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path path={path} color={theme.colors.primary} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    height: 275,
    width: 275,
  },
});

export default Blob;
