import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(30, 'Maximun 30 characters')
    .required('Please enter username')
    .test({
      message: 'Username is already taken',
      // TODO: Below code runs on all field changes, can move to onSubmit but issue with error
      // staying OR try jul 31 2020 in github issue
      // https://github.com/jaredpalmer/formik/issues/512
      test: async (value /* testContext */): Promise<boolean> => {
        // console.log({testContext});
        if (value!?.length >= 3) {
          const usernames = await firestore()
            .collection('Usernames')
            .doc(value)
            .get();
          const usernamesCapitals = await firestore()
            .collection('Usernames')
            .doc(value?.toLowerCase())
            .get();
          if (usernames.exists || usernamesCapitals.exists) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      },
    }),
  email: Yup.string()
    .email('Please enter email')
    .required('Valid email address is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(30, 'Maximun 30 characters')
    .required('Password is required'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter email')
    .required('Valid email address is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(30, 'Maximun 30 characters')
    .required('Password is required'),
});
