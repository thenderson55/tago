import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';

export const loginSignupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(30, 'Maximun 30 characters')
    .required('Please enter username')
    .test({
      message: 'Username is already taken',
      test: async (value): Promise<boolean> => {
        if (value!?.length >= 3) {
          const usernames = await await firestore()
            .collection('Usernames')
            .doc(value)
            .get();
          const usernamesCapitals = await await firestore()
            .collection('Usernames')
            .doc(value?.toLowerCase())
            .get();
          console.log('Username check: ', usernames.exists);
          console.log('Username capitals check: ', usernamesCapitals.exists);
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
