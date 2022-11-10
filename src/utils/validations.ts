import * as Yup from 'yup';

export const loginSignupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter email')
    .required('Valid email address is required'),
  password: Yup.string()
    .min(6, 'Minimum 6')
    .max(30, 'Maximun 30')
    .required('Password is required'),
});
