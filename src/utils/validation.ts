import * as Yup from 'yup';

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters') 
    .matches(specialCharRegex, 'Password must contain at least one special character')
    .required('Password is required'),
});

export const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address with @ and .com')
    .required('Email is required'),
  firstName: Yup.string() 
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be at most 100 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be at most 100 characters')
    .required('Last name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(specialCharRegex, 'Password must contain at least one special character')
    .required('Password is required'),
  userName: Yup.string()
    .min(2, 'Username must be at least 2 characters')
    .max(100, 'Username must be at most 100 characters')
    .required('Username is required'),
});