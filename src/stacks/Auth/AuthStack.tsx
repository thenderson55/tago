import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthParamList} from './AuthParamList';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/SignUp';

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
        name="SignUp"
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
    </Stack.Navigator>
  );
}

export default AuthStack;
