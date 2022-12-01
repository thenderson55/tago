import React from 'react';
import {View, Text} from 'react-native';
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
        <Text style={{color: 'red', fontSize: 12, height: 20, marginTop: 5}}>
          {message}
        </Text>
      </View>
    );
  }
  if (spaceFiller) {
    return <View style={{height: 20}} />;
  } else {
    return <View />;
  }
}

export default FormError;
