import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingsParamList} from './SettingsParamList';
import useUserStore from '../../store/useUserStore';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import SupportScreen from '../../screens/SupportScreen';
import AccountScreen from '../../screens/Settings/AccountScreen';
import theme from '../../theme';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import EditCategoriesScreen from '../../screens/Settings/EditCategoriesScreen';

const Stack = createNativeStackNavigator<SettingsParamList>();

function SettingsStack() {
  const {user} = useUserStore();

  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        options={() => ({
          title: 'Settings',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        options={() => ({
          title: 'Edit Categories',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        name="EditCategories"
        component={EditCategoriesScreen}
      />
      <Stack.Screen
        options={() => ({
          title: user.displayName || user.email || 'Account',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        name="Account"
        component={AccountScreen}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyPolicyScreen}
        options={{title: 'Privacy Policy'}}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{title: 'Support'}}
      />
    </Stack.Navigator>
  );
}

export default SettingsStack;
