import React, {useState} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import FormInput from '../../../components/Inputs/FormInput';
import FormError from '../../../components/Erorrs/FormError';
import theme from '../../../theme';
import {loginValidationSchema} from '../../../utils/validations';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthParamList} from '../../../stacks/Auth/AuthParamList';
import useAuthStore from '../../../store/useAuthStore';
import MainButton from '../../../components/Buttons/MainButton';

function Login() {
  const navigation: NativeStackNavigationProp<AuthParamList, 'SignUp'> =
    useNavigation();
  const {emailLogin, onGoogleButtonPress, loading} = useAuthStore();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <SafeAreaView>
      <View style={{margin: theme.margins.screen}}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={values => {
            const trimmedValues = {
              email: values.email.trim(),
              password: values.password.trim(),
            };
            emailLogin(trimmedValues.email, trimmedValues.password);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <View>
              <FormInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="例：tago@tago.com"
                label="Email"
              />
              <FormError touched={touched.email} message={errors.email} />

              <FormInput
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
                password={true}
                secureTextEntry={hidePassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="例：1245678"
                label="Password"
              />
              <FormError touched={touched.password} message={errors.password} />
              <MainButton
                style={{marginTop: 25, marginBottom: 30}}
                onPress={() => handleSubmit()}
                disabled={loading}
                // spinner={loading}
                text="Login"
              />
              {/* {loading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
            </View>
          )}
        </Formik>
        <MainButton
          text="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
        <MainButton
          text="Sign Up with Email"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </SafeAreaView>
  );
}

export default Login;
