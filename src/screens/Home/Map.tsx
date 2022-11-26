import React from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import theme from '../../theme';

function Map() {
  return (
    <SafeAreaView style={styles.safeView}>
      <View>
        <Text>MAP</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    margin: theme.margins.screen,
  },
});

export default Map;
