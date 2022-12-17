import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  message: string | undefined;
  spaceFiller?: boolean;
}

function ResponseError(props: Props) {
  const {message, spaceFiller} = props;
  if (message) {
    return (
      <View>
        <Text style={styles.error}>{message}</Text>
      </View>
    );
  }
  if (spaceFiller) {
    return <View style={styles.filler} />;
  } else {
    return <View />;
  }
}

const styles = StyleSheet.create({
  error: {color: 'red', fontSize: 16, height: 20, marginTop: 20},
  filler: {height: 20},
});

export default ResponseError;
