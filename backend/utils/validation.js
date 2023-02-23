const { validationResult } = require('express-validator');

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
      "statusCode": 400,
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







module.exports = {
  handleValidationErrors
};
