import React from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
} from 'react-native';
import theme from '../../theme';

type Props = {
  onChangeText: (text: string) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  value: string;
  placeholder: string;
  label?: string;
  secureTextEntry?: boolean;
  style?: {};
  keyboardType?: KeyboardTypeOptions;
};

const InputTextArea = (props: Props) => {
  const {
    secureTextEntry,
    onChangeText,
    onBlur,
    value,
    placeholder,
    style,
    label,
    keyboardType,
  } = props;
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <View>
        <TextInput
          maxLength={250}
          textAlignVertical={'top'}
          multiline={true}
          style={[styles.input, {...style}]}
          secureTextEntry={secureTextEntry || false}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.lightGrey}
          keyboardType={keyboardType || 'default'}
        />
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
    // height: theme.sizes.formHeight,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    lineHeight: 20,
    fontSize: theme.fontSizes.medium,
    width: '100%',
    height: 90,
  },
  label: {
    color: theme.colors.black,
    marginBottom: 9,
    fontSize: theme.fontSizes.small,
    marginTop: theme.margins.mediumTop,
  },
});

export default InputTextArea;
