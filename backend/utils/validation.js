const { validationResult } = require('express-validator');
const { check } = require('express-validator');

//middleware for formatting errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

//validate signup
const validateSignup = [
  check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
  check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
  check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
  check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors, validateSignup
};