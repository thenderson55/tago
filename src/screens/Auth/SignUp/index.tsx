import React, {useState} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import FormError from '../../../components/Erorrs/FormError';
import FormInput from '../../../components/Inputs/FormInput';
import theme from '../../../theme';
import {loginSignupValidationSchema} from '../../../utils/validations';
import useUserFacade from '../../../facades/useUserFacade';
import useAuthFacade from '../../../facades/useAuthFacade';

function SignUp() {
  const {addUser} = useUserFacade();
  const {emailSignUp} = useAuthFacade();
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <SafeAreaView style={{padding: theme.margins.screen}}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSignupValidationSchema}
        onSubmit={values => {
          const trimmedValues = {
            email: values.email.trim(),
            password: values.password.trim(),
          };
          setIsLoading(true);
          emailSignUp(trimmedValues.email, trimmedValues.password, addUser);
        }}>
        {({
          values,
          errors,
          // touched,
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
            <FormError message={errors.email} />
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
            <FormError message={errors.password} />
            <Button
              onPress={() => handleSubmit()}
              disabled={isLoading}
              // spinner={isLoading}
              title="Sign Up"
            />
            {/* {isLoading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

export default SignUp;
