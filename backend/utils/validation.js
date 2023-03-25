const { validationResult } = require('express-validator');
const { Event, Group, User, Membership, Venue, EventImage, Attendance } = require('../db/models');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)


//ORIGINAL
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);


    //Not OG
    return res.status(400).json({
      "message": "Validation Error",
      //"statusCode": 400,
      "errors": errors
    })





    //OG
    //   const err = new Error();
    //   err.message = "Validation Error"
    //   err.errors = errors;
    //   err.status = 400;
    //   err.title = "Bad request.";
    //   next(err);
    // }
    // next();
  };

  next();
}



//TEST
// const handleValidationErrors = (req, res, next) => {
//   const validationErrors = validationResult(req);

//   if (!validationErrors.isEmpty()) {
//     const errors = {};
//     validationErrors.array().forEach(error => {
//       errors[error.param] = error.msg;
//     });

//     const err = new Error("Validation Error");
//     err.status = 400;
//     err.errors = errors;
//     next(err);
//   } else {
//     next();
//   }
// };
const validateEvent = [
  check('venueId')
    .custom(async (value) => {
      const venue = await Venue.findOne(
        {
          where:
          {
            groupId: value
          }
        });
      if (!venue) {
        throw new Error('Venue does not exist');
      }
      return true;
    }),
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ max: 60, min: 5 })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Price is invalid'),
  check('description')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('Description is required'),
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date must be in the future'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is less than start date')
];




//CHECK. ISNT WORKING

const handleQueryParameters = (name,type,startDate,page,size) => {
  // Validate query parameters
const errors = {};
if (page < 1 || page > 10) {
  errors.page = 'Page must be between 1 and 10';
}
if (size < 1 || size > 20) {
  errors.size = 'Size must be between 1 and 20';
}
if (name && typeof name !== 'string') {
  errors.name = 'Name must be a string';
}
if (type && !['Online', 'In Person'].includes(type)) {
  errors.type = "Type must be 'Online' or 'In Person'";
}
if (startDate && isNaN(Date.parse(startDate))) {
  errors.startDate = 'Start date must be a valid datetime';
}

// If errors exist, return a 400 response with the errors object
if (Object.keys(errors).length) {
  return res.status(400).json({ message: 'Bad Request', errors });
}

}



module.exports = {
  handleValidationErrors,
  handleQueryParameters,
  validateEvent
};
