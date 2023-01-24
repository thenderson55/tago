import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import useUserStore from '../../store/useUserStore';
import theme from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScrollView} from 'native-base';
import ModalCategories from '../../components/Modals/ModalCategories';
import {SettingsParamList} from '../../stacks/Settings/SettingsParamList';

function SettingsScreen() {
  const {loading, clearErrors, user} = useUserStore();
  const navigation: NativeStackNavigationProp<SettingsParamList> =
    useNavigation();

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
        <MainButton
          text="Account"
          onPress={() => navigation.navigate('Account')}
        />
        <MainButton
          text="Privacy policy"
          onPress={() => navigation.navigate('Privacy')}
        />
        <MainButton
          text="Support"
          onPress={() => navigation.navigate('Support')}
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
