import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeParamList} from './HomeParamList';

// import theme from "../../theme";
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/SignUp';
import Home from '../../screens/Home';

const Stack = createNativeStackNavigator<HomeParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      // screenOptions={{
      //   header:() => null
      // }}
      initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{
          header: () => null,
        }}
        component={Home}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
