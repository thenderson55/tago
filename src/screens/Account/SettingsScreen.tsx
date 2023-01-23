import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import theme from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from '../../stacks/Home/HomeParamList';
import {ScrollView} from 'native-base';
import ModalCategories from '../../components/Modals/ModalCategories';

function SettingsScreen() {
  const {loading, clearErrors, user} = useUserStore();
  const navigation: NativeStackNavigationProp<HomeParamList> = useNavigation();

  const [modalCategories, setModalCategories] = useState(false);
  const modalCategoriesClose = () => {
    setModalCategories(false);
  };
  const modalCategoriesOpen = () => {
    setModalCategories(true);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <ModalCategories
          modalBool={modalCategories}
          modalClose={modalCategoriesClose}
        />
        <MainButton
          onPress={modalCategoriesOpen}
          text="Edit Categories"
          disabled={loading}
          spinner={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    margin: theme.margins.screen,
  },
  text: {
    fontSize: theme.fontSizes.medium,
    marginVertical: 10,
  },
});

export default SettingsScreen;
