import React, {useState} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {Formik} from 'formik';
import FormInput from '../../../components/Inputs/FormInput';
import FormError from '../../../components/Erorrs/FormError';
import theme from '../../../theme';
import firestore from '@react-native-firebase/firestore';
import useAuthFacade from '../../../facades/useAuthFacade';
import {loginSignupValidationSchema} from '../../../utils/validations';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthParamList} from '../../../stacks/Auth/AuthParamList';

function Login() {
  const navigation: NativeStackNavigationProp<AuthParamList, 'SignUp'> =
    useNavigation();
  const {emailLogin, onGoogleButtonPress} = useAuthFacade();

  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const usersCollection = firestore()
    .collection('photos')
    .doc('VpQxGZqBvdupc7vkhRzg');
  // console.log('LOGIN COLLECTION', usersCollection.doc('VpQxGZqBvdupc7vkhRzg'));
  // console.log('LOGIN COLLECTION', usersCollection);

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
          emailLogin(trimmedValues.email, trimmedValues.password);
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
              title="Login"
            />
            {/* {isLoading ? <ActivityIndicator color={theme.black} /> : <>ログイン</>} */}
          </View>
        )}
      </Formik>
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      <Button
        title="Sign Up with Email"
        onPress={() => navigation.navigate('SignUp')}
      />
    </SafeAreaView>
  );
}

export default Login;
