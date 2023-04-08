const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();




//middleware to connect to POST/login
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email is required'), //OG- Please provide a valid email or username.
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];


//test route to hit endpoints
// router.use((req,res,next) => {

//   console.log("+ + + + + ")
//   next();
// })



// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    console.log( "----")

    const user = await User.login({ credential, password});

    if (!user) {
 return res.status(401).json({
  "message": "Invalid Credentials"
  //"statusCode": 401
})
    }

    await setTokenCookie(res, user);

    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      }
       // OG --> user
    });
  }
);


//THIS IS A TEST


// Log out
router.delete(
  '/',
  (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);



// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json(
      {
        //message: "Authentication required",
        user: null
      });
  }
);


// Get the Current User - NOT NEEDED
router.get('/session',restoreUser,(req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        },
      });
    } else {
      return res.json({ user: null });
    }
  }
);


module.exports = router;
