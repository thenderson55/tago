import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AccountParamList} from './AccountParamList';
import useUserStore from '../../store/useUserStore';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import SupportScreen from '../../screens/SupportScreen';
import AccountScreen from '../../screens/Account/AccountScreen';
import theme from '../../theme';

const Stack = createNativeStackNavigator<AccountParamList>();

function AccountStack() {
  const {user} = useUserStore();

  return (
    <Stack.Navigator initialRouteName="Account">
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

export default AccountStack;
