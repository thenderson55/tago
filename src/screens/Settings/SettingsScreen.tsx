import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MainButton from '../../components/Buttons/MainButton';
import theme from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScrollView} from 'native-base';
import {SettingsParamList} from '../../stacks/Settings/SettingsParamList';
import usePhotosStore from '../../store/usePhotosStore';

function SettingsScreen() {
  const navigation: NativeStackNavigationProp<SettingsParamList> =
    useNavigation();
  const {setRandomImage, randomImage} = usePhotosStore();
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <MainButton
          text="Edit Categories"
          onPress={() => navigation.navigate('EditCategories')}
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
        <MainButton
          text={randomImage ? 'Hide Random Image' : 'Show Random Image'}
          onPress={() => setRandomImage()}
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
