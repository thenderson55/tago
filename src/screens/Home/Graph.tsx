import React from 'react';
// import {
//   Canvas,
//   runTiming,
//   Skia,
//   SkPath,
//   useValue,
//   Line,
//   vec,
//   Path,
//   useComputedValue,
// } from '@shopify/react-native-skia';
import {animatedData, DataPoint, originalData} from './data';
import {scaleLinear, scaleTime, curveBasis, line} from 'd3';
import {Pressable, StyleSheet, Text, View, Easing} from 'react-native';
import theme from '../../theme';

// interface GraphData {
//   min: number;
//   max: number;
//   curve: SkPath;
// }

function Graph() {
  //   const transition = useValue(1);
  //   const state = useValue({
  //     current: 0,
  //     next: 1,
  //   });

  //   const GRAPH_HEIGHT = 400;
  //   const GRAPH_WIDTH = 360;

  //   const makeGraph = (data: DataPoint[]): GraphData => {
  //     const min = Math.min(...data.map(val => val.value));
  //     const max = Math.max(...data.map(val => val.value));

  //     const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

  //     const getXAxis = scaleTime()
  //       .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
  //       .range([10, GRAPH_WIDTH - 10]);

  //     const curvedLine = line<DataPoint>()
  //       .x(d => getXAxis(new Date(d.date)))
  //       .y(d => getYAxis(d.value))
  //       .curve(curveBasis)(data);

  //     const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

  //     return {
  //       max,
  //       min,
  //       curve: skPath!,
  //     };
  //   };

  //   const transitionStart = (end: number) => {
  //     state.current = {
  //       current: end,
  //       next: state.current.current,
  //     };
  //     transition.current = 0;
  //     runTiming(transition, 1, {
  //       duration: 500,
  //       easing: Easing.inOut(Easing.cubic),
  //     });
  //   };

  //   const graphData = [makeGraph(originalData), makeGraph(animatedData)];

  //   const path = useComputedValue(() => {
  //     const start = graphData[state.current.current].curve;
  //     const end = graphData[state.current.next].curve;
  //     const result = start.interpolate(end, transition.current);
  //     return result?.toSVGString() ?? '0';
  //   }, [state, transition]);

  return (
    <View style={styles.container}>
      {/* <Canvas style={{height: GRAPH_HEIGHT, width: GRAPH_WIDTH}}>
        <Line
          strokeWidth={1}
          color={theme.colors.lightGrey}
          p1={vec(10, 130)}
          p2={vec(400, 130)}
        />
        <Line
          strokeWidth={1}
          color={theme.colors.lightGrey}
          p1={vec(10, 250)}
          p2={vec(400, 250)}
        />
        <Line
          strokeWidth={1}
          color={theme.colors.lightGrey}
          p1={vec(10, 370)}
          p2={vec(400, 370)}
        />
        <Path style="stroke" path={path} strokeWidth={4} color="#6231ff" />
      </Canvas>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => transitionStart(0)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Graph 1</Text>
        </Pressable>
        <Pressable
          onPress={() => transitionStart(1)}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Graph 2</Text>
        </Pressable>
      </View> */}
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
