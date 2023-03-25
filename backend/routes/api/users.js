const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



//Middleware for post that will check keys and validate them
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error('User with that email already exists');
      }
      return true;
    }),
    check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        throw new Error('User with that username already exists');
      }
      return true;
    }),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];



//Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
);















// // Sign up
// router.post('/', validateSignup, async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;
//     const existingUser = await User.findOne({ where: { email } });

//     if (existingUser) {
//       return res.status(403).json({
//         message: 'User already exists',
//         statusCode: 403,
//         errors: {
//           email: 'User with that email already exists'
//         }
//       });
//     }

//     const user = await User.signup({ firstName, lastName, email, password });

//     const token = await setTokenCookie(res, user);

//     return res.status(200).json({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       token
//     });

//   } catch (err) {
//     // handle unexpected errors
//     console.error(err);
//     return res.status(500).json({
//       message: 'Internal Server Error',
//       statusCode: 500,
//       errors: {}
//     });
//   }
// });



module.exports = router;
