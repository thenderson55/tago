import React from 'react';
import {View, Text} from 'react-native';

function FormError({
  touched,
  message,
}: {
  touched: boolean | undefined;
  message: string | undefined;
}) {
  if (touched && message) {
    return (
      <View>
        <Text style={{color: 'red', fontSize: 12, height: 20, marginTop: 5}}>
          {message}
        </Text>
      </View>
    );
  }
  return <View style={{height: 20}} />;
}

export default FormError;
