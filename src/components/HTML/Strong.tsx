import React from 'react';
import {StyleSheet, Text} from 'react-native';

export const Strong = (props: any) => (
  <Text style={styles.bold}>{props.children}</Text>
);

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});
