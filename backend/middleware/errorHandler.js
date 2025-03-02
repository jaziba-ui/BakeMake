const errorHandler = (err) => {
  console.log("message:" , err.message,"code", err.code);

  const errors = { email: '', password: '', name: '', location: '' };

  // Handle specific errors like incorrect email/password
  if (err.message === 'incorrect email') {
    errors.email = 'This email is not registered yet!';
    return errors;
  }

  if (err.message === 'incorrect password') {
    errors.password = 'This password is incorrect';
    return errors;
  }

  // Handle duplicate email error
  if (err.code === 11000) {
    errors.email = 'This email is already registered';
    return errors;
  }

  if (err.message === 'no access') {
    errors.email = 'YOU ARE NOT PROVIDED ACCESS';
    return errors; // Add this missing return
  }

  if (err.message === 'not found or invalid') {
    errors.email = 'Not found or invalid credentials';
    return errors;
  }

  if (err.message === 'server error') {
    errors.email = 'An internal server error occurred';
    return errors;
  }

  // console.log(err.message)
  // Handle validation errors
  if (err.errors) {
    Object.values(err.errors).forEach((property) => {
    console.log(errors[property.path])
      errors[property.path] = property.message;
    });
    return errors;
  }

  // Return a generic error if no specific errors are matched
  errors.email = 'An unknown error occurred';
  return errors;
};

module.exports = errorHandler