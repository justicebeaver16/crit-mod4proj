const { validationResult } = require('express-validator');
const { check, query } = require('express-validator');

//middleware for formatting errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => 
        errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
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

//validate spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

//validate query
const validateQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be greater than or equal to 1'),
  query('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be between 1 and 20'),
  query('minLat')
    .optional()
    .isDecimal()
    .withMessage('Minimum latitude is invalid'),
  query('maxLat')
    .optional()
    .isDecimal()
    .withMessage('Maximum latitude is invalid'),
  query('minLng')
    .optional()
    .isDecimal()
    .withMessage('Minimum longitude is invalid'),
  query('maxLng')
    .optional()
    .isDecimal()
    .withMessage('Maximum longitude is invalid'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors, validateQuery, validateSignup, validateSpot, 
};