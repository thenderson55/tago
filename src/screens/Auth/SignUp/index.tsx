import React, {useState} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import FormError from '../../../components/Erorrs/FormError';
import FormInput from '../../../components/Inputs/FormInput';
import theme from '../../../theme';
import {signupValidationSchema} from '../../../utils/validations';
import useAuthStore from '../../../store/useAuthStore';
import useUserStore from '../../../store/useUserStore';
import MainButton from '../../../components/Buttons/MainButton';

function SignUp() {
  const {addUser} = useUserStore();
  const {emailSignUp, loading} = useAuthStore();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <SafeAreaView>
      <View style={{margin: theme.margins.screen}}>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={values => {
            const trimmedValues = {
              username: values.username.trim(),
              email: values.email.trim(),
              password: values.password.trim(),
            };
            emailSignUp(trimmedValues, addUser);
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
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                placeholder="e.g tago12345"
                label="Username"
              />
              <FormError
                touched={touched.username}
                message={errors.username}
                // message={
                //   isTaken ? 'Username is already taken' : errors.username
                // }
              />
              <FormInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="e.g tago@tago.com"
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
                placeholder="e.g 1245678"
                label="Password"
              />
              <FormError touched={touched.password} message={errors.password} />
              <MainButton
                style={{marginTop: 25}}
                onPress={() => handleSubmit()}
                disabled={loading}
                // spinner={isLoading}
                text="Sign Up"
              />
              {/* {isLoading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default SignUp;
