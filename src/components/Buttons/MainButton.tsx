import React, {Children, ReactNode} from 'react';
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
  onPress: Function;
  children?: ReactNode;
  style?: {};
  disabled?: boolean;
  spinner?: boolean;
};

const MainButton = (props: Props) => {
  const {text, style, onPress, disabled, spinner, children} = props;
  return (
    <TouchableOpacity
      style={{
        ...style,
      }}
      onPress={() => onPress()}
      disabled={disabled}>
      <View
        style={{
          ...styles.button,
          backgroundColor: disabled
            ? theme.colors.grey
            : theme.colors.secondary,
        }}>
        {spinner ? (
          <ActivityIndicator size="large" color={'white'} />
        ) : (
          <Text style={styles.buttonText}>{text}</Text>
        )}
      </View>
      {children}
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
    marginTop: theme.margins.mediumTop,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
  },
});

export default MainButton;
