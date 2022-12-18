import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import FormInput from '../../../components/Inputs/FormInput';
import FormError from '../../../components/Erorrs/FormError';
import theme from '../../../theme';
import {forgotPasswordValidationSchema} from '../../../utils/validations';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthParamList} from '../../../stacks/Auth/AuthParamList';
import useAuthStore from '../../../store/useAuthStore';
import MainButton from '../../../components/Buttons/MainButton';
import ResponseError from '../../../components/Erorrs/ResponseError';

function ForgotPassword() {
  // const navigation: NativeStackNavigationProp<AuthParamList, 'SignUp'> =
  //   useNavigation();
  const {forgotPassword, loading} = useAuthStore();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <SafeAreaView>
      <View style={{margin: theme.margins.screen}}>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={values => {
            const trimmedValues = {
              email: values.email.trim(),
            };
            forgotPassword(trimmedValues.email);
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
              <MainButton
                style={{marginTop: 25, marginBottom: 30}}
                onPress={() => handleSubmit()}
                disabled={loading}
                spinner={loading}
                text="Send email link">
                {/* <ResponseError message={loginError} /> */}
              </MainButton>
              {/* {loading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default ForgotPassword;
