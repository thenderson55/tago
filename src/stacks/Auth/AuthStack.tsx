import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthParamList} from './AuthParamList';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/SignUp';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import SupportScreen from '../../screens/SupportScreen';

const Stack = createNativeStackNavigator<AuthParamList>();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        options={{
          header: () => null,
        }}
        component={Login}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{title: 'Forgot Password'}}
      />
      <Stack.Screen
        name="SignUp"
        options={{title: 'Sign Up'}}
        // options={{
        //   header: () => null,
        //   headerLeft: () => null,
        // }}
        // options={() => ({
        //   headerTitleStyle: {alignSelf: 'center', color: `${theme.pink}`},
        //   headerStyle: {backgroundColor: 'white'},
        //   headerTitle: '新規ユーザー登録',
        //   headerLeft: () => null,
        // })}
        // component={SignUpStack}
        component={SignUp}
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

export default AuthStack;
