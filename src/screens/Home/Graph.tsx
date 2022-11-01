import React from 'react';
import {runTiming, Skia, SkPath, useValue} from '@shopify/react-native-skia';
import {DataPoint} from './data';
import {scaleLinear, scaleTime, line, curveBasis} from 'd3';
import {Pressable, StyleSheet, Text, View, Easing} from 'react-native';

interface GraphData {
  min: number;
  max: number;
  curve: SkPath;
}

function Graph() {
  const transition = useValue(1);
  const state = useValue({
    current: 0,
    next: 1,
  });

  const GRAPH_HEIGHT = 400;
  const GRAPH_WIDTH = 360;

  const makeGraph = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map(val => val.value));
    const max = Math.max(...data.map(val => val.value));

    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

    const getXAxis = scaleTime()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<DataPoint>()
      .x(d => getXAxis(new Date(d.date)))
      .y(d => getYAxis(d.value))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
      max,
      min,
      curve: skPath!,
    };
  };

  const transitionStart = (end: number) => {
    state.current = {
      current: end,
      next: state.current.current,
    };
    transition.current = 0;
    runTiming(transition, 1, {
      duration: 750,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={() => transitionStart(0)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Graph 1</Text>
      </Pressable>
      <Pressable onPress={() => transitionStart(1)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Graph 2</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonStyle: {
    marginRight: 20,
    backgroundColor: '#6231ff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 20,
  },
});

export default Graph;
