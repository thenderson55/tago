import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
interface Props {
  touched: boolean | undefined;
  message: string | undefined;
  spaceFiller?: boolean;
}

function FormError(props: Props) {
  const {touched, message, spaceFiller} = props;
  if (touched && message) {
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
  error: {color: 'red', fontSize: 12, height: 20, marginTop: 5},
  filler: {height: 20},
});

export default FormError;
