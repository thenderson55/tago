import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Column = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  return <View style={[styles.column, style]}>{children}</View>;
};

const Row = ({children, style}: {children: React.ReactNode; style?: any}) => {
  return <View style={[styles.row, style]}>{children}</View>;
};

export const UnorderedList = ({texts}: {texts: string[]}) => {
  return (
    <Column style={styles.wrapper}>
      {texts.map((t, index) => (
        <Row key={index}>
          <Column style={styles.bulletWrapper}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
          </Column>
          <Column>
            <Text style={styles.text}>{t}</Text>
          </Column>
        </Row>
      ))}
    </Column>
  );
};

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 3,
  },
  wrapper: {
    marginVertical: 10,
  },
  bulletWrapper: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 12,
    transform: [{scale: 2.5}],
  },
  bullet: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 16,
  },
});
