import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import useUserStore from '../../store/useUserStore';

type Props = {
  style?: {};
  disabled?: boolean;
  modalClose?: Function;
  map?: boolean;
};
const BackButton = (props: Props) => {
  const {style, disabled, modalClose, map} = props;
  const {tabStatus} = useUserStore();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={1}
      // onPress={() => (modalClose ? modalClose() : navigation.goBack())}
      onPress={() =>
        modalClose ? modalClose() : navigation.navigate(tabStatus)
      }
      style={!map ? {...styles.wrapper, ...style} : {...style}}>
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
