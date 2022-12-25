import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import InputForm from '../../../components/Inputs/InputForm';
import FormError from '../../../components/Erorrs/FormError';
import theme from '../../../theme';
import {forgotPasswordValidationSchema} from '../../../utils/validations';
import useAuthStore from '../../../store/useAuthStore';
import MainButton from '../../../components/Buttons/MainButton';
import ResponseError from '../../../components/Erorrs/ResponseError';

function ForgotPassword() {
  const {forgotPassword, loading, resetPasswordMessage} = useAuthStore();

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
              <InputForm
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
                text="Reset Password">
                <ResponseError message={resetPasswordMessage} />
              </MainButton>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default ForgotPassword;
