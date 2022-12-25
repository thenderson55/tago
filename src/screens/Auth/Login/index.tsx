import React, {useState} from 'react';
import {Platform, SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import InputForm from '../../../components/Inputs/InputForm';
import FormError from '../../../components/Erorrs/FormError';
import theme from '../../../theme';
import {loginValidationSchema} from '../../../utils/validations';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthParamList} from '../../../stacks/Auth/AuthParamList';
import useAuthStore from '../../../store/useAuthStore';
import MainButton from '../../../components/Buttons/MainButton';
import ResponseError from '../../../components/Erorrs/ResponseError';

function Login() {
  const navigation: NativeStackNavigationProp<AuthParamList, 'SignUp'> =
    useNavigation();
  const {
    emailLogin,
    onGoogleButtonPress,
    loading,
    onFacebookButtonPress,
    loginError,
  } = useAuthStore();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.muted,
      }}>
      <View
        style={{
          margin: theme.margins.screen,
        }}>
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
              <InputForm
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="例：tago@tago.com"
                label="Email"
              />
              <FormError touched={touched.email} message={errors.email} />

              <InputForm
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
                spinner={loading}
                text="Login">
                <ResponseError message={loginError} />
              </MainButton>
              {/* {loading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
            </View>
          )}
        </Formik>
        {Platform.OS === 'android' && (
          <MainButton
            text="Google Sign-In"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
            disabled={loading}
          />
        )}

        <MainButton
          text="Facebook Sign-In"
          onPress={() =>
            onFacebookButtonPress().then(() =>
              console.log('Signed in with Facebook!'),
            )
          }
          disabled={loading}
        />
        <MainButton
          text="Sign Up with Email"
          onPress={() => navigation.navigate('SignUp')}
          disabled={loading}
        />
        <MainButton
          text="Forgot Password"
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

export default Login;
