import React from 'react';
import {
  View,
  NativeSyntheticEvent,
  TouchableOpacity,
  TextInput,
  TextInputFocusEventData,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
} from 'react-native';
import theme from '../../theme';
// import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onChangeText: (text: string) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  value: string;
  placeholder: string;
  label?: string;
  secureTextEntry?: boolean;
  style?: {};
  keyboardType?: KeyboardTypeOptions;
  password?: boolean;
  hidePassword?: boolean;
  setHidePassword?: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormInput = (props: Props) => {
  const {
    secureTextEntry,
    onChangeText,
    onBlur,
    value,
    placeholder,
    style,
    label,
    keyboardType,
    password,
    hidePassword,
    setHidePassword,
  } = props;
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={password && styles.wrapper}>
        <TextInput
          style={[styles.input, {...style}]}
          secureTextEntry={secureTextEntry || false}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.lightGrey}
          keyboardType={keyboardType || 'default'}
        />
        {/* {password && setHidePassword && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              style={styles.icon}
              name={hidePassword ? 'eye' : 'eye-off'}
              size={30}
              color={theme.colors.grey}
            />
          </TouchableOpacity>
        )} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    color: theme.colors.black,
    borderColor: theme.colors.black,
    borderWidth: 2,
    borderRadius: 15,
    height: theme.sizes.formHeight,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: theme.fontSizes.medium,
    width: '100%',
  },
  label: {
    color: theme.colors.black,
    marginBottom: 9,
    fontSize: theme.fontSizes.small,
  },
  icon: {
    right: 40,
  },
});

export default FormInput;
