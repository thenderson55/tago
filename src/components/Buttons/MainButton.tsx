import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import theme from '../../theme';

type Props = {
  text: string;
  // children?: ReactNode;
  style?: {};
  onPress: Function;
  disabled?: boolean;
  spinner?: boolean;
};

const MainButton = (props: Props) => {
  const {text, style, onPress, disabled, spinner} = props;
  return (
    <TouchableOpacity
      style={{
        ...style,
      }}
      onPress={() => onPress()}
      disabled={disabled}>
      <View style={styles.button}>
        {spinner ? (
          <ActivityIndicator size="large" color={'white'} />
        ) : (
          <Text style={styles.buttonText}>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface Styles {
  button: {};
  buttonText: {};
}

const styles: Styles = StyleSheet.create({
  button: {
    padding: 10,
    width: '100%',
    height: theme.sizes.formHeight,
    backgroundColor: theme.colors.secondary,
    // marginVertical: (Dimensions.get("window").height / 40) * 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: theme.margins.buttonTop,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
  },
});

export default MainButton;
