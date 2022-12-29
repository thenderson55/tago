import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

type Props = {
  style?: {};
  disabled?: boolean;
  modalClose?: Function;
  map?: boolean;
};
const BackButton = (props: Props) => {
  const {style, disabled, modalClose, map} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={1}
      onPress={() => (modalClose ? modalClose() : navigation.goBack())}
      style={!map ? {...styles.wrapper, ...style} : {...style}}>
      {/* <View /> */}
      <Ionicons
        name={'arrow-back-circle-outline'}
        // name={'arrow-back-outline'}
        size={50}
        color={theme.colors.black}
      />
    </TouchableOpacity>
  );
};

interface Styles {
  wrapper: {};
}

const styles: Styles = StyleSheet.create({
  wrapper: {
    ...theme.boxShadows.light,
    margin: 5,
    marginLeft: 15,
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton;
